import type { CollectionConfig } from 'payload'

import { canDeleteContent, canManageContent, publishedOrLoggedIn } from '../access'
import {
  COLLECTION_EDITORIAL_COMPONENTS,
  EDITORIAL_VERSIONS,
  editorialControlField,
  imageFilter,
} from '../fields/editorial'
import { slugField } from '../fields/slug'
import { TEMA_OPTIONS } from '../fields/tema'
import {
  enforceEditorDraftOnly,
  uploadHasMime,
  validatePublication,
} from '../hooks/editorialPolicy'
import { revalidateCollection } from '../hooks/revalidate'

const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const revalidation = revalidateCollection((doc) => [
  '/',
  '/noticias',
  '/conferencias',
  doc.slug ? `/noticias/${String(doc.slug)}` : '',
])

export const Noticias: CollectionConfig = {
  slug: 'noticias',
  labels: { singular: 'Notícia', plural: 'Notícias' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'categoria', 'data', '_status'],
    group: 'Conteúdo editorial',
    description: 'Prepare o texto como rascunho. Jurídico ou administração conferem e publicam.',
    components: COLLECTION_EDITORIAL_COMPONENTS,
  },
  versions: EDITORIAL_VERSIONS,
  trash: true,
  hooks: {
    beforeOperation: [enforceEditorDraftOnly],
    beforeChange: [
      validatePublication([
        { path: 'title', label: 'título' },
        { path: 'slug', label: 'endereço da notícia' },
        { path: 'resumo', label: 'resumo' },
        { path: 'corpo', label: 'corpo da notícia', richText: true },
        { path: 'data', label: 'data da publicação' },
        { path: 'controleEditorial.fonte', label: 'fonte confirmada', rejectPlaceholder: true },
        { path: 'controleEditorial.verificadoEm', label: 'data de verificação' },
        {
          path: 'controleEditorial.statusRevisao',
          label: 'aprovação jurídica para nota técnica',
          validate: (value, document) =>
            document.categoria !== 'nota-tecnica' || value === 'aprovada',
        },
        {
          path: 'capa',
          label: 'capa em formato de imagem',
          optional: true,
          validate: (value, _document, req) =>
            value == null || value === '' ? true : uploadHasMime(value, req, IMAGE_MIMES),
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
    { name: 'title', label: 'Título', type: 'text', required: true, maxLength: 180 },
    slugField(),
    {
      name: 'categoria',
      label: 'Categoria',
      type: 'select',
      required: true,
      defaultValue: 'noticia',
      options: [
        { label: 'Notícia', value: 'noticia' },
        { label: 'Conferência', value: 'conferencia' },
        { label: 'Evento', value: 'evento' },
        { label: 'Gestão', value: 'gestao' },
        { label: 'FMDCA', value: 'fmdca' },
        { label: 'Orientação', value: 'orientacao' },
        { label: 'Nota técnica', value: 'nota-tecnica' },
      ],
    },
    {
      name: 'resumo',
      label: 'Resumo',
      type: 'textarea',
      required: true,
      minLength: 40,
      maxLength: 320,
      admin: { description: 'Chamada objetiva entre 40 e 320 caracteres.' },
    },
    { name: 'corpo', label: 'Corpo', type: 'richText', required: true },
    {
      name: 'capa',
      label: 'Imagem de capa',
      type: 'upload',
      relationTo: 'media',
      filterOptions: imageFilter,
      admin: { description: 'Somente JPG, PNG, WebP ou GIF. PDF não pode ser usado como capa.' },
    },
    {
      name: 'tema',
      label: 'Tema da ilustração',
      type: 'select',
      options: TEMA_OPTIONS,
      defaultValue: 'familia',
      admin: { position: 'sidebar', description: 'Usado quando não houver capa.' },
    },
    {
      name: 'autor',
      label: 'Autoria',
      type: 'text',
      required: true,
      defaultValue: 'Comunicação CMDCA',
      admin: { position: 'sidebar' },
    },
    {
      name: 'destaque',
      label: 'Destaque na página inicial',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'data',
      label: 'Data da publicação',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
      },
    },
    editorialControlField(),
  ],
}
