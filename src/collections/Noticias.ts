import type { CollectionConfig } from 'payload'

import { isAdminOrEditor, publishedOrLoggedIn } from '../access'
import { revalidateCollection } from '../hooks/revalidate'
import { slugField } from '../fields/slug'
import { TEMA_OPTIONS } from '../fields/tema'

export const Noticias: CollectionConfig = {
  slug: 'noticias',
  labels: { singular: 'Notícia', plural: 'Notícias' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'categoria', 'data', '_status'],
    group: 'Conteúdo',
    description: 'Blog do conselho. Salve como rascunho e publique quando aprovado.',
  },
  versions: { drafts: true, maxPerDoc: 25 },
  hooks: revalidateCollection((doc) => ['/', '/noticias', '/noticias/' + String(doc.slug ?? '')]),
  access: {
    read: publishedOrLoggedIn,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'title', label: 'Título', type: 'text', required: true },
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
      maxLength: 320,
      admin: {
        description:
          'Chamada curta (até 320 caracteres) exibida nas listagens, no Open Graph e no compartilhamento.',
      },
    },
    { name: 'corpo', label: 'Corpo', type: 'richText' },
    {
      name: 'capa',
      label: 'Imagem de capa',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Opcional. Sem capa, usamos uma ilustração autoral (campo Tema).',
      },
    },
    {
      name: 'tema',
      label: 'Tema da ilustração',
      type: 'select',
      options: TEMA_OPTIONS,
      defaultValue: 'familia',
      admin: {
        position: 'sidebar',
        description: 'Ilustração usada quando não há imagem de capa.',
      },
    },
    {
      name: 'autor',
      label: 'Autoria',
      type: 'text',
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
      label: 'Data',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
      },
    },
  ],
}
