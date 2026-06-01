import type { CollectionConfig } from 'payload'

import { isAdminOrEditor, publishedOrLoggedIn } from '../access'
import { revalidateCollection } from '../hooks/revalidate'

export const Reunioes: CollectionConfig = {
  slug: 'reunioes',
  labels: { singular: 'Reunião', plural: 'Reuniões' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'data', 'tipo', '_status'],
    group: 'Conteúdo',
    description: 'Calendário, pautas e atas das reuniões.',
  },
  versions: { drafts: true, maxPerDoc: 25 },
  hooks: revalidateCollection(() => ['/reunioes']),
  access: {
    read: publishedOrLoggedIn,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'titulo',
      label: 'Título / Referência',
      type: 'text',
      required: true,
      admin: { description: 'Ex.: "Reunião Ordinária — Março/2026".' },
    },
    {
      name: 'data',
      label: 'Data',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
    },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select',
      required: true,
      defaultValue: 'ordinaria',
      options: [
        { label: 'Ordinária', value: 'ordinaria' },
        { label: 'Extraordinária', value: 'extraordinaria' },
        { label: 'Pública', value: 'publica' },
        { label: 'Reservada', value: 'reservada' },
      ],
    },
    { name: 'local', label: 'Local', type: 'text' },
    { name: 'pauta', label: 'Pauta', type: 'richText' },
    {
      name: 'ata',
      label: 'Ata (PDF)',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Anexe o PDF da ata aprovada, quando disponível.' },
    },
  ],
}
