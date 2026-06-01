import type { CollectionConfig } from 'payload'

import { anyone, isAdminOrEditor } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Mídia', plural: 'Mídia' },
  admin: {
    group: 'Mídia',
    description: 'Imagens e PDFs. Imagem de menor identificável exige cuidado (LGPD/ECA).',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  upload: {
    // Armazenamento vai para o R2 (storage-s3, disableLocalStorage por padrão).
    mimeTypes: ['image/*', 'application/pdf'],
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
      label: 'Texto alternativo (alt)',
      type: 'text',
      required: true,
      admin: { description: 'Descreva a imagem para leitores de tela.' },
    },
    {
      name: 'credito',
      label: 'Crédito',
      type: 'text',
      admin: { description: 'Autoria/fonte da imagem.' },
    },
    {
      name: 'consentimentoMenor',
      label: 'Menor identificável com consentimento',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Por padrão NÃO publique imagem de criança/adolescente identificável. Marque apenas se houver termo de consentimento assinado.',
      },
    },
    {
      name: 'referenciaConsentimento',
      label: 'Referência do termo de consentimento',
      type: 'text',
      admin: {
        condition: (data) => Boolean(data?.consentimentoMenor),
        description: 'Obrigatório quando o consentimento estiver marcado (nº/arquivo do termo).',
      },
      validate: (val: string | null | undefined, options: unknown) => {
        const sibling = (options as { siblingData?: { consentimentoMenor?: boolean } } | undefined)
          ?.siblingData
        if (sibling?.consentimentoMenor && (!val || !String(val).trim())) {
          return 'Informe a referência do termo de consentimento.'
        }
        return true
      },
    },
  ],
}
