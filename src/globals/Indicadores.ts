import type { GlobalConfig } from 'payload'

import { anyone, isAdminOrEditor } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const Indicadores: GlobalConfig = {
  slug: 'indicadores',
  label: 'Indicadores',
  admin: {
    group: 'Configuração',
    description:
      'Números do painel "O conselho em números" e dos gráficos. Editar aqui atualiza contadores e gráficos no site.',
  },
  versions: true,
  hooks: revalidateGlobal(['/', '/transparencia']),
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'alcancados', label: 'Crianças/adolescentes alcançados', type: 'number', defaultValue: 0, admin: { width: '25%' } },
        { name: 'projetos', label: 'Projetos apoiados', type: 'number', defaultValue: 0, admin: { width: '25%' } },
        { name: 'entidades', label: 'Entidades registradas', type: 'number', defaultValue: 0, admin: { width: '25%' } },
        { name: 'reunioesNoAno', label: 'Reuniões no ano', type: 'number', defaultValue: 0, admin: { width: '25%' } },
      ],
    },
    {
      name: 'serieAnual',
      label: 'Série anual (gráfico por ano)',
      type: 'array',
      labels: { singular: 'Ano', plural: 'Anos' },
      admin: { description: 'Ex.: projetos apoiados por ano.' },
      fields: [
        { name: 'ano', label: 'Ano', type: 'text', required: true },
        { name: 'valor', label: 'Valor', type: 'number', required: true },
      ],
    },
    {
      name: 'aplicacaoPorArea',
      label: 'Aplicação por área (gráfico por área)',
      type: 'array',
      labels: { singular: 'Área', plural: 'Áreas' },
      admin: { description: 'Percentual de recursos aplicados por área. Some ~100%.' },
      fields: [
        { name: 'area', label: 'Área', type: 'text', required: true },
        { name: 'percentual', label: 'Percentual (%)', type: 'number', required: true },
      ],
    },
    {
      name: 'observacao',
      label: 'Observação',
      type: 'textarea',
      defaultValue:
        'Valores ilustrativos — substituir pelos dados oficiais do conselho/FMDCA.',
      admin: { description: 'Aviso exibido junto ao painel enquanto os números forem ilustrativos.' },
    },
  ],
}
