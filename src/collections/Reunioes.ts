import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { APIError } from 'payload'

import {
  canDeleteContent,
  canManageContent,
  isAuthenticated,
  publishedPublicMeetingOrLoggedIn,
} from '../access'
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
import { validateExternalURL, validateTime } from '../utilities/validation'

const revalidation = revalidateCollection(() => ['/reunioes'])

const preventReservedAttachments: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const document = { ...originalDoc, ...data }
  if (document.acesso === 'reservada' && document.ata != null && document.ata !== '') {
    throw new APIError('Reuniões reservadas não podem anexar atas na biblioteca pública. Guarde a ata em arquivo interno protegido.', 400)
  }
  return data
}

export const Reunioes: CollectionConfig = {
  slug: 'reunioes',
  labels: { singular: 'Reunião', plural: 'Reuniões' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'data', 'hora', 'tipo', 'acesso', '_status'],
    group: 'Atos e reuniões',
    description: 'Cadastre natureza, acesso, forma de participação, pauta e ata separadamente.',
    components: COLLECTION_EDITORIAL_COMPONENTS,
  },
  versions: EDITORIAL_VERSIONS,
  trash: true,
  hooks: {
    beforeOperation: [enforceEditorDraftOnly],
    beforeChange: [
      preventReservedAttachments,
      validatePublication([
        { path: 'titulo', label: 'título' },
        { path: 'data', label: 'data' },
        { path: 'hora', label: 'horário' },
        { path: 'tipo', label: 'natureza da reunião' },
        { path: 'acesso', label: 'classificação de acesso' },
        { path: 'modalidade', label: 'modalidade' },
        {
          path: 'local',
          label: 'local da reunião presencial ou híbrida',
          optional: true,
          validate: (value, document) =>
            document.modalidade === 'online' ||
            (typeof value === 'string' && Boolean(value.trim())),
        },
        {
          path: 'linkTransmissao',
          label: 'link da reunião online ou híbrida',
          optional: true,
          validate: (value, document) =>
            document.modalidade === 'presencial' ||
            (typeof value === 'string' && Boolean(value.trim())),
        },
        { path: 'controleEditorial.fonte', label: 'fonte confirmada', rejectPlaceholder: true },
        { path: 'controleEditorial.verificadoEm', label: 'data de verificação' },
        {
          path: 'ata',
          label: 'ata em PDF',
          optional: true,
          validate: (value, _document, req) =>
            value == null || value === ''
              ? true
              : uploadHasMime(value, req, ['application/pdf']),
        },
      ]),
    ],
    ...revalidation,
  },
  access: {
    read: publishedPublicMeetingOrLoggedIn,
    readVersions: isAuthenticated,
    create: canManageContent,
    update: canManageContent,
    delete: canDeleteContent,
  },
  fields: [
    {
      name: 'titulo',
      label: 'Título / Referência',
      type: 'text',
      required: true,
      admin: { description: 'Ex.: “Reunião Ordinária de março de 2026”.' },
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
          name: 'hora',
          label: 'Horário',
          type: 'text',
          required: true,
          validate: validateTime,
          admin: { width: '50%', description: 'Formato 24 horas, por exemplo 14:30.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'tipo',
          label: 'Natureza',
          type: 'select',
          required: true,
          defaultValue: 'ordinaria',
          admin: { width: '50%' },
          options: [
            { label: 'Ordinária', value: 'ordinaria' },
            { label: 'Extraordinária', value: 'extraordinaria' },
          ],
        },
        {
          name: 'acesso',
          label: 'Acesso',
          type: 'select',
          required: true,
          defaultValue: 'publica',
          admin: {
            width: '50%',
            description: 'Reuniões reservadas nunca são retornadas pela API pública.',
          },
          options: [
            { label: 'Pública', value: 'publica' },
            { label: 'Reservada', value: 'reservada' },
          ],
        },
      ],
    },
    {
      name: 'modalidade',
      label: 'Modalidade',
      type: 'select',
      required: true,
      defaultValue: 'presencial',
      options: [
        { label: 'Presencial', value: 'presencial' },
        { label: 'Online', value: 'online' },
        { label: 'Híbrida', value: 'hibrida' },
      ],
    },
    {
      name: 'local',
      label: 'Local',
      type: 'text',
      admin: { condition: (data) => data?.modalidade !== 'online' },
    },
    {
      name: 'linkTransmissao',
      label: 'Link de acesso/transmissão',
      type: 'text',
      validate: validateExternalURL,
      admin: {
        condition: (data) => data?.modalidade === 'online' || data?.modalidade === 'hibrida',
      },
    },
    { name: 'pauta', label: 'Pauta', type: 'richText' },
    {
      name: 'ata',
      label: 'Ata aprovada (PDF)',
      type: 'upload',
      relationTo: 'media',
      filterOptions: pdfFilter,
      admin: {
        condition: (data) => data?.acesso !== 'reservada',
        description: 'Somente atas públicas aprovadas. Arquivos desta biblioteca têm URL pública no R2.',
      },
    },
    editorialControlField(),
  ],
}
