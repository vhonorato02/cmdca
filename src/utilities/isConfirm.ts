/**
 * `true` quando o valor do CMS está ausente ou ainda marcado como `[A CONFIRMAR]`.
 * Usado para exibir o selo "a confirmar" no lugar do placeholder cru.
 */
export const isConfirm = (v?: string | null): boolean => !v || v.includes('[A CONFIRMAR]')
