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

  it('não publica conteúdo sem decisão jurídica explícita', async () => {
    const hook = validatePublication([{ path: 'titulo', label: 'título' }])
    await expect(
      hook({
        data: { _status: 'published', titulo: 'Ata', controleEditorial: { statusRevisao: 'pendente' } },
        originalDoc: undefined,
        req: req('juridico'),
      } as never),
    ).rejects.toThrow(/revisão jurídica/i)
  })

  it('aceita publicação aprovada e registra o responsável autenticado', async () => {
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
    expect(data.controleEditorial).toMatchObject({ revisadoPor: 7 })
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
