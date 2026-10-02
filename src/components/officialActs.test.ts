import { describe, expect, it } from 'vitest'

import {
  amendedBy,
  EDITAL_SITUACAO,
  ENTIDADE_SITUACAO,
  isPastDate,
  publicDocuments,
  relatedActs,
  RESOLUCAO_SITUACAO,
  statusInfo,
} from './officialActs'

describe('situação de atos e registros', () => {
  it('traduz as situações do CMS e sinaliza valor desconhecido', () => {
    expect(statusInfo(RESOLUCAO_SITUACAO, 'revogada')).toEqual({ label: 'Revogada', tone: 'alert' })
    expect(statusInfo(RESOLUCAO_SITUACAO, 'sem_efeito').label).toBe('Sem efeito')
    expect(statusInfo(EDITAL_SITUACAO, 'suspenso').tone).toBe('alert')
    expect(statusInfo(EDITAL_SITUACAO, 'anulado').label).toBe('Anulado')
    expect(statusInfo(ENTIDADE_SITUACAO, 'cancelado').label).toBe('Registro cancelado')
    expect(statusInfo(ENTIDADE_SITUACAO, 'inexistente').label).toBe('Situação não informada')
    expect(statusInfo(ENTIDADE_SITUACAO, null).tone).toBe('warn')
  })
})

describe('relações de retificação', () => {
  const original = { id: 1, numero: '01/2026', titulo: 'Original', _status: 'published' }
  const rascunho = { id: 2, numero: '02/2026', titulo: 'Rascunho', _status: 'draft' }
  const pendente = { id: 3, numero: '[A CONFIRMAR]', titulo: 'Pendente', _status: 'published' }
  const retificacao = {
    id: 4,
    numero: '04/2026',
    titulo: 'Retificação',
    _status: 'published',
    retifica: [original, rascunho, pendente, 99],
  }

  it('expõe somente atos relacionados publicados e verificados', () => {
    expect(relatedActs(retificacao, new Set([1, 4]))).toEqual([
      { id: 1, numero: '01/2026', titulo: 'Original', listed: true },
    ])
    expect(relatedActs(retificacao, new Set([4]))[0]?.listed).toBe(false)
  })

  it('encontra quem retifica o original, inclusive por id não populado', () => {
    const porId = { id: 5, numero: '05/2026', titulo: 'Por id', _status: 'published', retifica: [1] }
    const refs = amendedBy(original, [original, retificacao, porId, { ...rascunho, retifica: [1] }])
    expect(refs.map((ref) => ref.numero)).toEqual(['04/2026', '05/2026'])
  })
})

describe('documentos e datas', () => {
  it('ignora rascunhos, ids soltos e URLs inseguras', () => {
    const docs = publicDocuments([
      7,
      { id: 1, url: '/api/media/file/certificado.pdf', alt: 'Certificado de registro' },
      { id: 2, url: 'javascript:alert(1)' },
      { id: 3, url: '/api/media/file/rascunho.pdf', _status: 'draft' },
      { id: 4, url: '/api/media/file/sem-alt.pdf' },
    ])
    expect(docs).toEqual([
      { key: '1', href: '/api/media/file/certificado.pdf', label: 'Certificado de registro' },
      { key: '4', href: '/api/media/file/sem-alt.pdf', label: 'Documento público 5' },
    ])
  })

  it('compara a validade pelo dia, sem deslocamento de fuso', () => {
    const today = new Date('2026-10-01T12:00:00Z')
    expect(isPastDate('2026-09-30T23:00:00.000Z', today)).toBe(true)
    expect(isPastDate('2026-10-01T00:00:00.000Z', today)).toBe(false)
    expect(isPastDate('data inválida', today)).toBe(false)
    expect(isPastDate(null, today)).toBe(false)
  })
})
