import type { CollectionConfig } from 'payload'

import { canDeleteContent, canManageContent, publishedOrLoggedIn } from '../access'
import {
  COLLECTION_EDITORIAL_COMPONENTS,
  EDITORIAL_VERSIONS,
  editorialControlField,
} from '../fields/editorial'
import { enforceEditorDraftOnly, validatePublication } from '../hooks/editorialPolicy'
import { revalidateCollection } from '../hooks/revalidate'

const revalidation = revalidateCollection(() => ['/ajuda', '/fmdca'])

export const Faq: CollectionConfig = {
  slug: 'faq',
  labels: { singular: 'Pergunta frequente', plural: 'Perguntas frequentes' },
  admin: {
    useAsTitle: 'pergunta',
    defaultColumns: ['pergunta', 'contexto', 'ordem', '_status'],
    group: 'Rede e participação',
    description:
      'Respostas exibidas em Ajuda e FMDCA. Registre a fonte usada e revise sempre que a orientação mudar.',
    components: COLLECTION_EDITORIAL_COMPONENTS,
  },
  defaultSort: 'ordem',
  versions: EDITORIAL_VERSIONS,
  trash: true,
  hooks: {
    beforeOperation: [enforceEditorDraftOnly],
    beforeChange: [
      validatePublication([
        { path: 'pergunta', label: 'pergunta', rejectPlaceholder: true },
        { path: 'resposta', label: 'resposta confirmada', rejectPlaceholder: true },
        { path: 'contexto', label: 'local de exibição' },
        {
          path: 'controleEditorial.fonte',
          label: 'fonte da resposta',
          rejectPlaceholder: true,
        },
        { path: 'controleEditorial.verificadoEm', label: 'data de verificação' },
        {
          path: 'controleEditorial.statusRevisao',
          label: 'revisão jurídica aprovada ou dispensada',
          validate: (value) => value === 'aprovada' || value === 'dispensada',
        },
      ]),
    ],
    ...revalidation,
  },
  access: {
    read: publishedOrLoggedIn,
    create: canManageContent,
    update: canManageContent,
    delete: canDeleteContent,
  },
  fields: [
    { name: 'pergunta', label: 'Pergunta', type: 'text', required: true, maxLength: 240 },
    {
      name: 'resposta',
      label: 'Resposta',
      type: 'textarea',
      required: true,
      minLength: 20,
      maxLength: 1500,
    },
    {
      name: 'contexto',
      label: 'Onde aparece',
      type: 'select',
      required: true,
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
      required: true,
      min: 0,
      max: 9999,
      defaultValue: 0,
      admin: { position: 'sidebar', step: 1 },
    },
    editorialControlField(),
  ],
}
