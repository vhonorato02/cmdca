import type { CollectionConfig } from 'payload'

import { isAdminOrEditor, publishedOrLoggedIn } from '../access'
import { revalidateCollection } from '../hooks/revalidate'

export const Editais: CollectionConfig = {
  slug: 'editais',
  labels: { singular: 'Edital', plural: 'Editais' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['numero', 'titulo', 'tipo', 'prazo', '_status'],
    group: 'Conteúdo',
    description: 'Chamamentos, processos do conselho tutelar e demais editais.',
  },
  versions: { drafts: true, maxPerDoc: 25 },
  hooks: revalidateCollection(() => ['/editais', '/transparencia']),
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
      admin: { description: 'Ex.: "01/2026".', width: '30%' },
    },
    { name: 'titulo', label: 'Título', type: 'text', required: true },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select',
      required: true,
      defaultValue: 'chamamento',
      options: [
        { label: 'Chamamento público', value: 'chamamento' },
        { label: 'Conselho Tutelar', value: 'conselho_tutelar' },
        { label: 'FMDCA', value: 'fmdca' },
        { label: 'Outro', value: 'outro' },
      ],
    },
    {
      name: 'data',
      label: 'Data de publicação',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
    },
    {
      name: 'prazo',
      label: 'Prazo final',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
        description: 'Data limite para inscrição/manifestação, quando houver.',
      },
    },
    { name: 'arquivo', label: 'Arquivo (PDF)', type: 'upload', relationTo: 'media' },
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
