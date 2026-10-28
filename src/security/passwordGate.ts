import type {
  CollectionBeforeOperationHook,
  CollectionConfig,
  GlobalBeforeChangeHook,
  GlobalConfig,
} from 'payload'
import { APIError } from 'payload'

import { idOf } from '../access'

const WRITES = new Set(['autosave', 'create', 'delete', 'restoreVersion', 'update'])

export const PASSWORD_GATE_MESSAGE = 'Crie a sua nova senha antes de alterar o conteúdo do painel.'

export const mustChangePassword = (user: unknown): boolean =>
  Boolean((user as { trocarSenha?: unknown } | null | undefined)?.trocarSenha)

/**
 * Enquanto a conta estiver com "trocar a senha" marcado, nenhuma escrita passa,
 * exceto a da própria conta trocando a senha. Vale para a API e para o painel.
 */
export const collectionPasswordGate =
  (slug: string): CollectionBeforeOperationHook =>
  ({ args, operation, req }) => {
    if (!WRITES.has(operation) || !mustChangePassword(req.user)) return args
    const data = (args as { data?: Record<string, unknown> }).data
    const id = (args as { id?: unknown }).id
    const ownPasswordChange =
      slug === 'users' &&
      operation === 'update' &&
      String(id) === String(idOf(req.user)) &&
      typeof data?.password === 'string'
    if (ownPasswordChange) return args
    throw new APIError(PASSWORD_GATE_MESSAGE, 403)
  }

export const globalPasswordGate: GlobalBeforeChangeHook = ({ data, req }) => {
  if (mustChangePassword(req.user)) throw new APIError(PASSWORD_GATE_MESSAGE, 403)
  return data
}

export function withPasswordGate(collection: CollectionConfig): CollectionConfig {
  return {
    ...collection,
    hooks: {
      ...collection.hooks,
      beforeOperation: [collectionPasswordGate(collection.slug), ...(collection.hooks?.beforeOperation ?? [])],
    },
  }
}

export function withGlobalPasswordGate(global: GlobalConfig): GlobalConfig {
  return {
    ...global,
    hooks: {
      ...global.hooks,
      beforeChange: [globalPasswordGate, ...(global.hooks?.beforeChange ?? [])],
    },
  }
}
