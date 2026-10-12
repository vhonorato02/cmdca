import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'
import { hasEditorialOrigin } from '@/lib/editorialPreview'
import { getSiteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!hasEditorialOrigin(request)) {
    return new Response('Forbidden', { status: 403, headers: { 'Cache-Control': 'no-store' } })
  }
  const mode = await draftMode()
  await mode.disable()
  return NextResponse.redirect(new URL('/noticias', getSiteUrl()), {
    status: 303,
    headers: { 'Cache-Control': 'no-store' },
  })
}
