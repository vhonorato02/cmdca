import { describe, expect, it } from 'vitest'

import {
  canDeleteContent,
  canManageContent,
  idOf,
  isAuthenticated,
  isLoggedInFieldLevel,
  publishedOrLoggedIn,
  publishedPublicMeetingOrLoggedIn,
  roleOf,
} from '.'

const request = (role?: 'admin' | 'editor' | 'juridico') =>
  ({ req: { user: role ? { id: 1, role } : null } }) as never

describe('controle de acesso do CMS', () => {
  it('limita visitantes a documentos publicados', () => {
    expect(publishedOrLoggedIn(request())).toEqual({ _status: { equals: 'published' } })
    expect(publishedOrLoggedIn(request('editor'))).toBe(true)
  })

  it('não expõe reuniões reservadas a visitantes', () => {
    expect(publishedPublicMeetingOrLoggedIn(request())).toEqual({
      _status: { equals: 'published' },
      acesso: { equals: 'publica' },
    })
    expect(publishedPublicMeetingOrLoggedIn(request('juridico'))).toBe(true)
  })

  it('permite edição aos papéis editoriais e exclusão somente ao administrador', () => {
    expect(canManageContent(request('editor'))).toBe(true)
    expect(canManageContent(request('juridico'))).toBe(true)
    expect(canManageContent(request())).toBe(false)
    expect(canDeleteContent(request('admin'))).toBe(true)
    expect(canDeleteContent(request('juridico'))).toBe(false)
  })

  it('nega acesso a papéis desconhecidos mesmo quando há objeto de usuário', () => {
    const invalid = { req: { user: { id: 1, role: 'intruso' } } } as never

    expect(roleOf({ role: 'intruso' })).toBeUndefined()
    expect(idOf({ id: { valor: 1 } })).toBeUndefined()
    expect(isAuthenticated(invalid)).toBe(false)
    expect(canManageContent(invalid)).toBe(false)
    expect(isLoggedInFieldLevel(invalid)).toBe(false)
    expect(publishedOrLoggedIn(invalid)).toEqual({ _status: { equals: 'published' } })
    expect(publishedPublicMeetingOrLoggedIn(invalid)).toEqual({
      _status: { equals: 'published' },
      acesso: { equals: 'publica' },
    })
  })
})
