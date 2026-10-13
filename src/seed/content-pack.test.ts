import { describe, expect, it } from 'vitest'

import { containsPlaceholder } from '../utilities/validation'
import { containsUnverifiedMarker } from '../lib/site'
import { formatSlug } from '../utilities/formatSlug'
import { FAQ, HIGHLIGHTS, NEWS, RETIRED_HIGHLIGHT_TITLES } from './content-pack-2026-10'

describe('pacote editorial de outubro de 2026', () => {
  it('mantém slugs válidos, únicos e iguais ao formato do CMS', () => {
    const slugs = NEWS.map((item) => item.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      expect(slug.length).toBeLessThanOrEqual(140)
      expect(formatSlug(slug)).toBe(slug)
    }
  })

  it('respeita os limites de validação das coleções', () => {
    for (const item of NEWS) {
      expect(item.title.length).toBeLessThanOrEqual(180)
      expect(item.resumo.length).toBeGreaterThanOrEqual(40)
      expect(item.resumo.length).toBeLessThanOrEqual(320)
      expect(item.paragraphs.length).toBeGreaterThan(0)
      expect(Number.isNaN(Date.parse(item.data))).toBe(false)
    }
    for (const item of FAQ) {
      expect(item.pergunta.length).toBeLessThanOrEqual(240)
      expect(item.resposta.length).toBeGreaterThanOrEqual(20)
      expect(item.resposta.length).toBeLessThanOrEqual(1500)
    }
    for (const item of HIGHLIGHTS) {
      expect(item.titulo.length).toBeLessThanOrEqual(180)
      expect(item.texto.length).toBeLessThanOrEqual(420)
      expect(item.cta.href.startsWith('/')).toBe(true)
    }
  })

  it('registra fonte oficial ou jornalística em HTTPS para cada item', () => {
    for (const item of [...NEWS, ...FAQ]) {
      expect(item.fonte.trim().length).toBeGreaterThan(10)
      expect(new URL(item.fonteURL).protocol).toBe('https:')
    }
  })

  it('não contém marcadores que o portal esconderia ou a publicação rejeitaria', () => {
    const texts = [
      ...NEWS.flatMap((item) => [item.title, item.resumo, ...item.paragraphs]),
      ...FAQ.flatMap((item) => [item.pergunta, item.resposta]),
      ...HIGHLIGHTS.flatMap((item) => [item.kicker, item.titulo, item.texto, item.cta.label]),
    ]
    for (const text of texts) {
      expect(containsPlaceholder(text), text).toBe(false)
      expect(containsUnverifiedMarker(text), text).toBe(false)
      expect(/transmiss[aã]o online/i.test(text), text).toBe(false)
    }
  })

  it('liga destaques a notícias do pacote ou a páginas existentes', () => {
    const slugs = new Set(NEWS.map((item) => item.slug))
    for (const item of HIGHLIGHTS) {
      const match = item.cta.href.match(/^\/noticias\/(.+)$/)
      if (match) expect(slugs.has(match[1])).toBe(true)
    }
    expect(RETIRED_HIGHLIGHT_TITLES.length).toBeGreaterThan(0)
  })
})
