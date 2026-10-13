/**
 * Aplica o pacote editorial de outubro de 2026 (notícias, FAQ e destaques).
 *
 * Idempotente: identifica itens por slug, pergunta ou título e não duplica.
 * Transação única: qualquer falha desfaz tudo. Não altera rascunhos humanos
 * pendentes, usuários, configurações nem arquivos.
 *
 * Uso:
 *   APPLY_CONTENT_PACK=true CONTENT_PACK_AUTHOR_EMAIL=... pnpm apply:content-pack
 * Banco operacional exige também CONTENT_PACK_TARGET=operational, somente
 * depois de backup verificado e migrations aplicadas.
 */
import type { Payload, PayloadRequest } from 'payload'
import {
  commitTransaction,
  createLocalReq,
  getPayload,
  initTransaction,
  killTransaction,
} from 'payload'

import type { User } from '../payload-types'
import configPromise from '../payload.config'
import {
  FAQ,
  HIGHLIGHTS,
  NEWS,
  PACK_MARKER,
  RETIRED_HIGHLIGHT_TITLES,
  VERIFIED_AT,
  type PackNews,
} from './content-pack-2026-10'

type Result = 'criado' | 'atualizado' | 'sem alteração' | 'ignorado'

function assertTarget(): void {
  if (process.env.APPLY_CONTENT_PACK !== 'true') {
    throw new Error('Operação bloqueada. Defina APPLY_CONTENT_PACK=true após conferir o banco alvo.')
  }
  const uri = new URL(process.env.DATABASE_URI || 'postgresql://invalid')
  const local = ['localhost', '127.0.0.1'].includes(uri.hostname)
  if (!local && process.env.CONTENT_PACK_TARGET !== 'operational') {
    throw new Error(
      'Banco não local detectado. Use CONTENT_PACK_TARGET=operational somente após backup e migrations.',
    )
  }
}

const textNode = (text: string, format = 0) => ({
  type: 'text', version: 1, text, format, detail: 0, mode: 'normal', style: '',
})

type LexicalNode = { [key: string]: unknown; type: string; version: number }

const paragraph = (children: LexicalNode[]): LexicalNode => ({
  type: 'paragraph',
  version: 1,
  format: '' as const,
  indent: 0,
  direction: 'ltr' as const,
  textFormat: 0,
  children,
})

/** Body paragraphs plus a visible, editable source line at the end. */
export function lexicalFromParagraphs(
  paragraphs: string[],
  source?: { label: string; url: string },
) {
  const children: LexicalNode[] = paragraphs.map((text) => paragraph([textNode(text)]))
  if (source) {
    children.push(
      paragraph([
        textNode('Fonte: ', 1),
        {
          type: 'link',
          version: 3,
          format: '',
          indent: 0,
          direction: 'ltr',
          fields: { linkType: 'custom', url: source.url, newTab: true },
          children: [textNode(source.label)],
        },
        textNode('.'),
      ]),
    )
  }
  return {
    root: {
      type: 'root',
      version: 1,
      format: '' as const,
      indent: 0,
      direction: 'ltr' as const,
      children,
    },
  }
}

const provenance = (fonte: string, fonteURL: string) => ({
  fonte,
  fonteURL,
  verificadoEm: VERIFIED_AT,
  statusRevisao: 'dispensada' as const,
  observacoesInternas: `${PACK_MARKER} Texto próprio redigido a partir da fonte registrada. Sem imagem de terceiros e sem nomes de crianças ou adolescentes.`,
})

async function findAuthor(payload: Payload): Promise<User> {
  const email = process.env.CONTENT_PACK_AUTHOR_EMAIL?.trim().toLowerCase()
  if (!email) throw new Error('Defina CONTENT_PACK_AUTHOR_EMAIL para registrar a autoria.')
  const found = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 2,
    depth: 0,
    overrideAccess: true,
  })
  if (found.docs.length !== 1) throw new Error('Usuário autor inexistente ou duplicado.')
  return found.docs[0] as User
}

