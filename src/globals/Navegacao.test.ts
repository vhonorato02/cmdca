import type { Field } from 'payload'
import { afterEach, describe, expect, it, vi } from 'vitest'

const { revalidatePath } = vi.hoisted(() => ({ revalidatePath: vi.fn() }))
vi.mock('next/cache', () => ({ revalidatePath }))

import { Navegacao, revalidateNavigation } from './Navegacao'

const fields = Navegacao.fields as Field[]
const menuPrincipal = fields.find(
  (field) => 'name' in field && field.name === 'menuPrincipal',
) as Extract<Field, { type: 'array' }>
const rodape = fields.find(
  (field) => 'name' in field && field.name === 'rodapeInstitucional',
) as Extract<Field, { type: 'array' }>
afterEach(() => vi.clearAllMocks())

describe('global de navegação', () => {
  it('declara drafts e acessos editoriais esperados', () => {
    expect(Navegacao.slug).toBe('navegacao')
    expect(Navegacao.versions).toEqual(expect.objectContaining({ drafts: expect.any(Object) }))
    expect(typeof Navegacao.access?.read).toBe('function')
    expect(typeof Navegacao.access?.update).toBe('function')
    expect(typeof Navegacao.access?.readVersions).toBe('function')
  })

  it('mantém limites e links padrão atuais', () => {
    expect([menuPrincipal.minRows, menuPrincipal.maxRows]).toEqual([1, 6])
    expect(menuPrincipal.defaultValue).toEqual([
      { label: 'Início', href: '/' },
      { label: 'CMDCA', href: '/conselho' },
      { label: 'Reuniões', href: '/reunioes' },
      { label: 'Transparência', href: '/transparencia' },
      { label: 'Notícias', href: '/noticias' },
      { label: 'Participe', href: '/participe' },
    ])
    expect([rodape.minRows, rodape.maxRows]).toEqual([1, 8])
    expect(rodape.defaultValue).toEqual([
      { label: 'Sobre o CMDCA', href: '/conselho' },
      { label: 'Reuniões', href: '/reunioes' },
      { label: 'Transparência', href: '/transparencia' },
      { label: 'Fundo Municipal', href: '/fmdca' },
      { label: 'Conferências', href: '/conferencias' },
      { label: 'Notícias', href: '/noticias' },
    ])
  })

  it('revalida o layout público ao publicar ou despublicar, não ao salvar rascunho', async () => {
    const req = { query: {}, payload: { logger: { warn: vi.fn() } } }
    await revalidateNavigation({ doc: { _status: 'published' }, req } as never)
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
    revalidatePath.mockClear()
    await revalidateNavigation({
      doc: { _status: 'draft' },
      previousDoc: { _status: 'published' },
      req: { ...req, query: { draft: 'true' } },
    } as never)
    expect(revalidatePath).not.toHaveBeenCalled()
    await revalidateNavigation({
      doc: { _status: 'draft' },
      previousDoc: { _status: 'published' },
      req,
    } as never)
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
  })
})
