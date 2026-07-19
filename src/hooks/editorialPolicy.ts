import type {
  CollectionBeforeChangeHook,
  CollectionBeforeOperationHook,
  GlobalBeforeChangeHook,
  GlobalBeforeOperationHook,
  PayloadRequest,
} from 'payload'
import { APIError } from 'payload'

import { roleOf } from '../access'
import { containsPlaceholder, isBlank, isNonEmptyRichText } from '../utilities/validation'

type AnyDoc = Record<string, unknown>

export type PublicationRule = {
  path: string
  label: string
  optional?: boolean
  richText?: boolean
  rejectPlaceholder?: boolean
  validate?: (value: unknown, document: AnyDoc, req: PayloadRequest) => boolean | Promise<boolean>
  message?: string
}

const flag = (value: unknown): boolean => value === true || value === 'true'

export function isPublishingRequest(
  data: AnyDoc | undefined,
  originalDoc: AnyDoc | undefined,
  req: PayloadRequest,
): boolean {
  if (data?._status === 'draft' || flag(req.query?.draft)) return false
  if (data?._status === 'published') return true
  if (originalDoc?._status === 'published') return true
  return true
}

/** Garante no servidor que editor só crie/atualize usando o modo draft. */
export const enforceEditorDraftOnly: CollectionBeforeOperationHook = ({ args, operation, req }) => {
  if (roleOf(req.user) !== 'editor') return args
  if (operation === 'restoreVersion') {
    throw new APIError(
      'Editores não podem restaurar versões. Peça ao jurídico ou à administração para avaliar o histórico.',
      403,
    )
  }
  if (operation !== 'create' && operation !== 'update') return args

  const operationArgs = (args ?? {}) as {
    data?: AnyDoc
    draft?: boolean
    publishAllLocales?: boolean
    publishSpecificLocale?: string
    unpublishAllLocales?: boolean | string
  }
  const attemptsPublication =
    !flag(operationArgs.draft) ||
    operationArgs.data?._status === 'published' ||
    flag(operationArgs.publishAllLocales) ||
    Boolean(operationArgs.publishSpecificLocale) ||
    flag(operationArgs.unpublishAllLocales)

  if (attemptsPublication) {
    throw new APIError(
      'Editores podem salvar somente rascunhos. Envie o conteúdo para revisão jurídica antes de publicar.',
      403,
    )
  }
  return args
}

export const enforceGlobalEditorDraftOnly: GlobalBeforeOperationHook = ({ args, operation, req }) => {
  if (roleOf(req.user) !== 'editor') return args
  if (operation === 'restoreVersion') {
    throw new APIError(
      'Editores não podem restaurar versões. Peça ao jurídico ou à administração para avaliar o histórico.',
      403,
    )
  }
  if (operation !== 'update') return args
  const operationArgs = (args ?? {}) as {
    data?: AnyDoc
    draft?: boolean
    publishAllLocales?: boolean
    publishSpecificLocale?: string
    unpublishAllLocales?: boolean | string
  }
  if (
    !flag(operationArgs.draft) ||
    operationArgs.data?._status === 'published' ||
    flag(operationArgs.publishAllLocales) ||
    Boolean(operationArgs.publishSpecificLocale) ||
    flag(operationArgs.unpublishAllLocales)
  ) {
    throw new APIError(
      'Editores podem salvar somente rascunhos. A publicação deve ser feita pelo jurídico ou por um administrador.',
      403,
    )
  }
  return args
}

function deepMerge(base: AnyDoc = {}, patch: AnyDoc = {}): AnyDoc {
  const result: AnyDoc = { ...base }
  for (const [key, value] of Object.entries(patch)) {
    const previous = result[key]
    result[key] =
      value &&
      previous &&
      typeof value === 'object' &&
      typeof previous === 'object' &&
      !Array.isArray(value) &&
      !Array.isArray(previous)
        ? deepMerge(previous as AnyDoc, value as AnyDoc)
        : value
  }
  return result
}

