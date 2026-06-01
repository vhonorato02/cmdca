import { describe, expect, it } from 'vitest'

import { formatSlug } from './formatSlug'

describe('formatSlug', () => {
  it('remove acentos do PT-BR', () => {
    expect(formatSlug('Reunião Ordinária')).toBe('reuniao-ordinaria')
  })

  it('troca espaços e símbolos por hífen', () => {
    expect(formatSlug('Resolução nº 12/2026')).toBe('resolucao-n-12-2026')
  })

  it('remove hífens nas pontas', () => {
    expect(formatSlug('  — Edital —  ')).toBe('edital')
  })

  it('colapsa múltiplos separadores', () => {
    expect(formatSlug('A   B___C')).toBe('a-b-c')
  })

  it('é idempotente para um slug já válido', () => {
    expect(formatSlug('ja-e-slug')).toBe('ja-e-slug')
  })
})
