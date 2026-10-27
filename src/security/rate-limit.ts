/**
 * Limite de tentativas por IP, em memória. O site roda num único processo por
 * réplica, então um Map basta. A trava por conta do Payload (5 erros → 15 min)
 * continua valendo; este limite impede testar senhas em muitas contas e
 * bloquear de propósito as contas reais.
 *
 * Limites conhecidos: o contador zera a cada deploy/restart e se divide entre as
 * duas réplicas durante a troca. Se entrar uma CDN na frente do Caddy, o último
 * X-Forwarded-For passa a ser o da CDN (veja docs/decisions/0010).
 */
export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number }

export function createRateLimiter({
  max,
  windowMs,
  maxEntries = 50_000,
}: {
  max: number
  windowMs: number
  maxEntries?: number
}) {
  // O Map guarda a ordem de inserção e cada janela nova entra no fim, então as
  // janelas vencidas estão sempre no começo: a limpeza para no primeiro item válido.
  const windows = new Map<string, { start: number; count: number }>()

  const prune = (now: number) => {
    for (const [key, entry] of windows) {
      if (now - entry.start < windowMs) break
      windows.delete(key)
    }
  }

  return {
    hit(key: string, now = Date.now()): RateLimitResult {
      prune(now)
      const entry = windows.get(key)
      if (!entry) {
        // Teto de memória contra quem troca de endereço a cada tentativa. Mantém a
        // metade mais nova de uma vez: apagar item a item do começo do Map deixa
        // buracos que a iteração percorre, e o custo cresce a cada tentativa.
        if (windows.size >= maxEntries) {
          const newest = [...windows].slice(Math.floor(maxEntries / 2))
          windows.clear()
          for (const [k, v] of newest) windows.set(k, v)
        }
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

/** Um cliente IPv6 costuma controlar um /64 inteiro: conta o prefixo, não o endereço. */
function ipv6Prefix64(ip: string): string {
  const [head, tail = ''] = ip.split('::')
  const left = head ? head.split(':') : []
  const right = tail ? tail.split(':') : []
  const groups = ip.includes('::')
    ? [...left, ...Array(8 - left.length - right.length).fill('0'), ...right]
    : left
  const prefix = groups.slice(0, 4).map((group) => (group.replace(/^0+/, '') || '0').toLowerCase())
  return `${prefix.join(':')}::/64`
}

/** O Caddy grava o IP real no fim do X-Forwarded-For e descarta o que o cliente mandou. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  const ip = forwarded?.split(',').at(-1)?.trim() || headers.get('x-real-ip') || ''
  if (!ip) return 'desconhecido'
  if (ip.includes('.')) return ip.split(':').at(-1)! // IPv4, inclusive ::ffff:1.2.3.4
  return ip.includes(':') ? ipv6Prefix64(ip) : ip
}
