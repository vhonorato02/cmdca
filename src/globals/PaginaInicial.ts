import type { GlobalConfig } from 'payload'

import { canManageContent, isAuthenticated, publishedOrLoggedIn } from '../access'
import {
  EDITORIAL_VERSIONS,
  GLOBAL_EDITORIAL_COMPONENTS,
  imageFilter,
} from '../fields/editorial'
import { enforceGlobalEditorDraftOnly, uploadHasMime, validateGlobalPublication } from '../hooks/editorialPolicy'
import { revalidateGlobal } from '../hooks/revalidate'
import { PAGINA_INICIAL_PADRAO as P } from '../content/defaults'

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
        { name: 'titulo', label: 'Título', type: 'text', maxLength: 140, defaultValue: P.capa.titulo },
        {
          name: 'texto',
          label: 'Apresentação',
          type: 'textarea',
          maxLength: 320,
          defaultValue: P.capa.texto,
        },
        {
          name: 'imagem', label: 'Imagem da capa', type: 'upload', relationTo: 'media',
          filterOptions: imageFilter,
          admin: { description: 'Escolha uma imagem publicada com texto alternativo e crédito conferidos.' },
        },
      ],
    },
    {
      name: 'rotas',
      label: 'Três caminhos abaixo da capa',
      type: 'group',
      admin: { description: 'Os destinos são fixos: Buscar ajuda, Fundo e IR e Reuniões.' },
      fields: [
        { type: 'row', fields: [
          { name: 'protecaoTitulo', label: 'Proteção: título', type: 'text', maxLength: 40, defaultValue: P.rotas.protecaoTitulo, admin: { width: '40%' } },
          { name: 'protecaoTexto', label: 'Proteção: texto', type: 'text', maxLength: 120, defaultValue: P.rotas.protecaoTexto, admin: { width: '60%' } },
        ] },
        { type: 'row', fields: [
          { name: 'fundoTitulo', label: 'Fundo: título', type: 'text', maxLength: 40, defaultValue: P.rotas.fundoTitulo, admin: { width: '40%' } },
          { name: 'fundoTexto', label: 'Fundo: texto', type: 'text', maxLength: 120, defaultValue: P.rotas.fundoTexto, admin: { width: '60%' } },
        ] },
        { type: 'row', fields: [
          { name: 'atosTitulo', label: 'Atos: título', type: 'text', maxLength: 40, defaultValue: P.rotas.atosTitulo, admin: { width: '40%' } },
          { name: 'atosTexto', label: 'Atos: texto', type: 'text', maxLength: 120, defaultValue: P.rotas.atosTexto, admin: { width: '60%' } },
        ] },
      ],
    },
    {
      name: 'sobre',
      label: 'Bloco "O Conselho"',
      type: 'group',
      fields: [
        { name: 'titulo', label: 'Título', type: 'text', maxLength: 80, defaultValue: P.sobre.titulo },
        { name: 'texto', label: 'Texto', type: 'textarea', maxLength: 400, defaultValue: P.sobre.texto },
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
            { label: 'Destaques', value: 'slider' },
            { label: 'O Conselho', value: 'sobre' },
            { label: 'Três caminhos (sempre logo abaixo da capa)', value: 'atalhos' },
            { label: 'Indicadores (só aparece com dados publicados)', value: 'indicadores' },
            { label: 'Vozes', value: 'vozes' },
            { label: 'Notícias recentes', value: 'noticias' },
          ],
        },
        { name: 'ativo', label: 'Ativo', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
