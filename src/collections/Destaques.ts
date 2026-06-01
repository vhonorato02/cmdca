import type { CollectionConfig } from 'payload'

import { isAdminOrEditor, publishedOrLoggedIn } from '../access'
import { revalidateCollection } from '../hooks/revalidate'
import { TEMA_OPTIONS } from '../fields/tema'

export const Destaques: CollectionConfig = {
  slug: 'destaques',
  labels: { singular: 'Destaque', plural: 'Destaques (slider)' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'ordem', '_status'],
    group: 'Rede & Participação',
    description: 'Slides do banner principal da página inicial. Ordene pelo campo "Ordem".',
  },
  defaultSort: 'ordem',
  versions: { drafts: true },
  hooks: revalidateCollection(() => ['/']),
  access: {
    read: publishedOrLoggedIn,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'kicker',
      label: 'Chapéu (kicker)',
      type: 'text',
      admin: { description: 'Texto curto acima do título. Ex.: "Conferência 2026".' },
    },
    { name: 'titulo', label: 'Título', type: 'text', required: true },
    { name: 'texto', label: 'Texto', type: 'textarea' },
    {
      name: 'cta',
      label: 'Botão (chamada para ação)',
      type: 'group',
      fields: [
        { name: 'label', label: 'Texto do botão', type: 'text' },
        {
          name: 'href',
          label: 'Link',
          type: 'text',
          admin: { description: 'Ex.: "/transparencia" ou "https://...".' },
        },
      ],
    },
    {
      name: 'tema',
      label: 'Tema da ilustração',
      type: 'select',
      options: TEMA_OPTIONS,
      defaultValue: 'cidade',
      admin: { description: 'Ilustração autoral exibida no slide.' },
    },
    {
      name: 'ordem',
      label: 'Ordem',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', step: 1 },
    },
  ],
}
