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
import { validateDateNotBefore, validateExternalURL } from '../utilities/validation'

const revalidation = revalidateCollection(() => ['/editais', '/transparencia'])

function deadlineIsCoherent(value: unknown, document: Record<string, unknown>): boolean {
  if (value == null || value === '') return true
  if (document.data == null || document.data === '') return false
  const deadline = new Date(String(value)).getTime()
  const publication = new Date(String(document.data)).getTime()
  return Number.isFinite(deadline) && Number.isFinite(publication) && deadline >= publication
}

export const Editais: CollectionConfig = {
  slug: 'editais',
  labels: { singular: 'Edital', plural: 'Editais' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['numero', 'titulo', 'tipo', 'prazo', 'situacaoJuridica', '_status'],
    group: 'Atos e reuniões',
    description:
      'Chamamentos e processos oficiais. O jurídico confere prazo, situação, fonte e PDF antes da publicação.',
    components: COLLECTION_EDITORIAL_COMPONENTS,
  },
  versions: EDITORIAL_VERSIONS,
  trash: true,
  hooks: {
    beforeOperation: [enforceEditorDraftOnly],
    beforeChange: [
      validatePublication([
        { path: 'numero', label: 'número do edital', rejectPlaceholder: true },
        { path: 'titulo', label: 'título', rejectPlaceholder: true },
        { path: 'tipo', label: 'tipo do edital' },
        { path: 'data', label: 'data de publicação' },
        { path: 'situacaoJuridica', label: 'situação jurídica ou administrativa' },
        {
          path: 'prazo',
          label: 'prazo igual ou posterior à publicação',
          optional: true,
          validate: deadlineIsCoherent,
        },
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
        description: 'Identificador oficial, exatamente como consta no edital. Ex.: “01/2026”.',
        width: '30%',
      },
    },
    { name: 'titulo', label: 'Título', type: 'text', required: true, maxLength: 300 },
    {
      type: 'row',
      fields: [
        {
          name: 'tipo',
          label: 'Tipo',
          type: 'select',
          required: true,
          defaultValue: 'chamamento',
          admin: { width: '50%' },
          options: [
            { label: 'Chamamento público', value: 'chamamento' },
            { label: 'Conselho Tutelar', value: 'conselho_tutelar' },
            { label: 'FMDCA', value: 'fmdca' },
            { label: 'Outro', value: 'outro' },
          ],
        },
        {
          name: 'situacaoJuridica',
          label: 'Situação',
          type: 'select',
          required: true,
          defaultValue: 'vigente',
          admin: { width: '50%' },
          options: [
            { label: 'Vigente / em andamento', value: 'vigente' },
            { label: 'Encerrado', value: 'encerrado' },
            { label: 'Suspenso', value: 'suspenso' },
            { label: 'Revogado', value: 'revogado' },
            { label: 'Anulado', value: 'anulado' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'data',
          label: 'Data de publicação',
          type: 'date',
          required: true,
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
          },
        },
        {
          name: 'prazo',
          label: 'Prazo final',
          type: 'date',
          validate: (value, { siblingData }) =>
            validateDateNotBefore(
              value,
              siblingData as Record<string, unknown> | undefined,
              'data',
              'data de publicação',
            ),
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
            description: 'Data limite, quando houver. Nunca pode anteceder a publicação.',
          },
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
      admin: { description: 'A publicação exige o edital oficial em formato PDF.' },
    },
    {
      name: 'retifica',
      label: 'Edital que este documento retifica',
      type: 'relationship',
      relationTo: 'editais',
      hasMany: true,
      admin: { description: 'Relacione os editais anteriores afetados por esta retificação.' },
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
