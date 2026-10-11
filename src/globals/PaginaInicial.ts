import type { GlobalConfig } from 'payload'

import { canManageContent, isAuthenticated, publishedOrLoggedIn } from '../access'
import {
  EDITORIAL_VERSIONS,
  GLOBAL_EDITORIAL_COMPONENTS,
  imageFilter,
} from '../fields/editorial'
import { enforceGlobalEditorDraftOnly, uploadHasMime, validateGlobalPublication } from '../hooks/editorialPolicy'
import { revalidateGlobal } from '../hooks/revalidate'

export const PaginaInicial: GlobalConfig = {
  slug: 'pagina-inicial',
  label: 'Página inicial',
  admin: {
    group: 'Configuração',
    description: 'Organize os blocos, salve rascunhos e publique quando o conteúdo estiver conferido.',
    components: GLOBAL_EDITORIAL_COMPONENTS,
  },
  versions: EDITORIAL_VERSIONS,
  hooks: {
    beforeOperation: [enforceGlobalEditorDraftOnly],
    beforeChange: [
      validateGlobalPublication([
        { path: 'capa.titulo', label: 'título da capa', optional: true, rejectPlaceholder: true },
        { path: 'capa.texto', label: 'texto da capa', optional: true, rejectPlaceholder: true },
        {
          path: 'capa.imagem', label: 'imagem publicada da capa', optional: true,
          validate: (value, _document, req) => value == null || value === ''
            ? true : uploadHasMime(value, req, ['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
        },
      ]),
    ],
    ...revalidateGlobal(['/']),
  },
  access: {
    read: publishedOrLoggedIn,
    readVersions: isAuthenticated,
    update: canManageContent,
  },
  fields: [
    {
      name: 'capa',
      label: 'Capa da página inicial',
      type: 'group',
      fields: [
        { name: 'titulo', label: 'Título', type: 'text', maxLength: 140 },
        { name: 'texto', label: 'Apresentação', type: 'textarea', maxLength: 320 },
        {
          name: 'imagem', label: 'Imagem da capa', type: 'upload', relationTo: 'media',
          filterOptions: imageFilter,
          admin: { description: 'Escolha uma imagem publicada com texto alternativo e crédito conferidos.' },
        },
      ],
    },
    {
      name: 'blocos',
      label: 'Blocos na ordem de exibição',
      type: 'array',
      labels: { singular: 'Bloco', plural: 'Blocos' },
      minRows: 1,
      maxRows: 6,
      validate: (value: unknown) => {
        if (!Array.isArray(value)) return 'Inclua pelo menos um bloco.'
        const types = value.map((row) => (row as { tipo?: unknown }).tipo).filter(Boolean)
        return new Set(types).size === types.length ? true : 'Cada tipo de bloco pode aparecer uma única vez.'
      },
      admin: {
        description: 'Arraste para reordenar. Desative para ocultar sem perder a configuração.',
        initCollapsed: true,
      },
      defaultValue: [
        { tipo: 'slider', ativo: true },
        { tipo: 'sobre', ativo: true },
        { tipo: 'atalhos', ativo: true },
        { tipo: 'indicadores', ativo: true },
        { tipo: 'vozes', ativo: true },
        { tipo: 'noticias', ativo: true },
      ],
      fields: [
        {
          name: 'tipo',
          label: 'Bloco',
          type: 'select',
          required: true,
          options: [
            { label: 'Slider de destaques', value: 'slider' },
            { label: 'O Conselho', value: 'sobre' },
            { label: 'Acesso rápido', value: 'atalhos' },
            { label: 'Indicadores', value: 'indicadores' },
            { label: 'Vozes', value: 'vozes' },
            { label: 'Notícias recentes', value: 'noticias' },
          ],
        },
        { name: 'ativo', label: 'Ativo', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
