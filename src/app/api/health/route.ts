import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayloadClient()
    await payload.count({ collection: 'noticias', overrideAccess: false })
    return Response.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    // Never return database addresses, credentials or internal errors publicly.
    return Response.json(
      { status: 'unavailable' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
