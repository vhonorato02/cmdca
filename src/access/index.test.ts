import { describe, expect, it } from 'vitest'

import {
  canDeleteContent,
  canManageContent,
  publishedOrLoggedIn,
  publishedPublicMeetingOrLoggedIn,
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
})
