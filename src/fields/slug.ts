import type { Field } from 'payload'

import { formatSlug } from '../utilities/formatSlug'

type SlugOptions = {
  /** Campo de origem para gerar o slug (padrão: "title"). */
  trackingField?: string
}

/**
 * Campo de slug com geração automática a partir de outro campo (via hook
 * beforeValidate). Fica na sidebar, é indexado e único. Continua editável.
 */
export const slugField = ({ trackingField = 'title' }: SlugOptions = {}): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description:
      'Gerado automaticamente a partir do título. Edite apenas se necessário — altera a URL pública.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data, originalDoc }) => {
        if (typeof value === 'string' && value.trim().length > 0) {
          return formatSlug(value)
        }
        const source = (data?.[trackingField] ?? originalDoc?.[trackingField]) as
          | string
          | undefined
        if (typeof source === 'string' && source.length > 0) {
          return formatSlug(source)
        }
        return value
      },
    ],
  },
})
