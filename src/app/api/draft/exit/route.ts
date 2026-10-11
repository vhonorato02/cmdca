import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return new Response('Forbidden', { status: 403, headers: { 'Cache-Control': 'no-store' } })
  }
  const mode = await draftMode()
  await mode.disable()
  return NextResponse.redirect(new URL('/noticias', request.url), {
    status: 303,
    headers: { 'Cache-Control': 'no-store' },
  })
}
