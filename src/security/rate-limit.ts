/**
 * Limite de tentativas por IP, em memória. O site roda num único processo por
 * réplica, então um Map basta. A trava por conta do Payload (5 erros → 15 min)
 * continua valendo; este limite impede testar senhas em muitas contas e
 * bloquear de propósito as contas reais.
 */
export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number }

export function createRateLimiter({ max, windowMs }: { max: number; windowMs: number }) {
  const windows = new Map<string, { start: number; count: number }>()

  const prune = (now: number) => {
    for (const [key, entry] of windows) if (now - entry.start >= windowMs) windows.delete(key)
  }

  return {
    hit(key: string, now = Date.now()): RateLimitResult {
      prune(now)
      const entry = windows.get(key)
      if (!entry) {
        windows.set(key, { start: now, count: 1 })
        return { allowed: true }
      }
      if (entry.count < max) {
        entry.count += 1
        return { allowed: true }
      }
      return { allowed: false, retryAfterSeconds: Math.ceil((entry.start + windowMs - now) / 1000) }
    },
    size: () => windows.size,
  }
}

/** O Caddy grava o IP real no fim do X-Forwarded-For e descarta o que o cliente mandou. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  const last = forwarded?.split(',').at(-1)?.trim()
  return last || headers.get('x-real-ip') || 'desconhecido'
}
