import { describe, expect, it } from 'vitest'

import { passwordChangePolicy } from '../collections/Users'
import { collectionPasswordGate, globalPasswordGate } from './passwordGate'

const pending = { id: 7, role: 'editor', trocarSenha: true }
const ok = { id: 7, role: 'editor', trocarSenha: false }

describe('troca de senha obrigatória', () => {
  it('conta nova nasce exigindo a troca; senha curta é recusada', () => {
    const created = passwordChangePolicy({
      data: { password: 'Senha@12345' },
      operation: 'create',
      req: { user: { id: 1 } },
    } as never)
    expect(created).toMatchObject({ trocarSenha: true })
    expect(() =>
      passwordChangePolicy({
        data: { password: 'curta' },
        operation: 'create',
        req: { user: { id: 1 } },
      } as never),
    ).toThrow(/10 caracteres/)
  })

  it('a própria pessoa trocando a senha libera; administrador redefinindo volta a exigir', () => {
    const own = passwordChangePolicy({
      data: { password: 'MinhaSenha#2026' },
      operation: 'update',
      originalDoc: { id: 7 },
      req: { user: pending },
    } as never)
    expect(own).toMatchObject({ trocarSenha: false })
    const reset = passwordChangePolicy({
      data: { password: 'Provisoria#2026' },
      operation: 'update',
      originalDoc: { id: 7 },
      req: { user: { id: 1, role: 'admin' } },
    } as never)
    expect(reset).toMatchObject({ trocarSenha: true })
  })

  it('com a troca pendente, só passa a troca da própria senha', () => {
    const gate = collectionPasswordGate('users')
    const args = { data: { password: 'MinhaSenha#2026' }, id: 7 }
    expect(gate({ args, operation: 'update', req: { user: pending } } as never)).toBe(args)
    expect(() =>
      gate({
        args: { data: { trocarSenha: false }, id: 7 },
        operation: 'update',
        req: { user: pending },
      } as never),
    ).toThrow(/nova senha/)
    expect(() =>
      gate({
        args: { data: { password: 'x'.repeat(12) }, id: 8 },
        operation: 'update',
        req: { user: pending },
      } as never),
    ).toThrow()
    expect(() =>
      collectionPasswordGate('noticias')({
        args: { data: {} },
        operation: 'create',
        req: { user: pending },
      } as never),
    ).toThrow()
    expect(() => globalPasswordGate({ data: {}, req: { user: pending } } as never)).toThrow()
  })

  it('leitura e contas em dia não são afetadas', () => {
    const gate = collectionPasswordGate('noticias')
    const args = { data: { titulo: 'x' } }
    expect(gate({ args, operation: 'read', req: { user: pending } } as never)).toBe(args)
    expect(gate({ args, operation: 'create', req: { user: ok } } as never)).toBe(args)
    expect(globalPasswordGate({ data: args.data, req: { user: ok } } as never)).toBe(args.data)
  })
})
