import type { CollectionConfig } from 'payload'

import { isAdminOrEditor, publishedOrLoggedIn } from '../access'
import { revalidateCollection } from '../hooks/revalidate'

export const Resolucoes: CollectionConfig = {
  slug: 'resolucoes',
  labels: { singular: 'Resolução', plural: 'Resoluções' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['numero', 'titulo', 'data', '_status'],
    group: 'Conteúdo',
    description: 'Atos normativos do conselho. Também publicados na Tribuna do Norte.',
  },
  versions: { drafts: true, maxPerDoc: 25 },
  hooks: revalidateCollection(() => ['/resolucoes', '/transparencia']),
  access: {
    read: publishedOrLoggedIn,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'numero',
      label: 'Número',
      type: 'text',
      required: true,
      admin: { description: 'Ex.: "01/2026".', width: '30%' },
    },
    { name: 'titulo', label: 'Título / Ementa', type: 'text', required: true },
    {
      name: 'data',
      label: 'Data',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
    },
    {
      name: 'arquivo',
      label: 'Arquivo (PDF)',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'linkTribuna',
      label: 'Link na Tribuna do Norte',
      type: 'text',
      admin: { description: 'Opcional. URL da publicação oficial.' },
      validate: (val: string | null | undefined) =>
        !val || /^https?:\/\//i.test(val)
          ? true
          : 'Use uma URL começando com http:// ou https://',
    },
  ],
}
