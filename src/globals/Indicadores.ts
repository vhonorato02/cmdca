import type { FieldAccess, GlobalBeforeChangeHook, GlobalConfig } from 'payload'
import { APIError } from 'payload'

import {
  canManageContent,
  isLoggedInFieldLevel,
  publishedOrLoggedIn,
} from '../access'
import { EDITORIAL_VERSIONS, GLOBAL_EDITORIAL_COMPONENTS } from '../fields/editorial'
import {
  enforceGlobalEditorDraftOnly,
  isPublishingRequest,
  validateGlobalPublication,
} from '../hooks/editorialPolicy'
import { revalidateGlobal } from '../hooks/revalidate'
import { isBlank, validateExternalURL } from '../utilities/validation'

const readWhenReleased: FieldAccess = ({ doc, req }) =>
  Boolean(req.user) || Boolean((doc as { publicar?: boolean } | undefined)?.publicar)

const validateIndicatorData: GlobalBeforeChangeHook = ({ data, originalDoc, req }) => {
  const merged = { ...(originalDoc ?? {}), ...data } as Record<string, unknown>
  if (
    merged.publicar !== true ||
    !isPublishingRequest(
      data as Record<string, unknown>,
      originalDoc as Record<string, unknown>,
      req,
    )
  ) {
    return data
  }

  const counters = ['alcancados', 'projetos', 'entidades', 'reunioesNoAno']
  if (counters.some((key) => typeof merged[key] !== 'number' || Number(merged[key]) < 0)) {
    throw new APIError('Todos os indicadores publicados devem ser números iguais ou maiores que zero.', 400)
  }

  const series = Array.isArray(merged.serieAnual) ? merged.serieAnual : []
  const years = series.map((row) => String((row as { ano?: unknown }).ano ?? ''))
  if (years.some((year) => !/^\d{4}$/.test(year)) || new Set(years).size !== years.length) {
    throw new APIError('A série anual deve usar anos de quatro dígitos, sem repetição.', 400)
  }

  const areas = Array.isArray(merged.aplicacaoPorArea) ? merged.aplicacaoPorArea : []
  const total = areas.reduce(
    (sum, row) => sum + Number((row as { percentual?: unknown }).percentual ?? 0),
    0,
  )
  if (areas.length && Math.abs(total - 100) > 0.01) {
    throw new APIError('Os percentuais de aplicação por área devem somar exatamente 100%.', 400)
  }
  return data
}

export const Indicadores: GlobalConfig = {
  slug: 'indicadores',
  label: 'Indicadores',
  admin: {
    group: 'Configuração',
    description:
      'Os números ficam ocultos do público até “Publicar indicadores” ser marcado e a fonte ser aprovada.',
    components: GLOBAL_EDITORIAL_COMPONENTS,
  },
  versions: EDITORIAL_VERSIONS,
  hooks: {
    beforeOperation: [enforceGlobalEditorDraftOnly],
    beforeChange: [
      validateIndicatorData,
      validateGlobalPublication([
        {
          path: 'periodoReferencia',
          label: 'período de referência',
          optional: true,
          validate: (value, document) => document.publicar !== true || !isBlank(value),
        },
        {
          path: 'fonte',
          label: 'fonte oficial',
          optional: true,
          rejectPlaceholder: true,
          validate: (value, document) => document.publicar !== true || !isBlank(value),
        },
        {
          path: 'verificadoEm',
          label: 'data de verificação',
          optional: true,
          validate: (value, document) => document.publicar !== true || !isBlank(value),
        },
        {
          path: 'statusRevisao',
          label: 'aprovação jurídica',
          optional: true,
          validate: (value, document) => document.publicar !== true || value === 'aprovada',
        },
      ]),
    ],
    ...revalidateGlobal(['/', '/transparencia']),
  },
  access: { read: publishedOrLoggedIn, update: canManageContent },
  fields: [
    {
      name: 'publicar',
      label: 'Publicar indicadores no site',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Deixe desligado até conferir período, fonte e todos os totais.',
      },
    },
    {
      name: 'periodoReferencia',
      label: 'Período de referência',
      type: 'text',
      admin: { description: 'Ex.: janeiro a dezembro de 2025.' },
    },
    { name: 'fonte', label: 'Fonte oficial', type: 'text' },
    {
      name: 'fonteURL',
      label: 'Link da fonte',
      type: 'text',
      validate: validateExternalURL,
    },
    {
      name: 'verificadoEm',
      label: 'Verificado em',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
    },
    {
      name: 'statusRevisao',
      label: 'Revisão interna (opcional)',
      type: 'select',
      options: [
        { label: 'Pendente', value: 'pendente' },
        { label: 'Aprovada', value: 'aprovada' },
      ],
      access: { create: isLoggedInFieldLevel, update: isLoggedInFieldLevel },
    },
    {
      name: 'observacoesInternas',
      label: 'Observações internas',
      type: 'textarea',
      access: { read: isLoggedInFieldLevel },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'alcancados',
          label: 'Crianças/adolescentes alcançados',
          type: 'number',
          min: 0,
          defaultValue: 0,
          access: { read: readWhenReleased },
          admin: { width: '25%' },
        },
        {
          name: 'projetos',
          label: 'Projetos apoiados',
          type: 'number',
          min: 0,
          defaultValue: 0,
          access: { read: readWhenReleased },
          admin: { width: '25%' },
        },
        {
          name: 'entidades',
          label: 'Entidades registradas',
          type: 'number',
          min: 0,
          defaultValue: 0,
          access: { read: readWhenReleased },
          admin: { width: '25%' },
        },
        {
          name: 'reunioesNoAno',
          label: 'Reuniões no período',
          type: 'number',
          min: 0,
          defaultValue: 0,
          access: { read: readWhenReleased },
          admin: { width: '25%' },
        },
      ],
    },
    {
      name: 'serieAnual',
      label: 'Série anual',
      type: 'array',
      access: { read: readWhenReleased },
      fields: [
        {
          name: 'ano',
          label: 'Ano',
          type: 'text',
          required: true,
          validate: (value: unknown) =>
            typeof value === 'string' && /^\d{4}$/.test(value)
              ? true
              : 'Use um ano com quatro dígitos.',
        },
        { name: 'valor', label: 'Valor', type: 'number', required: true, min: 0 },
      ],
    },
    {
      name: 'aplicacaoPorArea',
      label: 'Aplicação por área',
      type: 'array',
      access: { read: readWhenReleased },
      admin: { description: 'Quando preenchidos, os percentuais devem somar 100%.' },
      fields: [
        { name: 'area', label: 'Área', type: 'text', required: true },
        {
          name: 'percentual',
          label: 'Percentual (%)',
          type: 'number',
          required: true,
          min: 0,
          max: 100,
        },
      ],
    },
    {
      name: 'observacao',
      label: 'Nota pública sobre os dados',
      type: 'textarea',
      access: { read: readWhenReleased },
    },
  ],
}
