import type { CollectionConfig } from 'payload'

import { isAdminOrEditor, publishedOrLoggedIn } from '../access'
import { revalidateCollection } from '../hooks/revalidate'

export const RedeProtecao: CollectionConfig = {
  slug: 'rede-protecao',
  labels: { singular: 'Ponto da rede', plural: 'Rede de Proteção' },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'tipo', 'telefone', '_status'],
    group: 'Rede & Participação',
    description: 'Pontos da rede de proteção exibidos no mapa e na lista acessível da página Ajuda.',
  },
  versions: { drafts: true },
  hooks: revalidateCollection(() => ['/ajuda']),
  access: {
    read: publishedOrLoggedIn,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'nome', label: 'Nome', type: 'text', required: true },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select',
      required: true,
      defaultValue: 'ct',
      options: [
        { label: 'Conselho Tutelar', value: 'ct' },
        { label: 'CRAS', value: 'cras' },
        { label: 'CREAS', value: 'creas' },
        { label: 'Casa de acolhimento', value: 'casa' },
        { label: 'Outro', value: 'outro' },
      ],
    },
    { name: 'endereco', label: 'Endereço', type: 'textarea' },
    { name: 'telefone', label: 'Telefone', type: 'text' },
    { name: 'email', label: 'E-mail', type: 'text' },
    { name: 'horario', label: 'Horário de atendimento', type: 'text' },
    {
      name: 'obs',
      label: 'Observações',
      type: 'textarea',
      admin: { description: 'Ex.: plantão fora do horário, regras de atendimento.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'lat',
          label: 'Latitude',
          type: 'number',
          admin: {
            width: '50%',
            description: 'Coordenada para o mapa (ex.: -22.9239). [A CONFIRMAR] se ausente.',
          },
        },
        {
          name: 'lng',
          label: 'Longitude',
          type: 'number',
          admin: { width: '50%', description: 'Coordenada para o mapa (ex.: -45.4617).' },
        },
      ],
    },
  ],
}
