import { describe, expect, it } from 'vitest'

import {
  enforceEditorDraftOnly,
  isPublishingRequest,
  uploadHasMime,
  validatePublication,
  valueAtPath,
} from './editorialPolicy'

const req = (role?: 'admin' | 'editor' | 'juridico') =>
  ({ user: role ? { role } : null, query: {} }) as never

describe('política editorial', () => {
  it('editor pode publicar sem uma etapa obrigatória de revisão', () => {
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
    ).not.toThrow()
    expect(() =>
      enforceEditorDraftOnly({
        args: { draft: true, data: { _status: 'published' } },
        operation: 'update',
        req: req('editor'),
      } as never),
    ).not.toThrow()
    expect(() =>
      enforceEditorDraftOnly({
        args: {},
        operation: 'restoreVersion',
        req: req('editor'),
      } as never),
    ).not.toThrow()
  })

  it('jurídico também pode publicar', () => {
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

  it('publica conteúdo sem decisão de revisão', async () => {
    const hook = validatePublication([{ path: 'titulo', label: 'título' }])
    await expect(
      hook({
        data: { _status: 'published', titulo: 'Ata', controleEditorial: { statusRevisao: 'pendente' } },
        originalDoc: undefined,
        req: req('juridico'),
      } as never),
    ).resolves.toEqual({
      _status: 'published',
      titulo: 'Ata',
      controleEditorial: { statusRevisao: 'pendente' },
    })
  })

  it('aceita publicação com status opcional sem alterar os dados', async () => {
    const hook = validatePublication([{ path: 'titulo', label: 'título' }])
    const data = {
      _status: 'published',
      titulo: 'Ata',
      controleEditorial: { statusRevisao: 'aprovada' },
    }
    await expect(
      hook({
        data,
        originalDoc: undefined,
        req: { user: { id: 7, role: 'juridico' }, query: {} },
      } as never),
    ).resolves.toBe(data)
    expect(data.controleEditorial).toMatchObject({ statusRevisao: 'aprovada' })
  })

  it('não permite relacionar mídia em rascunho a conteúdo público', async () => {
    const draftRequest = {
      payload: { findByID: async () => ({ _status: 'draft', mimeType: 'image/jpeg' }) },
    } as never
    const publishedRequest = {
      payload: { findByID: async () => ({ _status: 'published', mimeType: 'image/jpeg' }) },
    } as never

    await expect(uploadHasMime(12, draftRequest, ['image/jpeg'])).resolves.toBe(false)
    await expect(uploadHasMime(12, publishedRequest, ['image/jpeg'])).resolves.toBe(true)
  })
})
