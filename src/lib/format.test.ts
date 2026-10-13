import { describe, expect, it } from 'vitest'

import { formatDate, formatDateLong, sortByDateDesc } from './format'

describe('sortByDateDesc', () => {
  it('põe mais recentes primeiro e itens sem data no fim', () => {
    const items = [
      { id: 'sem-data-antiga', data: null, createdAt: '2025-01-01T00:00:00.000Z' },
      { id: 'antiga', data: '2026-04-09T12:00:00.000Z' },
      { id: 'sem-data-nova', data: null, createdAt: '2025-06-01T00:00:00.000Z' },
      { id: 'recente', data: '2026-09-25T12:00:00.000Z' },
      { id: 'invalida', data: 'x', createdAt: '2024-01-01T00:00:00.000Z' },
    ]
    expect(sortByDateDesc(items).map((i) => i.id)).toEqual([
      'recente',
      'antiga',
      'sem-data-nova',
      'sem-data-antiga',
      'invalida',
    ])
  })
})

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
