import type { Field } from 'payload'

import { isAdminOrJuridicoFieldLevel, isLoggedInFieldLevel } from '../access'
import { validateExternalURL } from '../utilities/validation'

export const EDITORIAL_VERSIONS = {
  drafts: {
    autosave: {
      interval: 15_000,
      showSaveDraftButton: true,
    },
    validate: false,
  },
  maxPerDoc: 30,
} as const

export const COLLECTION_EDITORIAL_COMPONENTS = {
  edit: {
    PublishButton: '/components/admin/RoleAwarePublishButton',
    UnpublishButton: '/components/admin/RoleAwareUnpublishButton',
  },
} as const

export const GLOBAL_EDITORIAL_COMPONENTS = {
  elements: {
    PublishButton: '/components/admin/RoleAwarePublishButton',
    UnpublishButton: '/components/admin/RoleAwareUnpublishButton',
  },
} as const

/** Metadados internos usados para comprovar fonte, conferência e revisão. */
export const editorialControlField = (): Field => ({
  name: 'controleEditorial',
  label: 'Fonte e revisão',
  type: 'group',
  access: { read: isLoggedInFieldLevel },
  admin: {
    position: 'sidebar',
    description:
      'Checklist obrigatório para publicação. Estes dados não aparecem no site público, mas registram de onde a informação veio e quem a conferiu.',
  },
  fields: [
    {
      name: 'fonte',
      label: 'Fonte da informação',
      type: 'text',
      admin: { description: 'Informe o órgão e o documento, processo ou página que comprova a informação.' },
    },
    {
      name: 'fonteURL',
      label: 'Link da fonte',
      type: 'text',
      validate: validateExternalURL,
      admin: { description: 'Quando houver link, use a página ou o documento oficial em https://.' },
    },
    {
      name: 'verificadoEm',
      label: 'Verificado em',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
      },
    },
    {
      name: 'statusRevisao',
      label: 'Revisão jurídica',
      type: 'select',
      required: true,
      defaultValue: 'pendente',
      options: [
        { label: 'Pendente', value: 'pendente' },
        { label: 'Aprovada', value: 'aprovada' },
        { label: 'Dispensada pelo jurídico', value: 'dispensada' },
      ],
      access: {
        create: isAdminOrJuridicoFieldLevel,
        update: isAdminOrJuridicoFieldLevel,
      },
    },
    {
      name: 'revisadoPor',
      label: 'Revisado por',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
      access: {
        // O hook de publicação registra a pessoa autenticada. Não aceite um
        // identificador fornecido pelo cliente, nem mesmo do jurídico.
        create: () => false,
        update: () => false,
      },
    },
    {
      name: 'observacoesInternas',
      label: 'Observações internas',
      type: 'textarea',
      admin: { description: 'Registre pendências, validade da informação e o que precisa ser conferido na próxima revisão.' },
    },
  ],
})

export const imageFilter = {
  mimeType: { in: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] },
}

export const pdfFilter = { mimeType: { equals: 'application/pdf' } }
