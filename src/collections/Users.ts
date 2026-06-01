import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminFieldLevel } from '../access'

const roleOf = (u: unknown) => (u as { role?: string } | null)?.role
const idOf = (u: unknown) => (u as { id?: number | string } | null)?.id

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuário', plural: 'Usuários' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Administração',
    // Editor não vê a coleção de Usuários no menu.
    hidden: ({ user }) => roleOf(user) !== 'admin',
  },
  auth: true,
  access: {
    // Quem pode acessar o painel: administrador e editor.
    admin: ({ req: { user } }) => roleOf(user) === 'admin' || roleOf(user) === 'editor',
    // Admin lê todos; editor lê apenas o próprio registro (necessário p/ a conta).
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
        { label: 'Editor', value: 'editor' },
      ],
      // Somente administrador altera papéis.
      access: {
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      admin: {
        description:
          'Editor: CRUD de conteúdo. Administrador: acesso total (inclui Usuários e Configurações).',
      },
    },
  ],
}
