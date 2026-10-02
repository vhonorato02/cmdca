import { describe, expect, it } from 'vitest'
import { Indicadores } from './Indicadores'

const valid = { _status: 'published', publicar: true, alcancados: 1, projetos: 2, entidades: 3, reunioesNoAno: 4 }
const validate = (data: unknown) => Indicadores.hooks!.beforeChange![0]({ data, req: { query: {} } } as never)

describe('integridade dos indicadores publicados', () => {
  it.each([NaN, Infinity, -1])('rejeita contador inválido %s', (value) => {
    expect(() => validate({ ...valid, alcancados: value })).toThrow(/indicadores/)
  })
  it.each([NaN, Infinity, -1, 101, '100'])('rejeita percentual inválido %s', (value) => {
    expect(() => validate({ ...valid, aplicacaoPorArea: [{ area: 'Área', percentual: value }] })).toThrow(/percentual/)
  })
  it('rejeita série sem valor e aceita percentuais completos', () => {
    expect(() => validate({ ...valid, serieAnual: [{ ano: '2026' }] })).toThrow(/série anual/)
    expect(() => validate({ ...valid, aplicacaoPorArea: [{ area: 'Área', percentual: 100 }], serieAnual: [{ ano: '2026', valor: 0 }] })).not.toThrow()
  })
})
