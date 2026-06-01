import type { Access, FieldAccess } from 'payload'

export type Role = 'admin' | 'editor'

const roleOf = (user: unknown): Role | undefined =>
  (user as { role?: Role } | null | undefined)?.role ?? undefined

/** Leitura pública liberada. */
export const anyone: Access = () => true

/** Apenas administradores. */
export const isAdmin: Access = ({ req: { user } }) => roleOf(user) === 'admin'

/** Administradores ou editores (CRUD de conteúdo). */
export const isAdminOrEditor: Access = ({ req: { user } }) => {
  const role = roleOf(user)
  return role === 'admin' || role === 'editor'
}

/**
 * Público enxerga somente documentos publicados; usuário autenticado enxerga
 * tudo (inclui rascunhos). Usado nas coleções de conteúdo com drafts.
 */
export const publishedOrLoggedIn: Access = ({ req: { user } }) => {
  if (user) return true
  return {
    _status: {
      equals: 'published',
    },
  }
}

/** Acesso em nível de campo: somente administrador. */
export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) =>
  roleOf(user) === 'admin'
