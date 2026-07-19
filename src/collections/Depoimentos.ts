import type { CollectionConfig } from 'payload'

import {
  canDeleteContent,
  canManageContent,
  isAdminOrJuridicoFieldLevel,
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

const revalidation = revalidateCollection(() => ['/'])

export const Depoimentos: CollectionConfig = {
  slug: 'depoimentos',
  labels: { singular: 'Depoimento', plural: 'Depoimentos / Vozes' },
  admin: {
    useAsTitle: 'autor',
    defaultColumns: ['autor', 'papel', 'autorizacaoPublicacao', '_status'],
    group: 'Rede e participação',
    description:
      'Vozes exibidas na página inicial. Registre a origem e só publique após confirmar a autorização.',
    components: COLLECTION_EDITORIAL_COMPONENTS,
  },
  versions: EDITORIAL_VERSIONS,
  trash: true,
  hooks: {
    beforeOperation: [enforceEditorDraftOnly],
    beforeChange: [
      validatePublication([
        { path: 'frase', label: 'depoimento real', rejectPlaceholder: true },
        { path: 'autor', label: 'identificação autorizada', rejectPlaceholder: true },
        { path: 'origem', label: 'referência da autorização', rejectPlaceholder: true },
        {
          path: 'autorizacaoPublicacao',
          label: 'autorização de publicação confirmada',
          validate: (value) => value === true,
        },
        {
          path: 'controleEditorial.fonte',
          label: 'fonte do depoimento',
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
      name: 'frase',
      label: 'Frase',
      type: 'textarea',
      required: true,
      minLength: 20,
      maxLength: 500,
      admin: { description: 'Transcreva fielmente e evite dados pessoais desnecessários.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'autor',
          label: 'Autor(a)',
          type: 'text',
          required: true,
          maxLength: 120,
          admin: { width: '50%', description: 'Use nome, iniciais ou descrição autorizada.' },
        },
        {
          name: 'papel',
          label: 'Papel / Cargo',
          type: 'text',
          maxLength: 160,
          admin: {
            width: '50%',
            description: 'Ex.: “Presidente do CMDCA · biênio 2025–2027”.',
          },
        },
      ],
    },
    {
      name: 'origem',
      label: 'Referência da autorização',
      type: 'text',
      maxLength: 240,
      access: { read: isLoggedInFieldLevel },
      admin: {
        description:
          'Controle interno. Informe onde o termo ou consentimento está arquivado, sem inserir dados pessoais sensíveis.',
      },
    },
    {
      name: 'autorizacaoPublicacao',
      label: 'Autorização de publicação conferida',
      type: 'checkbox',
      defaultValue: false,
      access: {
        read: isLoggedInFieldLevel,
        create: isAdminOrJuridicoFieldLevel,
        update: isAdminOrJuridicoFieldLevel,
      },
      admin: {
        position: 'sidebar',
        description: 'Somente jurídico ou administração pode confirmar esta autorização.',
      },
    },
    editorialControlField(),
  ],
}
