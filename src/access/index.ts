import type { Access, FieldAccess } from 'payload'

export type Role = 'admin' | 'editor' | 'juridico'

export const roleOf = (user: unknown): Role | undefined =>
  (user as { role?: Role } | null | undefined)?.role

export const idOf = (user: unknown): number | string | undefined =>
  (user as { id?: number | string } | null | undefined)?.id

/** Leitura pública liberada para dados deliberadamente públicos. */
export const anyone: Access = () => true

/** Qualquer pessoa autenticada no painel. */
export const isAuthenticated: Access = ({ req: { user } }) => Boolean(user)

/** Somente administradores. */
export const isAdmin: Access = ({ req: { user } }) => roleOf(user) === 'admin'

/** Administração ou assessoria jurídica. */
export const isAdminOrJuridico: Access = ({ req: { user } }) => {
  const role = roleOf(user)
  return role === 'admin' || role === 'juridico'
}

/** Todos os papéis editoriais podem criar e editar; publicação é protegida por hook. */
export const canManageContent: Access = ({ req: { user } }) => Boolean(roleOf(user))

/** Exclusão e envio à lixeira são sempre exclusivos da administração. */
export const canDeleteContent: Access = ({ req: { user } }) => roleOf(user) === 'admin'

/**
 * Visitantes recebem apenas a versão publicada. Pessoas autenticadas também
 * podem ler rascunhos para revisão no painel.
 */
export const publishedOrLoggedIn: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}

/** Reuniões reservadas nunca são retornadas ao público, ainda que publicadas. */
export const publishedPublicMeetingOrLoggedIn: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' }, acesso: { equals: 'publica' } }
}

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) =>
  roleOf(user) === 'admin'

export const isAdminOrJuridicoFieldLevel: FieldAccess = ({ req: { user } }) => {
  const role = roleOf(user)
  return role === 'admin' || role === 'juridico'
}

export const isLoggedInFieldLevel: FieldAccess = ({ req: { user } }) => Boolean(user)
