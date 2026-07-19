/**
 * Serializa JSON-LD sem permitir que conteúdo editorial encerre a tag <script>.
 * O retorno continua sendo JSON válido e pode ser usado em dangerouslySetInnerHTML.
 */
export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
