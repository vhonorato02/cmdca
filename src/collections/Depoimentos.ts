import type { CollectionConfig } from 'payload'

import { isAdminOrEditor, publishedOrLoggedIn } from '../access'
import { revalidateCollection } from '../hooks/revalidate'

export const Depoimentos: CollectionConfig = {
  slug: 'depoimentos',
  labels: { singular: 'Depoimento', plural: 'Depoimentos / Vozes' },
  admin: {
    useAsTitle: 'autor',
    defaultColumns: ['autor', 'papel', '_status'],
    group: 'Rede & Participação',
    description: 'Vozes exibidas no carrossel da página inicial.',
  },
  versions: { drafts: true },
  hooks: revalidateCollection(() => ['/']),
  access: {
    read: publishedOrLoggedIn,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'frase', label: 'Frase', type: 'textarea', required: true },
    { name: 'autor', label: 'Autor(a)', type: 'text', required: true },
    {
      name: 'papel',
      label: 'Papel / Cargo',
      type: 'text',
      admin: { description: 'Ex.: "Presidente do CMDCA · biênio 2025–2027".' },
    },
  ],
}
