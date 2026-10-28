import { absoluteUrl } from '@/lib/site'

// RFC 9116: canal para relatar falhas de segurança do portal.
// A validade é renovada a cada build/deploy (no máximo um ano, como pede a norma).
export const dynamic = 'force-static'

export function GET() {
  const expires = new Date()
  expires.setUTCFullYear(expires.getUTCFullYear() + 1)
  const body = [
    'Contact: mailto:cmdca@pindamonhangaba.sp.gov.br',
    `Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, 'Z')}`,
    'Preferred-Languages: pt-BR, en',
    `Canonical: ${absoluteUrl('/.well-known/security.txt')}`,
    `Policy: ${absoluteUrl('/privacidade')}`,
    '',
  ].join('\n')
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
