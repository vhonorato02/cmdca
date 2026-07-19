import type { CollectionConfig } from 'payload'

import {
  canDeleteContent,
  canManageContent,
  isLoggedInFieldLevel,
  publishedOrLoggedIn,
} from '../access'
import {
  COLLECTION_EDITORIAL_COMPONENTS,
  EDITORIAL_VERSIONS,
  editorialControlField,
} from '../fields/editorial'
import { enforceEditorDraftOnly, validatePublication } from '../hooks/editorialPolicy'
import { revalidateCollection } from '../hooks/revalidate'

const revalidation = revalidateCollection(() => [
  '/',
  '/noticias',
  '/conferencias',
  '/reunioes',
  '/resolucoes',
  '/editais',
  '/entidades',
  '/ajuda',
  '/transparencia',
])

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Mídia', plural: 'Mídia' },
  admin: {
    group: 'Mídia',
    description:
      'Imagens e PDFs públicos. Nunca envie documentos com dados pessoais, termos de autorização ou conteúdo sigiloso.',
    defaultColumns: ['filename', 'mimeType', '_status', 'updatedAt'],
    components: COLLECTION_EDITORIAL_COMPONENTS,
  },
  versions: EDITORIAL_VERSIONS,
  trash: true,
  hooks: {
    beforeOperation: [enforceEditorDraftOnly],
    beforeChange: [
      validatePublication([
        {
          path: 'alt',
          label: 'texto alternativo para imagens',
          optional: true,
          validate: (value, document) =>
            !String(document.mimeType ?? '').startsWith('image/') ||
            (typeof value === 'string' && Boolean(value.trim())),
        },
        { path: 'controleEditorial.fonte', label: 'fonte/crédito confirmado', rejectPlaceholder: true },
        { path: 'controleEditorial.verificadoEm', label: 'data de verificação' },
        {
          path: 'consentimentoMenor',
          label: 'consentimento formal do responsável',
          optional: true,
          validate: (value, document) => !document.envolveMenorIdentificavel || value === true,
        },
        {
          path: 'referenciaConsentimento',
          label: 'referência interna do termo de consentimento',
          optional: true,
          validate: (value, document) =>
            !document.envolveMenorIdentificavel ||
            (typeof value === 'string' && Boolean(value.trim())),
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
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 768 },
      { name: 'hero', width: 1600 },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Texto alternativo da imagem',
      type: 'text',
      admin: { description: 'Obrigatório para imagens. Em PDFs, informe apenas se ajudar a identificar o documento.' },
    },
    {
      name: 'credito',
      label: 'Crédito público',
      type: 'text',
      admin: { description: 'Autoria que pode aparecer junto da imagem.' },
    },
    {
      name: 'envolveMenorIdentificavel',
      label: 'Há criança ou adolescente identificável',
      type: 'checkbox',
      defaultValue: false,
      access: { read: isLoggedInFieldLevel },
      admin: {
        description: 'Marque quando rosto, voz, nome, uniforme ou contexto permitir identificação.',
      },
    },
    {
      name: 'consentimentoMenor',
      label: 'Consentimento formal conferido',
      type: 'checkbox',
      defaultValue: false,
      access: { read: isLoggedInFieldLevel },
      admin: {
        condition: (data) => Boolean(data?.envolveMenorIdentificavel),
        description: 'Marque somente após conferir o termo assinado e sua validade para publicação.',
      },
    },
    {
      name: 'referenciaConsentimento',
      label: 'Referência interna do consentimento',
      type: 'text',
      access: { read: isLoggedInFieldLevel },
      admin: {
        condition: (data) => Boolean(data?.envolveMenorIdentificavel),
        description: 'Número de processo/arquivo interno. Não envie o termo para esta biblioteca pública.',
      },
    },
    editorialControlField(),
  ],
}
