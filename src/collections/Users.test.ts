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
