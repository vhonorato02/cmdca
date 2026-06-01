import { describe, expect, it } from 'vitest'

import { formatDate, formatDateLong } from './format'

describe('formatDate', () => {
  it('formata ISO em dd/MM/yyyy (UTC)', () => {
    expect(formatDate('2025-09-22T12:00:00.000Z')).toBe('22/09/2025')
  })

  it('não desloca o dia em meia-noite UTC', () => {
    expect(formatDate('2026-01-01T00:00:00.000Z')).toBe('01/01/2026')
  })

  it('retorna vazio para nulo/indefinido', () => {
    expect(formatDate(null)).toBe('')
    expect(formatDate(undefined)).toBe('')
  })

  it('retorna vazio para data inválida', () => {
    expect(formatDate('not-a-date')).toBe('')
  })
})

describe('formatDateLong', () => {
  it('formata por extenso em PT-BR', () => {
    expect(formatDateLong('2025-09-22T12:00:00.000Z')).toBe('22 de setembro de 2025')
  })

  it('usa UTC, sem deslocar o mês', () => {
    expect(formatDateLong('2026-03-01T00:00:00.000Z')).toBe('1 de março de 2026')
  })

  it('retorna vazio para entrada inválida', () => {
    expect(formatDateLong('')).toBe('')
  })
})
