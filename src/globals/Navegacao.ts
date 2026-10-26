import type { Field, GlobalAfterChangeHook, GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

import { canManageContent, isAuthenticated, publishedOrLoggedIn } from '../access'
import { EDITORIAL_VERSIONS, GLOBAL_EDITORIAL_COMPONENTS } from '../fields/editorial'
import { validateGlobalPublication } from '../hooks/editorialPolicy'
import { DEFAULT_NAVIGATION, validateNavigationHref } from '../lib/navigation'

const makeLinks = (
  name: string,
  label: string,
  defaultValue: { label: string; href: string }[],
  minRows: number,
  maxRows: number,
): Field => ({
  name,
  label,
  type: 'array',
  labels: { singular: 'Link', plural: 'Links' },
  minRows,
  maxRows,
  defaultValue,
  admin: { description: 'Arraste os itens para reordenar.' },
  fields: [
    {
      name: 'label',
      label: 'Texto do link',
      type: 'text',
      required: true,
      maxLength: 40,
      validate: (value: unknown) =>
        typeof value === 'string' && value.trim().length > 0 && value.trim().length <= 40
          ? true
          : 'Informe um texto de até 40 caracteres.',
    },
    {
      name: 'href',
      label: 'Destino',
      type: 'text',
      required: true,
      validate: validateNavigationHref,
      admin: { description: 'Use um caminho interno, como /conselho, ou uma URL https://.' },
    },
  ],
})

export const revalidateNavigation: GlobalAfterChangeHook = async ({ doc, previousDoc, req }) => {
  if (process.env.DATABASE_MIGRATION === 'true') return doc
  const current = doc as { _status?: string }
  const previous = previousDoc as { _status?: string } | undefined
  const isUnpublish =
    previous?._status === 'published' &&
    current._status !== 'published' &&
    (req.query?.unpublishAllLocales === 'true' || req.query?.unpublishAllLocales === true ||
      (req.query?.draft !== 'true' && req.query?.draft !== true))

  if (current._status === 'published' || isUnpublish) {
    try {
      revalidatePath('/', 'layout')
    } catch (error) {
      req.payload.logger.warn({ err: error }, 'Falha ao revalidar a navegação pública')
    }
  }
  return doc
}

export const Navegacao: GlobalConfig = {
  slug: 'navegacao',
  label: 'Navegação do site',
  admin: {
    group: 'Configuração',
    description: 'Organize os menus, salve rascunhos e publique as alterações.',
    components: GLOBAL_EDITORIAL_COMPONENTS,
  },
  versions: EDITORIAL_VERSIONS,
  hooks: {
    beforeChange: [
      validateGlobalPublication([
        { path: 'menuPrincipal', label: 'menu principal' },
        { path: 'rodapeInstitucional', label: 'menu institucional do rodapé' },
      ]),
    ],
    afterChange: [revalidateNavigation],
  },
  access: {
    read: publishedOrLoggedIn,
    update: canManageContent,
    readVersions: isAuthenticated,
  },
  fields: [
    makeLinks(
      'menuPrincipal',
      'Menu principal',
      [
        { label: 'CMDCA', href: '/conselho' },
        { label: 'Reuniões', href: '/reunioes' },
        { label: 'Transparência', href: '/transparencia' },
        { label: 'Fundo e IR', href: '/fmdca' },
        { label: 'Notícias', href: '/noticias' },
        { label: 'Participe', href: '/participe' },
      ],
      1,
      6,
    ),
    makeLinks(
      'rodapeInstitucional',
      'Navegação institucional do rodapé',
      [
        { label: 'Sobre o CMDCA', href: '/conselho' },
        { label: 'Reuniões', href: '/reunioes' },
        { label: 'Transparência', href: '/transparencia' },
        { label: 'Fundo Municipal', href: '/fmdca' },
        { label: 'Conferências', href: '/conferencias' },
        { label: 'Notícias', href: '/noticias' },
      ],
      1,
      8,
    ),
    makeLinks(
      'rodapeSobreSite',
      'Links "Sobre o site" no rodapé',
      DEFAULT_NAVIGATION.rodapeSobreSite,
      1,
      8,
    ),
  ],
}
