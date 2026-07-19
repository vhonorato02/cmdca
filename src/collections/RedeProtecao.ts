import type { CollectionConfig } from 'payload'

import { canDeleteContent, canManageContent, publishedOrLoggedIn } from '../access'
import {
  COLLECTION_EDITORIAL_COMPONENTS,
  EDITORIAL_VERSIONS,
  editorialControlField,
} from '../fields/editorial'
import { enforceEditorDraftOnly, validatePublication } from '../hooks/editorialPolicy'
import { revalidateCollection } from '../hooks/revalidate'
import {
  isBlank,
  validateCoordinatePair,
  validateEmail,
  validateLatitude,
  validateLongitude,
} from '../utilities/validation'

const revalidation = revalidateCollection(() => ['/ajuda'])

export const RedeProtecao: CollectionConfig = {
  slug: 'rede-protecao',
  labels: { singular: 'Ponto da rede', plural: 'Rede de Proteção' },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'tipo', 'telefone', 'email', '_status'],
    group: 'Rede e participação',
    description:
      'Serviços exibidos no mapa e na lista acessível da página Ajuda. Confirme os canais diretamente com o órgão antes de publicar.',
    components: COLLECTION_EDITORIAL_COMPONENTS,
  },
  versions: EDITORIAL_VERSIONS,
  trash: true,
  hooks: {
    beforeOperation: [enforceEditorDraftOnly],
    beforeChange: [
      validatePublication([
        { path: 'nome', label: 'nome do serviço', rejectPlaceholder: true },
        { path: 'tipo', label: 'tipo do serviço' },
        {
          path: 'endereco',
          label: 'endereço confirmado',
          optional: true,
          rejectPlaceholder: true,
        },
        {
          path: 'telefone',
          label: 'telefone confirmado',
          optional: true,
          rejectPlaceholder: true,
        },
        {
          path: 'email',
          label: 'e-mail confirmado',
          optional: true,
          rejectPlaceholder: true,
        },
        {
          path: 'horario',
          label: 'horário confirmado',
          optional: true,
          rejectPlaceholder: true,
        },
        {
          path: 'obs',
          label: 'observações sem informações pendentes',
          optional: true,
          rejectPlaceholder: true,
        },
        {
          path: 'telefone',
          label: 'ao menos um telefone ou e-mail de contato',
          optional: true,
          validate: (_value, document) =>
            !isBlank(document.telefone) || !isBlank(document.email),
        },
        {
          path: 'lat',
          label: 'latitude e longitude preenchidas em conjunto',
          optional: true,
          validate: (_value, document) => validateCoordinatePair(document) === true,
        },
        {
          path: 'controleEditorial.fonte',
          label: 'fonte oficial confirmada',
          rejectPlaceholder: true,
        },
        { path: 'controleEditorial.verificadoEm', label: 'data de verificação' },
        {
          path: 'controleEditorial.statusRevisao',
          label: 'revisão jurídica aprovada ou dispensada',
          validate: (value) => value === 'aprovada' || value === 'dispensada',
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
    { name: 'nome', label: 'Nome', type: 'text', required: true, maxLength: 180 },
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
    {
      name: 'endereco',
      label: 'Endereço',
      type: 'textarea',
      maxLength: 400,
      admin: { description: 'Inclua logradouro, número, bairro e referência quando disponíveis.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'telefone',
          label: 'Telefone',
          type: 'text',
          maxLength: 80,
          admin: { width: '50%', description: 'Informe DDD e identifique WhatsApp ou plantão.' },
        },
        {
          name: 'email',
          label: 'E-mail',
          type: 'text',
          validate: validateEmail,
          maxLength: 180,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'horario',
      label: 'Horário de atendimento',
      type: 'text',
      maxLength: 180,
      admin: { description: 'Ex.: “segunda a sexta, das 8h às 17h”.' },
    },
    {
      name: 'obs',
      label: 'Observações',
      type: 'textarea',
      maxLength: 500,
      admin: { description: 'Ex.: plantão fora do horário ou regras de atendimento.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'lat',
          label: 'Latitude',
          type: 'number',
          validate: validateLatitude,
          admin: {
            width: '50%',
            step: 0.000001,
            description: 'Coordenada entre -90 e 90. Ex.: -22.9239.',
          },
        },
        {
          name: 'lng',
          label: 'Longitude',
          type: 'number',
          validate: validateLongitude,
          admin: {
            width: '50%',
            step: 0.000001,
            description: 'Coordenada entre -180 e 180. Ex.: -45.4617.',
          },
        },
      ],
    },
    editorialControlField(),
  ],
}
