import { describe, expect, it } from 'vitest'

import { enforceEditorDraftOnly, isPublishingRequest, valueAtPath } from './editorialPolicy'

const req = (role?: 'admin' | 'editor' | 'juridico') =>
  ({ user: role ? { role } : null, query: {} }) as never

describe('política editorial', () => {
  it('editor só pode usar create/update em modo draft', () => {
    expect(() =>
      enforceEditorDraftOnly({
        args: { draft: true, data: { _status: 'draft' } },
        operation: 'create',
        req: req('editor'),
      } as never),
    ).not.toThrow()
    expect(() =>
      enforceEditorDraftOnly({
        args: { draft: false, data: { _status: 'published' } },
        operation: 'update',
        req: req('editor'),
      } as never),
    ).toThrow(/somente rascunhos/i)
  })

  it('jurídico pode publicar', () => {
    expect(() =>
      enforceEditorDraftOnly({
        args: { draft: false, data: { _status: 'published' } },
        operation: 'update',
        req: req('juridico'),
      } as never),
    ).not.toThrow()
  })

  it('detecta publicação e lê caminhos aninhados', () => {
    expect(isPublishingRequest({ _status: 'published' }, undefined, req('juridico'))).toBe(true)
    expect(isPublishingRequest({ _status: 'draft' }, undefined, req('editor'))).toBe(false)
    expect(valueAtPath({ controle: { fonte: 'Diário Oficial' } }, 'controle.fonte')).toBe(
      'Diário Oficial',
    )
  })
})
