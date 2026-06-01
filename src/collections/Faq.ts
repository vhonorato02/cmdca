import type { CollectionConfig } from 'payload'

import { isAdminOrEditor, publishedOrLoggedIn } from '../access'
import { revalidateCollection } from '../hooks/revalidate'

export const Faq: CollectionConfig = {
  slug: 'faq',
  labels: { singular: 'Pergunta frequente', plural: 'Perguntas frequentes' },
  admin: {
    useAsTitle: 'pergunta',
    defaultColumns: ['pergunta', 'contexto', 'ordem', '_status'],
    group: 'Rede & Participação',
    description: 'Perguntas frequentes exibidas nas páginas (Ajuda, FMDCA, etc.).',
  },
  defaultSort: 'ordem',
  versions: { drafts: true },
  hooks: revalidateCollection(() => ['/ajuda', '/fmdca']),
  access: {
    read: publishedOrLoggedIn,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'pergunta', label: 'Pergunta', type: 'text', required: true },
    { name: 'resposta', label: 'Resposta', type: 'textarea', required: true },
    {
      name: 'contexto',
      label: 'Onde aparece',
      type: 'select',
      defaultValue: 'ajuda',
      options: [
        { label: 'Ajuda / Rede de Proteção', value: 'ajuda' },
        { label: 'FMDCA / Transparência', value: 'fmdca' },
        { label: 'Geral', value: 'geral' },
      ],
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
