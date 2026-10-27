import type { Field } from 'payload'

import { isLoggedInFieldLevel } from '../access'
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

/** Metadados internos opcionais para registrar a origem das informações. */
/**
 * `revisaoObrigatoria`: a coleção só publica com aprovação do jurídico. O rótulo
 * precisa dizer isso, senão o campo parece opcional e a publicação falha sem aviso.
 */
export const editorialControlField = ({ revisaoObrigatoria = false } = {}): Field => ({
  name: 'controleEditorial',
  label: 'Fonte e informações internas',
  type: 'group',
  access: { read: isLoggedInFieldLevel },
  admin: {
    // Required publication fields stay in the main form. In the narrow desktop
    // sidebar Payload's lazy nested fields can remain clipped and never mount.
    description: revisaoObrigatoria
      ? 'Registre a origem e a data de conferência. Para publicar, o jurídico precisa marcar a revisão como aprovada.'
      : 'Registre a origem e a data de conferência. Esses dados podem ser exigidos na publicação; a revisão interna é informativa.',
  },
  fields: [
    {
      name: 'fonte',
      label: 'Fonte da informação',
      type: 'text',
      admin: {
        description: 'Informe o órgão e o documento, processo ou página que comprova a informação.',
      },
    },
    {
      name: 'fonteURL',
      label: 'Link da fonte',
      type: 'text',
      validate: validateExternalURL,
      admin: {
        description: 'Quando houver link, use a página ou o documento oficial em https://.',
      },
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
      label: revisaoObrigatoria
        ? 'Revisão jurídica (obrigatória para publicar)'
        : 'Revisão interna (opcional)',
      type: 'select',
      options: [
        { label: 'Pendente', value: 'pendente' },
        { label: 'Aprovada', value: 'aprovada' },
        { label: 'Dispensada pelo jurídico', value: 'dispensada' },
      ],
      access: { create: isLoggedInFieldLevel, update: isLoggedInFieldLevel },
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
      admin: {
        description:
          'Registre pendências, validade da informação e o que precisa ser conferido na próxima revisão.',
      },
    },
  ],
})

export const imageFilter = {
  mimeType: { in: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] },
}

export const pdfFilter = { mimeType: { equals: 'application/pdf' } }
