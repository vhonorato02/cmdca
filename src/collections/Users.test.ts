import { describe, expect, it, vi } from 'vitest'

import { Users } from './Users'

const beforeChange = Users.hooks?.beforeChange?.[0]
const beforeDelete = Users.hooks?.beforeDelete?.[0]

const request = (userID: number, adminCount = 1) =>
  ({
    user: { id: userID, role: 'admin' },
    payload: {
      count: vi.fn().mockResolvedValue({ totalDocs: adminCount }),
      findByID: vi.fn().mockResolvedValue({ id: 2, role: 'admin' }),
    },
  }) as never

describe('proteções de administradores', () => {
  it('recuperação sem e-mail configurado falha explicitamente sem simular envio', () => {
    const hook = Users.hooks?.beforeOperation?.[0]
    expect(() => hook?.({ operation: 'forgotPassword', args: {}, req: { payload: { email: { name: 'console' } } } } as never)).toThrow(/indisponível/)
    expect(() => hook?.({ operation: 'forgotPassword', args: {}, req: { payload: { email: { name: 'nodemailer' } } } } as never)).not.toThrow()
  })
  it('nega leitura e atualização da própria conta a papéis desconhecidos', () => {
    const invalid = { req: { user: { id: 7, role: 'intruso' } } } as never
    const readAccess = Users.access?.read
    const updateAccess = Users.access?.update

    expect(typeof readAccess).toBe('function')
    expect(typeof updateAccess).toBe('function')
    if (typeof readAccess !== 'function' || typeof updateAccess !== 'function') {
      throw new Error('A coleção users precisa definir acesso de leitura e atualização.')
    }
    expect(readAccess(invalid)).toBe(false)
    expect(updateAccess(invalid)).toBe(false)
  })

  it('permite desbloquear contas somente a administradores', () => {
    const unlockAccess = Users.access?.unlock

    expect(typeof unlockAccess).toBe('function')
    if (typeof unlockAccess !== 'function') {
      throw new Error('A coleção users precisa definir acesso explícito de desbloqueio.')
    }
    expect(unlockAccess({ req: { user: { id: 1, role: 'admin' } } } as never)).toBe(true)
    expect(unlockAccess({ req: { user: { id: 2, role: 'editor' } } } as never)).toBe(false)
    expect(unlockAccess({ req: { user: { id: 3, role: 'intruso' } } } as never)).toBe(false)
  })

  it('permite que o administrador atualize o próprio nome sem alterar papel', async () => {
    await expect(
      beforeChange?.({
        data: { name: 'Nome atualizado' },
        operation: 'update',
        originalDoc: { id: 1, role: 'admin' },
        req: request(1),
      } as never),
    ).resolves.toMatchObject({ name: 'Nome atualizado' })
  })

  it('bloqueia a própria perda do papel de administrador', async () => {
    await expect(
      beforeChange?.({
        data: { role: 'editor' },
        operation: 'update',
        originalDoc: { id: 1, role: 'admin' },
        req: request(1, 2),
      } as never),
    ).rejects.toThrow(/proteger seu acesso/i)
  })

  it('bloqueia autoexclusão', async () => {
    await expect(beforeDelete?.({ id: 1, req: request(1, 2) } as never)).rejects.toThrow(
      /própria conta/i,
    )
  })

  it('bloqueia exclusão do último administrador', async () => {
    await expect(beforeDelete?.({ id: 2, req: request(1, 1) } as never)).rejects.toThrow(
      /último administrador/i,
    )
  })
})
