import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import configPromise from '@/payload.config'
import {
  editorialPath,
  hasEditorialOrigin,
  isEditorialPreviewUser,
  isValidEditorialSlug,
} from '@/lib/editorialPreview'
import { getSiteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get('slug')
  if (!isValidEditorialSlug(slug)) {
    return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } })
  }

  return new Response(
    `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Abrir prévia</title><body><main><h1>Prévia editorial</h1><form method="post" action="/api/draft"><input type="hidden" name="slug" value="${slug}"><button type="submit">Abrir prévia</button></form></main><script>document.querySelector('form').requestSubmit()</script></body></html>`,
    {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Security-Policy': "default-src 'none'; form-action 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'",
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
      },
    },
  )
}

export async function POST(request: Request) {
  if (!hasEditorialOrigin(request)) {
    return new Response('Forbidden', { status: 403, headers: { 'Cache-Control': 'no-store' } })
  }
  const form = await request.formData()
  const slug = form.get('slug')
  if (!isValidEditorialSlug(slug)) {
    return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } })
  }

  const payload = await getPayload({ config: await configPromise })
  const { user } = await payload.auth({ headers: request.headers })
  if (!isEditorialPreviewUser(user)) {
    return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } })
  }

  const result = await payload.find({
    collection: 'noticias',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    draft: true,
    overrideAccess: false,
    user,
  })
  if (!result.docs.length) {
    return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } })
  }

  const mode = await draftMode()
  await mode.enable()
  return NextResponse.redirect(new URL(editorialPath(slug), getSiteUrl()), {
    status: 303,
    headers: { 'Cache-Control': 'no-store' },
  })
}
