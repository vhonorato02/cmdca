import { describe, expect, it } from 'vitest'

import { buildAllowedOrigins } from './origins'

describe('origens do CMS', () => {
  it('não autoriza localhost em produção', () => {
    expect(
      buildAllowedOrigins({
        nodeEnv: 'production',
        serverURL: 'https://cmdca.vercel.app',
        publicServerURL: 'https://cmdca.vercel.app/',
        vercelURL: 'cmdca-abc.vercel.app',
      }),
    ).toEqual(['https://cmdca.vercel.app', 'https://cmdca-abc.vercel.app'])
  })

  it('mantém localhost disponível no desenvolvimento', () => {
    expect(
      buildAllowedOrigins({
        nodeEnv: 'development',
        serverURL: 'http://localhost:3000',
      }),
    ).toEqual(['http://localhost:3000'])
  })

  it('ignora valores inválidos e normaliza caminhos', () => {
    expect(
      buildAllowedOrigins({
        nodeEnv: 'production',
        serverURL: 'https://cmdca.vercel.app/admin',
        publicServerURL: 'invalida',
      }),
    ).toEqual(['https://cmdca.vercel.app'])
  })
})
