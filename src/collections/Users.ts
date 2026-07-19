import type {
  CollectionBeforeChangeHook,
  CollectionBeforeDeleteHook,
  CollectionConfig,
} from 'payload'
import { APIError } from 'payload'

import { idOf, isAdmin, isAdminFieldLevel, roleOf } from '../access'

const protectAdministratorRole: CollectionBeforeChangeHook = async ({ data, operation, originalDoc, req }) => {
  if (
    operation !== 'update' ||
    !Object.prototype.hasOwnProperty.call(data, 'role') ||
    originalDoc?.role !== 'admin' ||
    data.role === 'admin'
  ) {
    return data
  }

  if (String(originalDoc.id) === String(idOf(req.user))) {
    throw new APIError(
      'Para proteger seu acesso, peça a outro administrador para alterar o seu papel.',
      400,
    )
  }

  const { totalDocs } = await req.payload.count({
    collection: 'users',
    where: { role: { equals: 'admin' } },
    overrideAccess: true,
  })
  if (totalDocs <= 1) {
    throw new APIError('O último administrador não pode perder o papel de administrador.', 400)
  }
  return data
}

const protectAdministratorDeletion: CollectionBeforeDeleteHook = async ({ id, req }) => {
  if (String(id) === String(idOf(req.user))) {
    throw new APIError(
      'Sua própria conta não pode ser excluída. Peça a outro administrador para fazer isso.',
      400,
    )
  }

  const target = await req.payload.findByID({
    collection: 'users',
    id,
    depth: 0,
    overrideAccess: true,
  })
  if (target.role !== 'admin') return

  const { totalDocs } = await req.payload.count({
    collection: 'users',
    where: { role: { equals: 'admin' } },
    overrideAccess: true,
  })
  if (totalDocs <= 1) {
    throw new APIError('O último administrador não pode ser excluído.', 400)
  }
}

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuário', plural: 'Usuários' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Administração',
    hidden: ({ user }) => roleOf(user) !== 'admin',
    description: 'Contas do painel. Mantenha sempre pelo menos dois administradores ativos.',
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    tokenExpiration: 2 * 60 * 60,
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  hooks: {
    beforeChange: [protectAdministratorRole],
    beforeDelete: [protectAdministratorDeletion],
  },
  access: {
    admin: ({ req: { user } }) => Boolean(roleOf(user)),
    read: ({ req: { user } }) =>
      roleOf(user) === 'admin' ? true : { id: { equals: idOf(user) } },
    create: isAdmin,
    update: ({ req: { user } }) =>
      roleOf(user) === 'admin' ? true : { id: { equals: idOf(user) } },
    delete: isAdmin,
  },
  fields: [
    { name: 'name', label: 'Nome', type: 'text', required: true },
    {
      name: 'role',
      label: 'Papel',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Editor de rascunhos', value: 'editor' },
        { label: 'Revisão jurídica e publicação', value: 'juridico' },
      ],
      access: { create: isAdminFieldLevel, update: isAdminFieldLevel },
      admin: {
        description:
          'Editor prepara rascunhos. Jurídico revisa e publica. Administrador também gerencia contas e exclusões.',
      },
    },
  ],
}
