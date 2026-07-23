/**
 * Constrói um URI de chamada somente com o número-base.
 *
 * Ramais permanecem no texto apresentado ao usuário, mas não podem ser
 * concatenados ao número discado automaticamente.
 */
export function phoneHref(value: string) {
  if (/^\s*rama(?:l|is)\b/i.test(value)) return undefined

  const [base, extension] = value.split(/\s*\(\s*rama(?:l|is)\b/i, 2)
  if (extension !== undefined && !/\d/.test(base)) return undefined

  const number = base.replace(/[^\d+]/g, '')
  return number ? `tel:${number}` : undefined
}
