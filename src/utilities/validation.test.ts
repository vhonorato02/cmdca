import { describe, expect, it } from 'vitest'

import {
  isNonEmptyRichText,
  isSafeURL,
  validateCoordinatePair,
  validateDateNotBefore,
  validateTime,
} from './validation'

describe('validações editoriais', () => {
  it('aceita somente links públicos seguros', () => {
    expect(isSafeURL('/transparencia', true)).toBe(true)
    expect(isSafeURL('https://pindamonhangaba.sp.gov.br')).toBe(true)
    expect(isSafeURL('javascript:alert(1)', true)).toBe(false)
    expect(isSafeURL('//servidor-malicioso.test', true)).toBe(false)
  })

  it('valida horário no formato de 24 horas', () => {
    expect(validateTime('09:05')).toBe(true)
    expect(validateTime('25:10')).not.toBe(true)
  })

  it('exige o par completo de coordenadas', () => {
    expect(validateCoordinatePair({ lat: -22.9, lng: -45.4 })).toBe(true)
    expect(validateCoordinatePair({ lat: -22.9 })).not.toBe(true)
  })

  it('reconhece rich text vazio e preenchido', () => {
    expect(isNonEmptyRichText({ root: { children: [] } })).toBe(false)
    expect(
      isNonEmptyRichText({ root: { children: [{ children: [{ text: 'Conteúdo confirmado' }] }] } }),
    ).toBe(true)
  })

  it('impede prazo anterior à publicação', () => {
    expect(validateDateNotBefore('2026-01-02', { data: '2026-01-01' }, 'data', 'publicação')).toBe(
      true,
    )
    expect(validateDateNotBefore('2025-12-31', { data: '2026-01-01' }, 'data', 'publicação')).not.toBe(
      true,
    )
  })
})
