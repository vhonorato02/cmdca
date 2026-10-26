import type { CollectionConfig, Field } from 'payload'

import { canDeleteContent, canManageContent, isAuthenticated, publishedOrLoggedIn } from '../access'
import { RESERVED_SLUGS } from '../content/paginas'
import {
  COLLECTION_EDITORIAL_COMPONENTS,
  EDITORIAL_VERSIONS,
  editorialControlField,
} from '../fields/editorial'
import { slugField } from '../fields/slug'
import { enforceEditorDraftOnly, validatePublication } from '../hooks/editorialPolicy'
import { revalidateCollection } from '../hooks/revalidate'

const revalidation = revalidateCollection((doc) => [
  doc.slug ? `/${String(doc.slug)}` : '',
  '/mapa-do-site',
])

export const Paginas: CollectionConfig = {
  slug: 'paginas',
  labels: { singular: 'Página institucional', plural: 'Páginas institucionais' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'slug', 'atualizadoEm', '_status'],
    group: 'Conteúdo editorial',
    description:
      'Textos longos como privacidade, termos de uso e acessibilidade. Cada página fica em /endereço. Mudanças em textos legais devem passar pelo jurídico antes da publicação.',
    components: COLLECTION_EDITORIAL_COMPONENTS,
  },
  versions: EDITORIAL_VERSIONS,
  trash: true,
  hooks: {
    beforeOperation: [enforceEditorDraftOnly],
    beforeChange: [
      validatePublication([
        { path: 'titulo', label: 'título', rejectPlaceholder: true },
        { path: 'slug', label: 'endereço da página' },
        { path: 'corpo', label: 'texto da página', richText: true, rejectPlaceholder: true },
        { path: 'atualizadoEm', label: 'data da última atualização' },
      ]),
    ],
    ...revalidation,
  },
  access: {
    read: publishedOrLoggedIn,
    readVersions: isAuthenticated,
    create: canManageContent,
    update: canManageContent,
    delete: canDeleteContent,
  },
  fields: [
    { name: 'titulo', label: 'Título', type: 'text', required: true, maxLength: 120 },
    {
      ...slugField({ trackingField: 'titulo' }),
      validate: (value: unknown) => {
        if (typeof value !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
          return 'O endereço deve conter apenas letras minúsculas, números e hífens.'
        }
        return RESERVED_SLUGS.includes(value)
          ? 'Este endereço já é usado por outra área do site. Escolha outro.'
          : true
      },
    } as Field,
    {
      name: 'resumo',
      label: 'Resumo',
      type: 'textarea',
      required: true,
      maxLength: 240,
      admin: { description: 'Aparece abaixo do título e nos resultados de busca.' },
    },
    {
      name: 'atualizadoEm',
      label: 'Última atualização',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
        description: 'Atualize sempre que o texto mudar.',
      },
    },
    {
      name: 'contato',
      label: 'Quadro de contato no fim da página',
      type: 'select',
      required: true,
      defaultValue: 'nenhum',
      options: [
        { label: 'Nenhum', value: 'nenhum' },
        { label: 'Encarregado de dados (LGPD)', value: 'encarregado' },
        { label: 'Contato do conselho', value: 'institucional' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Os dados vêm de Configurações institucionais.',
      },
    },
    { name: 'corpo', label: 'Texto', type: 'richText', required: true },
    editorialControlField(),
  ],
}
