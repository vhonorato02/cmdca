import type { CollectionConfig } from 'payload'

import { canDeleteContent, canManageContent, publishedOrLoggedIn } from '../access'
import { COLLECTION_EDITORIAL_COMPONENTS, EDITORIAL_VERSIONS } from '../fields/editorial'
import { TEMA_OPTIONS } from '../fields/tema'
import { enforceEditorDraftOnly, validatePublication } from '../hooks/editorialPolicy'
import { revalidateCollection } from '../hooks/revalidate'
import { isBlank, validatePublicHref } from '../utilities/validation'

const revalidation = revalidateCollection(() => ['/'])

function validCTA(_value: unknown, document: Record<string, unknown>): boolean {
  const cta = document.cta as { href?: unknown; label?: unknown } | null | undefined
  const hasLabel = !isBlank(cta?.label)
  const hasHref = !isBlank(cta?.href)
  return (!hasLabel && !hasHref) || (hasLabel && hasHref && validatePublicHref(cta?.href) === true)
}

export const Destaques: CollectionConfig = {
  slug: 'destaques',
  labels: { singular: 'Destaque', plural: 'Destaques (slider)' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'ordem', '_status'],
    group: 'Rede e participação',
    description:
      'Slides do banner principal. Editor prepara o rascunho; jurídico ou administração publica.',
    components: COLLECTION_EDITORIAL_COMPONENTS,
  },
  defaultSort: 'ordem',
  versions: EDITORIAL_VERSIONS,
  trash: true,
  hooks: {
    beforeOperation: [enforceEditorDraftOnly],
    beforeChange: [
      validatePublication([
        { path: 'titulo', label: 'título', rejectPlaceholder: true },
        {
          path: 'kicker',
          label: 'chapéu sem informação pendente',
          optional: true,
          rejectPlaceholder: true,
        },
        {
          path: 'texto',
          label: 'texto sem informação pendente',
          optional: true,
          rejectPlaceholder: true,
        },
        {
          path: 'cta',
          label: 'botão com texto e link seguros, ou ambos vazios',
          optional: true,
          validate: validCTA,
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
    {
      name: 'kicker',
      label: 'Chapéu (kicker)',
      type: 'text',
      maxLength: 80,
      admin: { description: 'Texto curto acima do título. Ex.: “Conferência 2026”.' },
    },
    { name: 'titulo', label: 'Título', type: 'text', required: true, maxLength: 180 },
    { name: 'texto', label: 'Texto', type: 'textarea', maxLength: 420 },
    {
      name: 'cta',
      label: 'Botão (chamada para ação)',
      type: 'group',
      admin: { description: 'Preencha texto e link juntos, ou deixe os dois campos vazios.' },
      fields: [
        { name: 'label', label: 'Texto do botão', type: 'text', maxLength: 80 },
        {
          name: 'href',
          label: 'Link',
          type: 'text',
          validate: validatePublicHref,
          admin: { description: 'Ex.: “/transparencia” ou “https://...”.' },
        },
      ],
    },
    {
      name: 'tema',
      label: 'Tema da ilustração',
      type: 'select',
      options: TEMA_OPTIONS,
      defaultValue: 'cidade',
      admin: { description: 'Ilustração autoral exibida no slide.' },
    },
    {
      name: 'ordem',
      label: 'Ordem',
      type: 'number',
      required: true,
      min: 0,
      max: 9999,
      defaultValue: 0,
      admin: { position: 'sidebar', step: 1 },
    },
  ],
}
