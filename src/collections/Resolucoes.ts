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
import { validateExternalURL } from '../utilities/validation'

const revalidation = revalidateCollection(() => ['/resolucoes', '/transparencia'])

export const Resolucoes: CollectionConfig = {
  slug: 'resolucoes',
  labels: { singular: 'Resolução', plural: 'Resoluções' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['numero', 'titulo', 'data', 'situacaoJuridica', '_status'],
    group: 'Atos e reuniões',
    description:
      'Atos normativos do conselho. O jurídico confere número, vigência, fonte e PDF antes da publicação.',
    components: COLLECTION_EDITORIAL_COMPONENTS,
  },
  versions: EDITORIAL_VERSIONS,
  trash: true,
  hooks: {
    beforeOperation: [enforceEditorDraftOnly],
    beforeChange: [
      validatePublication([
        { path: 'numero', label: 'número da resolução', rejectPlaceholder: true },
        { path: 'titulo', label: 'título ou ementa', rejectPlaceholder: true },
        { path: 'data', label: 'data da resolução' },
        { path: 'situacaoJuridica', label: 'situação jurídica' },
        {
          path: 'arquivo',
          label: 'arquivo oficial em PDF',
          validate: (value, _document, req) =>
            uploadHasMime(value, req, ['application/pdf']),
        },
        {
          path: 'controleEditorial.fonte',
          label: 'fonte oficial confirmada',
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
    {
      name: 'numero',
      label: 'Número',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      maxLength: 80,
      admin: {
        description: 'Identificador oficial, exatamente como consta no ato. Ex.: “01/2026”.',
        width: '30%',
      },
    },
    {
      name: 'titulo',
      label: 'Título / Ementa',
      type: 'text',
      required: true,
      maxLength: 300,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'data',
          label: 'Data',
          type: 'date',
          required: true,
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
          },
        },
        {
          name: 'situacaoJuridica',
          label: 'Situação jurídica',
          type: 'select',
          required: true,
          defaultValue: 'vigente',
          admin: {
            width: '50%',
            description: 'Atualize quando o ato for alterado, revogado ou perder efeito.',
          },
          options: [
            { label: 'Vigente', value: 'vigente' },
            { label: 'Alterada', value: 'alterada' },
            { label: 'Revogada', value: 'revogada' },
            { label: 'Sem efeito', value: 'sem_efeito' },
          ],
        },
      ],
    },
    {
      name: 'arquivo',
      label: 'Arquivo oficial (PDF)',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: pdfFilter,
      admin: { description: 'A publicação exige o documento oficial em formato PDF.' },
    },
    {
      name: 'retifica',
      label: 'Resolução que este ato retifica ou altera',
      type: 'relationship',
      relationTo: 'resolucoes',
      hasMany: true,
      admin: {
        description: 'Relacione os atos anteriores afetados por esta resolução, quando houver.',
      },
    },
    {
      name: 'linkTribuna',
      label: 'Link na Tribuna do Norte',
      type: 'text',
      validate: validateExternalURL,
      admin: { description: 'Opcional. URL completa da publicação oficial.' },
    },
    editorialControlField(),
  ],
}
