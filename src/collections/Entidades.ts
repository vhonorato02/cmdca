import type { CollectionConfig } from 'payload'

import { canDeleteContent, canManageContent, publishedOrLoggedIn } from '../access'
import {
  COLLECTION_EDITORIAL_COMPONENTS,
  EDITORIAL_VERSIONS,
  editorialControlField,
  pdfFilter,
} from '../fields/editorial'
import {
  enforceEditorDraftOnly,
  uploadHasMime,
  validatePublication,
} from '../hooks/editorialPolicy'
import { revalidateCollection } from '../hooks/revalidate'

const revalidation = revalidateCollection(() => ['/entidades', '/transparencia'])

export const Entidades: CollectionConfig = {
  slug: 'entidades',
  labels: { singular: 'Entidade', plural: 'Entidades' },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'area', 'registro', 'validade', 'situacaoRegistro', '_status'],
    group: 'Atos e reuniões',
    description:
      'Registro público de organizações da área da infância. Publique somente dados conferidos e documentos sem informação restrita.',
    components: COLLECTION_EDITORIAL_COMPONENTS,
  },
  versions: EDITORIAL_VERSIONS,
  trash: true,
  hooks: {
    beforeOperation: [enforceEditorDraftOnly],
    beforeChange: [
      validatePublication([
        { path: 'nome', label: 'nome da entidade', rejectPlaceholder: true },
        { path: 'area', label: 'área de atuação' },
        { path: 'registro', label: 'número de registro', rejectPlaceholder: true },
        { path: 'validade', label: 'validade do registro' },
        { path: 'situacaoRegistro', label: 'situação do registro' },
        {
          path: 'documentos',
          label: 'ao menos um documento público em PDF',
          validate: async (value, _document, req) => {
            if (!Array.isArray(value) || value.length === 0) return false
            const checks = await Promise.all(
              value.map((item) => uploadHasMime(item, req, ['application/pdf'])),
            )
            return checks.every(Boolean)
          },
        },
        {
          path: 'controleEditorial.fonte',
          label: 'fonte oficial do registro',
          rejectPlaceholder: true,
        },
        { path: 'controleEditorial.verificadoEm', label: 'data de verificação' },
        {
          path: 'controleEditorial.statusRevisao',
          label: 'aprovação jurídica',
          validate: (value) => value === 'aprovada',
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
    { name: 'nome', label: 'Nome da entidade', type: 'text', required: true, maxLength: 220 },
    {
      name: 'area',
      label: 'Área de atuação',
      type: 'select',
      required: true,
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
      type: 'row',
      fields: [
        {
          name: 'registro',
          label: 'Nº de registro no CMDCA',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          maxLength: 100,
          admin: {
            width: '50%',
            description: 'Use o identificador oficial. Ex.: “Registro nº 05/2025”.',
          },
        },
        {
          name: 'validade',
          label: 'Validade do registro',
          type: 'date',
          required: true,
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
          },
        },
      ],
    },
    {
      name: 'situacaoRegistro',
      label: 'Situação do registro',
      type: 'select',
      required: true,
      defaultValue: 'ativo',
      options: [
        { label: 'Ativo', value: 'ativo' },
        { label: 'Vencido', value: 'vencido' },
        { label: 'Suspenso', value: 'suspenso' },
        { label: 'Cancelado', value: 'cancelado' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'documentos',
      label: 'Documentos públicos (PDF)',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      filterOptions: pdfFilter,
      admin: {
        description:
          'Anexe certificado, resolução ou outro documento público. Não envie documentos com dados pessoais ou restritos.',
      },
    },
    editorialControlField(),
  ],
}
