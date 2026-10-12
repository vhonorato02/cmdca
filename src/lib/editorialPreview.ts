import { roleOf } from '../access'
import { getSiteUrl } from './site'

export function hasEditorialOrigin(request: Request): boolean {
  return request.headers.get('origin') === getSiteUrl().origin
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isValidEditorialSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && slug.length <= 180 && SLUG_PATTERN.test(slug)
}

export function isEditorialPreviewUser(user: unknown): boolean {
  return Boolean(roleOf(user))
}

export function editorialPath(slug: string): string {
  if (!isValidEditorialSlug(slug)) throw new TypeError('Invalid editorial slug')
  return `/noticias/${encodeURIComponent(slug)}`
}

export function editorialPreviewEntryPath(slug: string): string {
  if (!isValidEditorialSlug(slug)) throw new TypeError('Invalid editorial slug')
  return `/api/draft?slug=${encodeURIComponent(slug)}`
}

export function editorialPreviewMetadata() {
  return { robots: { index: false, follow: false } } as const
}
