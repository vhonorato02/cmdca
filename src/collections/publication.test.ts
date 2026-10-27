import { describe, expect, it } from 'vitest'
import { Depoimentos } from './Depoimentos'
import { Editais } from './Editais'
import { Entidades } from './Entidades'
import { Media } from './Media'
import { Noticias } from './Noticias'
import { Resolucoes } from './Resolucoes'
import { Reunioes } from './Reunioes'
import { editorialControlField } from '../fields/editorial'

const news = {
  _status: 'published',
  title: 'Título confirmado',
  slug: 'confirmed',
  resumo: 'Resumo confirmado',
  corpo: { root: { children: [{ children: [{ text: 'Corpo confirmado' }] }] } },
  data: '2026-01-01',
  controleEditorial: { fonte: 'Documento oficial', verificadoEm: '2026-01-01' },
}

describe('proteção de publicação e consentimento', () => {
  it('mantém os campos obrigatórios de origem no formulário principal', () => {
    expect(editorialControlField().admin?.position).not.toBe('sidebar')
  })
  it.each(['title', 'resumo', 'corpo', 'controleEditorial'])(
    'rejeita pendências na notícia: %s',
    async (field) => {
      const data = {
        ...news,
        [field]:
          field === 'corpo'
            ? { root: { children: [{ children: [{ text: 'PENDENCIA: confirmar' }] }] } }
            : field === 'controleEditorial'
              ? { fonte: 'PENDENCIA: confirmar', verificadoEm: '2026-01-01' }
              : '[A CONFIRMAR]',
      }
      await expect(
        Noticias.hooks!.beforeChange![0]({ data, req: { query: {} } } as never),
      ).rejects.toThrow(/Antes de publicar/)
    },
  )

  it.each([Resolucoes, Editais, Entidades])(
    '$slug diz no formulário que a revisão jurídica é obrigatória',
    (collection) => {
      const group = collection.fields.find(
        (f) => 'name' in f && f.name === 'controleEditorial',
      ) as never as {
        fields: { name: string; label: string }[]
      }
      expect(group.fields.find((f) => f.name === 'statusRevisao')?.label).toMatch(/obrigatória/)
    },
  )

  it('mídia não usa salvamento automático (criaria registros vazios antes do upload)', () => {
    expect(Media.versions).toMatchObject({ drafts: { validate: false } })
    expect((Media.versions as { drafts: object }).drafts).not.toHaveProperty('autosave')
  })

  it('não publica mídia sem arquivo enviado', async () => {
    const pdf = {
      _status: 'published',
      mimeType: 'application/pdf',
      controleEditorial: { fonte: 'Diário Oficial', verificadoEm: '2026-01-01' },
    }
    const publish = (data: object) =>
      Media.hooks!.beforeChange![0]({ data, req: { query: {} } } as never)
    // O salvamento automático cria o registro antes do upload terminar.
    await expect(publish({ ...pdf, filename: null, mimeType: null })).rejects.toThrow(/arquivo/)
    await expect(publish({ ...pdf, filename: 'ato.pdf' })).resolves.toBeTruthy()
  })

  it.each(['draft', 'published'])(
    'bloqueia ata pública em reunião reservada, inclusive %s',
    (status) => {
      expect(() =>
        Reunioes.hooks!.beforeChange![0]({
          data: { acesso: 'reservada', ata: 9, _status: status },
        } as never),
      ).toThrow(/biblioteca pública/)
    },
  )

  it('bloqueia tornar reservada uma reunião com ata existente e permite remover a ata', () => {
    const hook = Reunioes.hooks!.beforeChange![0]
    expect(() =>
      hook({ data: { acesso: 'reservada' }, originalDoc: { acesso: 'publica', ata: 9 } } as never),
    ).toThrow(/biblioteca pública/)
    expect(() =>
      hook({
        data: { acesso: 'reservada', ata: null },
        originalDoc: { acesso: 'publica', ata: 9 },
      } as never),
    ).not.toThrow()
  })

  it.each(['autor', 'frase', 'origem'])(
    'invalida consentimento reaproveitado quando %s muda',
    (field) => {
      const data = { [field]: 'Alterado', autorizacaoPublicacao: true }
      Depoimentos.hooks!.beforeChange![0]({
        data,
        originalDoc: {
          autor: 'Autor',
          frase: 'Frase',
          origem: 'Termo antigo',
          autorizacaoPublicacao: true,
        },
        req: { user: { role: 'editor' } },
      } as never)
      expect(data.autorizacaoPublicacao).toBe(false)
    },
  )

  it('exige uma nova referência para reautorizar e preserva edição sem mudança de conteúdo', () => {
    const hook = Depoimentos.hooks!.beforeChange![0]
    const originalDoc = {
      autor: 'Autor',
      frase: 'Frase',
      origem: 'Termo antigo',
      autorizacaoPublicacao: true,
    }
    const data = { frase: 'Nova frase', origem: 'Novo termo', autorizacaoPublicacao: true }
    hook({ data, originalDoc, req: { user: { role: 'juridico' } } } as never)
    expect(data.autorizacaoPublicacao).toBe(true)
    const unchanged = { papel: 'Cargo atualizado' }
    expect(hook({ data: unchanged, originalDoc, req: { user: { role: 'editor' } } } as never)).toBe(
      unchanged,
    )
  })

  it('edição publicada sem reautorização é rejeitada pela validação seguinte', async () => {
    const data = { frase: 'Nova frase', _status: 'published' }
    const originalDoc = {
      autor: 'Autor',
      frase: 'Frase',
      origem: 'Termo',
      autorizacaoPublicacao: true,
      controleEditorial: { fonte: 'Fonte oficial', verificadoEm: '2026-01-01' },
    }
    const args = { data, originalDoc, req: { user: { role: 'editor' }, query: {} } } as never
    Depoimentos.hooks!.beforeChange![0](args)
    await expect(Depoimentos.hooks!.beforeChange![1](args)).rejects.toThrow(/autorização/)
  })
})
