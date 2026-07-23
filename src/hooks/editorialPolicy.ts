import type {
  CollectionBeforeChangeHook,
  CollectionBeforeOperationHook,
  GlobalBeforeChangeHook,
  GlobalBeforeOperationHook,
  PayloadRequest,
} from 'payload'
import { APIError } from 'payload'

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

/** A publicação é uma decisão de quem edita o conteúdo; não há etapa obrigatória de revisão. */
export const enforceEditorDraftOnly: CollectionBeforeOperationHook = ({ args }) => args

export const enforceGlobalEditorDraftOnly: GlobalBeforeOperationHook = ({ args }) => args

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
    // O status de revisão é somente informativo: nunca bloqueia publicação.
    if (rule.path === 'statusRevisao' || rule.path.endsWith('.statusRevisao')) continue
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

export const validatePublication = (rules: PublicationRule[]): CollectionBeforeChangeHook =>
  async ({ data, originalDoc, req }) => {
    const merged = deepMerge((originalDoc ?? {}) as AnyDoc, data as AnyDoc)
    const document = deepMerge(merged, data as AnyDoc)
    if (isPublishingRequest(data as AnyDoc, originalDoc as AnyDoc | undefined, req)) {
      await validateRules(document, rules, req)
    }
    return data
  }

export const validateGlobalPublication = (rules: PublicationRule[]): GlobalBeforeChangeHook =>
  async ({ data, originalDoc, req }) => {
    const merged = deepMerge((originalDoc ?? {}) as AnyDoc, data as AnyDoc)
    const document = deepMerge(merged, data as AnyDoc)
    if (isPublishingRequest(data as AnyDoc, originalDoc as AnyDoc | undefined, req)) {
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
