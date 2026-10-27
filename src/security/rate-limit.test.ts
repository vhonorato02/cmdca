import { describe, expect, it } from 'vitest'

import { clientIp, createRateLimiter } from './rate-limit'

describe('limite de tentativas por IP', () => {
  it('libera até o máximo e bloqueia a seguinte, informando a espera', () => {
    const limiter = createRateLimiter({ max: 3, windowMs: 60_000 })
    expect([1, 2, 3].map(() => limiter.hit('1.1.1.1', 0).allowed)).toEqual([true, true, true])
    expect(limiter.hit('1.1.1.1', 1_000)).toEqual({ allowed: false, retryAfterSeconds: 59 })
  })

  it('conta cada IP separadamente', () => {
    const limiter = createRateLimiter({ max: 1, windowMs: 60_000 })
    expect(limiter.hit('1.1.1.1', 0).allowed).toBe(true)
    expect(limiter.hit('2.2.2.2', 0).allowed).toBe(true)
    expect(limiter.hit('1.1.1.1', 0).allowed).toBe(false)
  })

  it('volta a liberar quando a janela termina', () => {
    const limiter = createRateLimiter({ max: 1, windowMs: 60_000 })
    limiter.hit('1.1.1.1', 0)
    expect(limiter.hit('1.1.1.1', 60_000).allowed).toBe(true)
  })

  it('não cresce sem limite: descarta janelas vencidas', () => {
    const limiter = createRateLimiter({ max: 1, windowMs: 1_000 })
    for (let i = 0; i < 100; i++) limiter.hit(`10.0.0.${i}`, 0)
    limiter.hit('9.9.9.9', 5_000)
    expect(limiter.size()).toBe(1)
  })
})

describe('memória limitada', () => {
  it('descarta as entradas mais antigas quando passa do teto', () => {
    const limiter = createRateLimiter({ max: 1, windowMs: 60_000, maxEntries: 3 })
    for (const ip of ['1', '2', '3', '4']) limiter.hit(ip, 0)
    expect(limiter.size()).toBeLessThanOrEqual(3)
    // O mais antigo saiu e volta a ter uma tentativa livre.
    expect(limiter.hit('1', 0).allowed).toBe(true)
  })

  it('continua rápido com muitos endereços diferentes', () => {
    const limiter = createRateLimiter({ max: 20, windowMs: 600_000, maxEntries: 10_000 })
    const start = performance.now()
    for (let i = 0; i < 100_000; i++) limiter.hit(`ip${i}`, i)
    expect(limiter.size()).toBeLessThanOrEqual(10_000)
    expect(performance.now() - start).toBeLessThan(2_000)
  })
})

describe('IP do cliente', () => {
  it('agrupa IPv6 pelo prefixo /64, que um único cliente controla inteiro', () => {
    const a = clientIp(new Headers({ 'x-forwarded-for': '2804:14c:5b:8000:1:2:3:4' }))
    const b = clientIp(new Headers({ 'x-forwarded-for': '2804:14c:5b:8000:ffff::9' }))
    expect(a).toBe(b)
    expect(a).toBe('2804:14c:5b:8000::/64')
  })

  it('usa o último endereço do X-Forwarded-For, que é o que o Caddy grava', () => {
    expect(clientIp(new Headers({ 'x-forwarded-for': '6.6.6.6, 201.42.174.102' }))).toBe(
      '201.42.174.102',
    )
  })

  it('cai para um balde comum quando não há cabeçalho', () => {
    expect(clientIp(new Headers())).toBe('desconhecido')
  })
})
