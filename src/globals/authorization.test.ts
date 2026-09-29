import type { Field } from 'payload'
import { describe, expect, it } from 'vitest'

import { Depoimentos } from '../collections/Depoimentos'
import { Destaques } from '../collections/Destaques'
import { Editais } from '../collections/Editais'
import { Entidades } from '../collections/Entidades'
import { Faq } from '../collections/Faq'
import { Media } from '../collections/Media'
import { Noticias } from '../collections/Noticias'
import { RedeProtecao } from '../collections/RedeProtecao'
import { Resolucoes } from '../collections/Resolucoes'
import { Reunioes } from '../collections/Reunioes'
import { Configuracoes } from './Configuracoes'
import { Indicadores } from './Indicadores'
import { PaginaInicial } from './PaginaInicial'

const versionedConfigs = [
  Configuracoes,
  Indicadores,
  PaginaInicial,
  Depoimentos,
  Destaques,
  Editais,
  Entidades,
  Faq,
  Media,
  Noticias,
  RedeProtecao,
  Resolucoes,
  Reunioes,
]

const findField = (fields: Field[], name: string): Field | undefined => {
  for (const field of fields) {
    if ('name' in field && field.name === name) return field
    if ('fields' in field) {
      const nested = findField(field.fields, name)
      if (nested) return nested
    }
  }
  return undefined
}

const fieldReadAccess = (fields: Field[], name: string) => {
  const field = findField(fields, name)
  if (!field || !('access' in field) || typeof field.access?.read !== 'function') {
    throw new Error(`Campo ${name} sem controle de leitura`)
  }
  return field.access.read
}

describe('autorização de versões e campos condicionais', () => {
  it('permite ler versões somente para papéis conhecidos', async () => {
    for (const config of versionedConfigs) {
      const readVersions = config.access?.readVersions
      expect(typeof readVersions, `${config.slug} deve declarar readVersions`).toBe('function')

      expect(await readVersions!({ req: { user: null } } as never)).toBe(false)
      expect(
        await readVersions!({ req: { user: { id: 1, role: 'intruso' } } } as never),
      ).toBe(false)

      for (const role of ['admin', 'editor', 'juridico']) {
        expect(await readVersions!({ req: { user: { id: 1, role } } } as never)).toBe(true)
      }
    }
  })

  it('não trata objeto de usuário com papel desconhecido como login nos dados bancários', async () => {
    const readCnpj = fieldReadAccess(Configuracoes.fields, 'cnpj')
    const invalidUser = { req: { user: { id: 1, role: 'intruso' } }, doc: {} } as never

    expect(await readCnpj(invalidUser)).toBe(false)
    expect(await readCnpj({ req: { user: { id: 1, role: 'editor' } }, doc: {} } as never)).toBe(
      true,
    )
    expect(
      await readCnpj({
        req: { user: null },
        doc: { fmdca: { dadosBancariosConfirmados: true } },
      } as never),
    ).toBe(true)
  })

  it('não trata objeto de usuário com papel desconhecido como login nos indicadores', async () => {
    const readIndicators = fieldReadAccess(Indicadores.fields, 'alcancados')
    const invalidUser = { req: { user: { id: 1, role: 'intruso' } }, doc: {} } as never

    expect(await readIndicators(invalidUser)).toBe(false)
    expect(
      await readIndicators({ req: { user: { id: 1, role: 'editor' } }, doc: {} } as never),
    ).toBe(true)
    expect(await readIndicators({ req: { user: null }, doc: { publicar: true } } as never)).toBe(
      true,
    )
  })
})