export function valueAtPath(document: AnyDoc, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (!value || typeof value !== 'object') return undefined
    return (value as AnyDoc)[key]
  }, document)
}

async function validateRules(document: AnyDoc, rules: PublicationRule[], req: PayloadRequest) {
  const errors: string[] = []
  for (const rule of rules) {
    const value = valueAtPath(document, rule.path)
    const present = rule.optional || (rule.richText ? isNonEmptyRichText(value) : !isBlank(value))
    const clean = !rule.rejectPlaceholder || !containsPlaceholder(value)
    const custom = rule.validate ? await rule.validate(value, document, req) : true
    if (!present || !clean || !custom) errors.push(rule.message ?? rule.label)
  }
  if (errors.length) {
    throw new APIError(`Antes de publicar, revise: ${errors.join('; ')}.`, 400)
  }
}

function stampReview(document: AnyDoc, data: AnyDoc, req: PayloadRequest) {
  const role = roleOf(req.user)
  const control = document.controleEditorial as AnyDoc | undefined
  if (
    (role === 'admin' || role === 'juridico') &&
    (control?.statusRevisao === 'aprovada' || control?.statusRevisao === 'dispensada')
  ) {
    data.controleEditorial = {
      ...(data.controleEditorial as AnyDoc | undefined),
      revisadoPor: (req.user as { id?: string | number } | null)?.id,
      verificadoEm: control.verificadoEm || new Date().toISOString(),
    }
  }
}

/**
 * Todo documento que usa o bloco editorial precisa de uma decisão explícita
 * antes de ir ao público. O campo é protegido no nível do campo, portanto um
 * editor não consegue aprovar o próprio material por uma chamada à API.
 */
function validateEditorialApproval(document: AnyDoc) {
  const control = document.controleEditorial
  if (!control || typeof control !== 'object') return

  const status = (control as AnyDoc).statusRevisao
  if (status !== 'aprovada' && status !== 'dispensada') {
    throw new APIError(
      'Antes de publicar, a revisão jurídica deve ser aprovada ou formalmente dispensada.',
      400,
    )
  }
}

export const validatePublication = (rules: PublicationRule[]): CollectionBeforeChangeHook =>
  async ({ data, originalDoc, req }) => {
    const merged = deepMerge((originalDoc ?? {}) as AnyDoc, data as AnyDoc)
    stampReview(merged, data as AnyDoc, req)
    const document = deepMerge(merged, data as AnyDoc)
    if (isPublishingRequest(data as AnyDoc, originalDoc as AnyDoc | undefined, req)) {
      validateEditorialApproval(document)
      await validateRules(document, rules, req)
    }
    return data
  }

export const validateGlobalPublication = (rules: PublicationRule[]): GlobalBeforeChangeHook =>
  async ({ data, originalDoc, req }) => {
    const merged = deepMerge((originalDoc ?? {}) as AnyDoc, data as AnyDoc)
    stampReview(merged, data as AnyDoc, req)
    const document = deepMerge(merged, data as AnyDoc)
    if (isPublishingRequest(data as AnyDoc, originalDoc as AnyDoc | undefined, req)) {
      validateEditorialApproval(document)
      await validateRules(document, rules, req)
    }
    return data
  }

export async function uploadHasMime(
  value: unknown,
  req: PayloadRequest,
  accepted: string[],
): Promise<boolean> {
  if (isBlank(value)) return false
  const id = typeof value === 'object' && value ? (value as { id?: unknown }).id : value
  if (typeof id !== 'string' && typeof id !== 'number') return false
  const media = await req.payload.findByID({
    collection: 'media',
    id,
    depth: 0,
    overrideAccess: true,
  })
  // Relações públicas não podem apontar para arquivos ainda em rascunho. Isso
  // também impede que uma carga recém-enviada apareça no site antes de passar
  // pela conferência editorial da própria biblioteca de mídia.
  return media._status === 'published' && accepted.includes(media.mimeType ?? '')
}
