// Faixa de diacríticos combinantes (U+0300–U+036F) em ASCII, sem caracteres frágeis.
const DIACRITICS = new RegExp('[\\u0300-\\u036f]', 'g')

/**
 * Converte um texto em slug seguro para URL, removendo acentos do PT-BR.
 * Ex.: "Reuniao Ordinaria - 2026" -> "reuniao-ordinaria-2026"
 */
export const formatSlug = (val: string): string =>
  val
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS, '') // remove diacriticos (acentos)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+)|(-+$)/g, '')
