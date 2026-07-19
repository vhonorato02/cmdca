const PLACEHOLDER_PATTERN = /\[A CONFIRMAR\]|\b(?:a confirmar|ilustrativ[oa]s?|lorem ipsum|texto de teste)\b/i

export const isBlank = (value: unknown): boolean =>
  value == null || (typeof value === 'string' && value.trim().length === 0)

/**
 * Procura marcadores editoriais também dentro do JSON do editor rico. Assim,
 * "a confirmar" em um parágrafo não passa pela validação só porque o campo
 * não é uma string simples.
 */
export const containsPlaceholder = (value: unknown): boolean => {
  if (typeof value === 'string') return PLACEHOLDER_PATTERN.test(value)
  if (Array.isArray(value)) return value.some(containsPlaceholder)
  if (value && typeof value === 'object') return Object.values(value).some(containsPlaceholder)
  return false
}

export function isSafeURL(value: unknown, allowRelative = false): boolean {
  if (typeof value !== 'string' || !value.trim()) return false
  const candidate = value.trim()

  if (allowRelative && candidate.startsWith('/') && !candidate.startsWith('//')) {
    return !candidate.includes('\\') && !/[\u0000-\u001f]/.test(candidate)
  }

  try {
    const url = new URL(candidate)
    return (url.protocol === 'https:' || url.protocol === 'http:') && Boolean(url.hostname)
  } catch {
    return false
  }
}

export const validateExternalURL = (value: unknown): true | string =>
  isBlank(value) || isSafeURL(value)
    ? true
    : 'Informe uma URL completa começando com https:// ou http://.'

export const validatePublicHref = (value: unknown): true | string =>
  isBlank(value) || isSafeURL(value, true)
    ? true
    : 'Use um caminho interno começando com / ou uma URL https:// ou http://.'

export const validateEmail = (value: unknown): true | string => {
  if (isBlank(value)) return true
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    ? true
    : 'Informe um e-mail válido.'
}

export const validateTime = (value: unknown): true | string =>
  isBlank(value) || (typeof value === 'string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value))
    ? true
    : 'Use o formato 24 horas HH:mm, por exemplo 14:30.'

export const validateLatitude = (value: unknown): true | string =>
  value == null || (typeof value === 'number' && value >= -90 && value <= 90)
    ? true
    : 'A latitude deve estar entre -90 e 90.'

export const validateLongitude = (value: unknown): true | string =>
  value == null || (typeof value === 'number' && value >= -180 && value <= 180)
    ? true
    : 'A longitude deve estar entre -180 e 180.'

export function isNonEmptyRichText(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const root = (value as { root?: { children?: unknown[] } }).root
  return Array.isArray(root?.children) && root.children.some(hasRichTextContent)
}

function hasRichTextContent(node: unknown): boolean {
  if (!node || typeof node !== 'object') return false
  const candidate = node as { text?: unknown; children?: unknown[]; type?: unknown }
  if (typeof candidate.text === 'string' && candidate.text.trim()) return true
  if (candidate.type === 'upload' || candidate.type === 'horizontalrule') return true
  return Array.isArray(candidate.children) && candidate.children.some(hasRichTextContent)
}

export function validateCoordinatePair(data: Record<string, unknown>): true | string {
  const hasLat = typeof data.lat === 'number'
  const hasLng = typeof data.lng === 'number'
  return hasLat === hasLng ? true : 'Preencha latitude e longitude juntas, ou deixe ambas vazias.'
}

export function validateDateNotBefore(
  value: unknown,
  siblingData: Record<string, unknown> | undefined,
  referenceField: string,
  referenceLabel: string,
): true | string {
  if (isBlank(value) || isBlank(siblingData?.[referenceField])) return true
  const date = new Date(String(value)).getTime()
  const reference = new Date(String(siblingData?.[referenceField])).getTime()
  return Number.isFinite(date) && Number.isFinite(reference) && date >= reference
    ? true
    : `A data não pode ser anterior a ${referenceLabel}.`
}
