import { afterEach, describe, expect, it, vi } from 'vitest'
import { revalidateCollection } from './revalidate'

const { revalidatePath } = vi.hoisted(() => ({ revalidatePath: vi.fn() }))
vi.mock('next/cache', () => ({ revalidatePath }))
afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks() })

describe('cache após retirada de publicação', () => {
  it.each([{}, { unpublishAllLocales: 'true' }])('revalida retirada explícita com query %j', async (query) => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('DATABASE_MIGRATION', 'false')
    await revalidateCollection(() => ['/noticias']).afterChange[0]({
      doc: { _status: 'draft' }, previousDoc: { _status: 'published' },
      req: { query, payload: { logger: { warn: vi.fn() } } },
    } as never)
    expect(revalidatePath).toHaveBeenCalledWith('/noticias')
  })
  it('preserva publicação atual quando salva apenas rascunho', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('DATABASE_MIGRATION', 'false')
    await revalidateCollection(() => ['/noticias']).afterChange[0]({
      doc: { _status: 'draft' }, previousDoc: { _status: 'published' },
      req: { query: { draft: 'true' }, payload: { logger: { warn: vi.fn() } } },
    } as never)
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})
