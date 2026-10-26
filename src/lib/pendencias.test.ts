import { describe, expect, it } from 'vitest'

import { findMarkers } from './pendencias'

describe('findMarkers', () => {
  it('encontra XXXX e o marcador antigo em qualquer nível', () => {
    expect(
      findMarkers({
        contato: { endereco: 'XXXX', email: 'cmdca@pindamonhangaba.sp.gov.br' },
        fmdca: { cnpj: '[A CONFIRMAR]' },
        canais: [{ numero: '190' }, { numero: 'XXXX' }],
      }),
    ).toEqual(['contato.endereco', 'fmdca.cnpj', 'canais.2.numero'])
  })

  it('ignora metadados internos e campos de controle editorial', () => {
    expect(findMarkers({ _status: 'XXXX', id: 'XXXX', controleEditorial: { fonte: 'XXXX' } })).toEqual([])
  })

  it('não confunde palavras com o marcador', () => {
    expect(findMarkers({ texto: 'XXXXL e Maxxxim' })).toEqual([])
  })
})
