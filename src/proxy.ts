import { NextResponse, type NextRequest } from 'next/server'

import { clientIp, createRateLimiter } from '@/security/rate-limit'

// 20 tentativas de login ou recuperação de senha por IP a cada 10 minutos.
// O CI sobe o limite (LOGIN_RATE_LIMIT_MAX) porque todos os testes saem do mesmo IP.
const limiter = createRateLimiter({
  max: Number(process.env.LOGIN_RATE_LIMIT_MAX) || 20,
  windowMs: 10 * 60 * 1000,
})

export function proxy(request: NextRequest) {
  if (request.method !== 'POST') return NextResponse.next()

  const result = limiter.hit(clientIp(request.headers))
  if (result.allowed) return NextResponse.next()

  return NextResponse.json(
    { errors: [{ message: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.' }] },
    { status: 429, headers: { 'Retry-After': String(result.retryAfterSeconds) } },
  )
}

export const config = {
  matcher: ['/api/users/login', '/api/users/forgot-password'],
}