async function upsertNews(payload: Payload, req: PayloadRequest, item: PackNews): Promise<Result> {
  const existing = await payload.find({
    collection: 'noticias',
    where: { slug: { equals: item.slug } },
    limit: 2,
    depth: 0,
    draft: true,
    overrideAccess: true,
    req,
  })
  if (existing.docs.length > 1) throw new Error(`Slug duplicado em notícias: ${item.slug}`)
  const data = {
    title: item.title,
    slug: item.slug,
    categoria: item.categoria,
    resumo: item.resumo,
    corpo: lexicalFromParagraphs(item.paragraphs, { label: item.fonte, url: item.fonteURL }),
    tema: item.tema,
    autor: 'Comunicação CMDCA',
    destaque: Boolean(item.destaque),
    data: item.data,
    controleEditorial: provenance(item.fonte, item.fonteURL),
    _status: 'published' as const,
  }
  const current = existing.docs[0]
  if (current) {
    const owned = current.controleEditorial?.observacoesInternas?.includes(PACK_MARKER)
    if (!owned) return 'ignorado'
    await payload.update({
      collection: 'noticias', id: current.id, data, draft: false, overrideAccess: true, req,
    })
    return 'atualizado'
  }
  await payload.create({ collection: 'noticias', data, draft: false, overrideAccess: true, req })
  return 'criado'
}

async function applyFaq(payload: Payload, req: PayloadRequest) {
  const results: Array<[string, Result]> = []
  for (const item of FAQ) {
    const existing = await payload.find({
      collection: 'faq',
      where: { pergunta: { equals: item.pergunta } },
      limit: 2, depth: 0, draft: true, overrideAccess: true, req,
    })
    const data = {
      pergunta: item.pergunta,
      resposta: item.resposta,
      contexto: item.contexto,
      ordem: item.ordem,
      controleEditorial: provenance(item.fonte, item.fonteURL),
      _status: 'published' as const,
    }
    if (existing.docs[0]) {
      results.push([item.pergunta, 'sem alteração'])
      continue
    }
    await payload.create({ collection: 'faq', data, draft: false, overrideAccess: true, req })
    results.push([item.pergunta, 'criado'])
  }
  return results
}

async function applyHighlights(payload: Payload, req: PayloadRequest) {
  const results: Array<[string, Result]> = []
  for (const titulo of RETIRED_HIGHLIGHT_TITLES) {
    const found = await payload.find({
      collection: 'destaques',
      where: { and: [{ titulo: { equals: titulo } }, { _status: { equals: 'published' } }] },
      limit: 5, depth: 0, overrideAccess: true, req,
    })
    for (const doc of found.docs) {
      await payload.update({
        collection: 'destaques', id: doc.id, data: { _status: 'draft' },
        unpublishAllLocales: true, overrideAccess: true, req,
      })
      results.push([titulo, 'atualizado'])
    }
  }
  for (const item of HIGHLIGHTS) {
    const existing = await payload.find({
      collection: 'destaques',
      where: { titulo: { equals: item.titulo } },
      limit: 2, depth: 0, draft: true, overrideAccess: true, req,
    })
    if (existing.docs[0]) {
      results.push([item.titulo, 'sem alteração'])
      continue
    }
    await payload.create({
      collection: 'destaques',
      data: { ...item, _status: 'published' as const },
      draft: false,
      overrideAccess: true,
      req,
    })
    results.push([item.titulo, 'criado'])
  }
  return results
}

async function main() {
  assertTarget()
  const payload = await getPayload({ config: await configPromise })
  let req: PayloadRequest | undefined
  let started = false
  try {
    const author = await findAuthor(payload)
    req = await createLocalReq({ user: author, context: { operation: 'apply-content-pack' } }, payload)
    started = await initTransaction(req)
    if (!started) throw new Error('Não foi possível iniciar a transação do pacote editorial.')

    const noticias: Array<[string, Result]> = []
    for (const item of NEWS) noticias.push([item.slug, await upsertNews(payload, req, item)])
    const faq = await applyFaq(payload, req)
    const destaques = await applyHighlights(payload, req)

    await commitTransaction(req)
    started = false
    const created = [...noticias, ...faq, ...destaques].filter(([, result]) => result === 'criado').length
    payload.logger.info({ msg: 'Pacote editorial aplicado.', autor: author.email, noticias, faq, destaques })
    console.log(`CONTENT_PACK_CREATED=${created}`)
  } catch (error) {
    if (req && started) await killTransaction(req)
    throw error
  } finally {
    await payload.destroy()
  }
}

if (process.env.VITEST !== 'true') {
  // Payload keeps long-lived handles open; exit explicitly after cleanup, as the Payload CLI does.
  main().then(
    () => process.exit(0),
    (error) => {
      console.error('Falha ao aplicar o pacote editorial:', error)
      process.exit(1)
    },
  )
}
