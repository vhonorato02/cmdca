import type { GlobalConfig } from 'payload'

import { anyone, isAdminOrEditor } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const PaginaInicial: GlobalConfig = {
  slug: 'pagina-inicial',
  label: 'Página inicial',
  admin: {
    group: 'Configuração',
    description: 'Quais blocos aparecem na home e em que ordem.',
  },
  versions: true,
  hooks: revalidateGlobal(['/']),
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'blocos',
      label: 'Blocos (na ordem de exibição)',
      type: 'array',
      labels: { singular: 'Bloco', plural: 'Blocos' },
      admin: {
        description: 'Arraste para reordenar. Desmarque "Ativo" para ocultar sem remover.',
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
            { label: 'O Conselho (sobre + diretoria)', value: 'sobre' },
            { label: 'Acesso rápido (atalhos)', value: 'atalhos' },
            { label: 'Indicadores (números)', value: 'indicadores' },
            { label: 'Vozes (depoimentos)', value: 'vozes' },
            { label: 'Notícias recentes', value: 'noticias' },
          ],
        },
        { name: 'ativo', label: 'Ativo', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
