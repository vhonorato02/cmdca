import type { CollectionConfig } from 'payload'

import { isAdminOrEditor, publishedOrLoggedIn } from '../access'
import { revalidateCollection } from '../hooks/revalidate'

export const Entidades: CollectionConfig = {
  slug: 'entidades',
  labels: { singular: 'Entidade', plural: 'Entidades' },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'area', 'registro', 'validade', '_status'],
    group: 'Conteúdo',
    description:
      'Registro e acompanhamento de organizações da área da infância (arts. 90 e 91 do ECA).',
  },
  versions: { drafts: true, maxPerDoc: 25 },
  hooks: revalidateCollection(() => ['/entidades']),
  access: {
    read: publishedOrLoggedIn,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'nome', label: 'Nome da entidade', type: 'text', required: true },
    {
      name: 'area',
      label: 'Área de atuação',
      type: 'select',
      defaultValue: 'assistencia',
      options: [
        { label: 'Educação', value: 'educacao' },
        { label: 'Saúde', value: 'saude' },
        { label: 'Cultura / Esporte', value: 'cultura_esporte' },
        { label: 'Assistência social', value: 'assistencia' },
        { label: 'Acolhimento', value: 'acolhimento' },
        { label: 'Outra', value: 'outro' },
      ],
    },
    {
      name: 'registro',
      label: 'Nº de registro no CMDCA',
      type: 'text',
      admin: { description: 'Ex.: "Registro nº 05/2025".' },
    },
    {
      name: 'validade',
      label: 'Validade do registro',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
    },
    {
      name: 'documentos',
      label: 'Documentos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'Certificado de registro, estatuto, etc.' },
    },
  ],
}
