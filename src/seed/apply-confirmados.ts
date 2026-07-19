/**
 * Publica o lote de dados confirmados em fontes oficiais e mantém como
 * rascunho o que ainda depende de confirmação institucional.
 *
 * A operação é atômica, atribui a revisão a um usuário admin/jurídico, detecta
 * duplicatas e evita criar versões quando o estado desejado já está aplicado.
 * Fontes e critérios editoriais: CONTEUDO.md.
 *
 * Exige APPLY_CONFIRMED_DATA=true e CONFIRMED_DATA_REVIEWER_EMAIL.
 * ALLOW_REPLACE_DRAFTS=true autoriza substituir rascunhos existentes.
 */
import type { Payload, PayloadRequest } from 'payload'
import {
  commitTransaction,
  createLocalReq,
  getPayload,
  initTransaction,
  killTransaction,
} from 'payload'

import type { Configuracoe, User } from '../payload-types'
import configPromise from '../payload.config'

const VERIFICADO_EM = '2026-07-19T12:00:00.000Z'
const CASA_ENDERECO =
  'Rua Dr. Laerte Machado Guimarães, 590 — Vila Borghese, Pindamonhangaba/SP (na Secretaria de Assistência Social)'
const CASA_TELEFONE = '(12) 3643-1607 (ramal 6037) · (12) 3643-1609'
const LEI_CMDCA = 'Lei Municipal nº 2.626, de 19/12/1991'
const LEI_FMDCA = 'Lei Municipal nº 4.140, de 23/03/2004'
const FONTE_CONFIG =
  'Prefeitura de Pindamonhangaba, Câmara Municipal/SAPL e fontes oficiais registradas em CONTEUDO.md'
const FONTE_LEIS_URL =
  'https://sapl.pindamonhangaba.sp.leg.br/pysc/download_materia_pysc?cod_materia=MzI0MDE%3D&texto_original=1'
const FONTE_REDE = 'Prefeitura de Pindamonhangaba — página oficial do serviço municipal'
const FONTE_CRAS_URL =
  'https://pindamonhangaba.sp.gov.br/cras-centro-de-referencia-da-assistencia-social'
const FONTE_CREAS_URL = 'https://pindamonhangaba.sp.gov.br/creas-enderecos-e-telefones'
const FONTE_CASA_URL =
  'https://www.pindamonhangaba.sp.gov.br/noticias/assistencia-social/casa-dos-conselhos-passa-a-funcionar-provisoriamente-na-secretaria-de-assistencia-social'
const FONTE_CONSELHO_TUTELAR_URL =
  'https://pindamonhangaba.sp.gov.br/conselho-tutelar-de-moreira-cesar-passa-a-atuar-em-nova-sede-a-partir-do-dia-9-de-junho'
const NOTICIA_DESATUALIZADA_SLUG =
  'conferencia-municipal-dos-direitos-da-crianca-e-do-adolescente-e-agendada-para-2026'
const BOOTSTRAP_MARKER = '[apply-confirmados:2026-07-19]'

type Ponto = {
  nome: string
  tipo: 'ct' | 'cras' | 'creas' | 'casa' | 'outro'
  endereco: string
  telefone?: string
  horario?: string
  obs?: string
  publicar?: boolean
}

type Resultado = 'criado' | 'atualizado' | 'sem alteração'
type AnyRecord = Record<string, unknown>

const fonteURLDoPonto = (tipo: Ponto['tipo']): string => {
  if (tipo === 'cras') return FONTE_CRAS_URL
  if (tipo === 'creas') return FONTE_CREAS_URL
  if (tipo === 'casa') return FONTE_CASA_URL
  if (tipo === 'ct') return FONTE_CONSELHO_TUTELAR_URL
  return 'https://pindamonhangaba.sp.gov.br/servicos-ao-cidadao/telefones-uteis'
}

function sameSubset(current: unknown, expected: unknown): boolean {
  if (expected === undefined) return true
  if (expected === null || typeof expected !== 'object') return current === expected
  if (Array.isArray(expected)) {
    return (
      Array.isArray(current) &&
      current.length === expected.length &&
      expected.every((item, index) => sameSubset(current[index], item))
    )
  }
  if (!current || typeof current !== 'object' || Array.isArray(current)) return false
  return Object.entries(expected as AnyRecord).every(([key, value]) =>
    sameSubset((current as AnyRecord)[key], value),
  )
}

const PONTOS: Ponto[] = [
  {
    nome: '2º Conselho Tutelar (Moreira César)',
    tipo: 'ct',
    endereco: 'Av. das Hortências, 168 — Vale das Acácias, Moreira César (Pindamonhangaba/SP)',
    telefone: '(12) 3641-1688',
  },
  {
    nome: 'Casa dos Conselhos',
    tipo: 'casa',
    endereco: CASA_ENDERECO,
    telefone: CASA_TELEFONE,
    obs: 'Endereço provisório informado em 29/09/2025; confirmar a permanência antes de publicar.',
    publicar: false,
  },
  {
    nome: 'CRAS Araretama',
    tipo: 'cras',
    endereco: 'Rua José Alves Pereira Sobrinho, 36 — Araretama, CEP 12426-320',
    telefone: '(12) 3643-4209 (ramais 9026/9027)',
    horario: 'Segunda a sexta',
  },
  {
    nome: 'CRAS Castolira',
    tipo: 'cras',
    endereco: 'Rua Regina Célia Pestana César, 276 — Castolira, CEP 12405-490',
    telefone: '(12) 3645-3672 (ramal 8850)',
    horario: 'Segunda a sexta',
  },
  {
    nome: 'CRAS Centro',
    tipo: 'cras',
    endereco: 'Rua Dr. Laerte de Assunção Júnior, 51 — Campo Alegre, CEP 12412-040',
    telefone: '(12) 3642-1302 (ramais 8804/8805)',
    horario: 'Segunda a sexta',
  },
  {
    nome: 'CRAS Cidade Nova',
    tipo: 'cras',
    endereco: 'Av. Rio de Janeiro, 475 — Cidade Nova, CEP 12414-080',
    telefone: '(12) 3645-6949 (ramais 8964/8965)',
    horario: 'Segunda a sexta',
  },
  {
    nome: 'CRAS Moreira César',
    tipo: 'cras',
    endereco: 'Rua Carlos Augusto Machado, 63 — Moreira César, CEP 12441-020',
    telefone: '(12) 3637-5386 (ramais 9132/9133)',
    horario: 'Segunda a sexta',
  },
  {
    nome: 'CREAS Centro',
    tipo: 'creas',
    endereco: 'Av. Fortunato Moreira, 341 — Centro',
    telefone: '(12) 3642-6856 · (12) 3642-6403 (ramais 7090/7091)',
    horario: 'Segunda a sexta, 8h–17h',
    obs: 'Serviços: PAEFI, alta complexidade e abordagem social.',
  },
  {
    nome: 'CREAS Moreira César',
    tipo: 'creas',
    endereco: 'Rua Joaquim Santana Salvador, 105 — Moreira César',
    telefone: '(12) 3550-3608 · (12) 3550-3609 (ramais 9198/9199)',
    horario: 'Segunda a sexta',
  },
]

async function findReviewer(payload: Payload): Promise<User> {
  const email = process.env.CONFIRMED_DATA_REVIEWER_EMAIL?.trim().toLowerCase()
  if (!email) throw new Error('Defina CONFIRMED_DATA_REVIEWER_EMAIL para registrar a autoria.')

  const result = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 2,
    depth: 0,
    showHiddenFields: true,
    overrideAccess: true,
  })
  if (result.docs.length !== 1) {
    throw new Error('O usuário revisor informado não existe ou está duplicado.')
  }
  const reviewer = result.docs[0] as User
  if (reviewer.role !== 'admin' && reviewer.role !== 'juridico') {
    throw new Error('O usuário revisor precisa ter papel admin ou juridico.')
  }
  return reviewer
}

async function upsertPonto(
  payload: Payload,
  ponto: Ponto,
  req: PayloadRequest,
  reviewer: User,
  allowReplaceDrafts: boolean,
): Promise<Resultado> {
  const [latest, published] = await Promise.all([
    payload.find({
      collection: 'rede-protecao',
      where: {
        and: [{ nome: { equals: ponto.nome } }, { _status: { equals: 'published' } }],
      },
      limit: 2,
      depth: 0,
      draft: true,
      overrideAccess: true,
      req,
    }),
    payload.find({
      collection: 'rede-protecao',
      where: { nome: { equals: ponto.nome } },
      limit: 2,
      depth: 0,
      draft: false,
      overrideAccess: true,
      req,
    }),
  ])
  if (latest.docs.length > 1 || published.docs.length > 1) {
    throw new Error('Duplicata em rede-protecao: ' + ponto.nome)
  }
  let current = latest.docs[0]
  if (!current) {
    const historical = await payload.findVersions({
      collection: 'rede-protecao',
      where: { 'version.nome': { equals: ponto.nome } },
      limit: 30,
      depth: 0,
      overrideAccess: true,
      req,
    })
    const parentIDs = Array.from(new Set(historical.docs.map((version) => version.parent)))
    if (parentIDs.length > 1) {
      throw new Error('Mais de um histórico usa o mesmo nome em rede-protecao: ' + ponto.nome)
    }
    if (parentIDs[0] !== undefined) {
      current = await payload.findByID({
        collection: 'rede-protecao',
        id: parentIDs[0],
        draft: true,
        depth: 0,
        overrideAccess: true,
        req,
      })
    }
  }
  if (current && published.docs[0] && current.id !== published.docs[0].id) {
    throw new Error('IDs divergentes em rede-protecao: ' + ponto.nome)
  }

  const { publicar = true } = ponto
  const data = {
    nome: ponto.nome,
    tipo: ponto.tipo,
    endereco: ponto.endereco,
    telefone: ponto.telefone ?? null,
    email: null,
    horario: ponto.horario ?? null,
    obs: ponto.obs ?? null,
    lat: null,
    lng: null,
    _status: publicar ? ('published' as const) : ('draft' as const),
    controleEditorial: {
      fonte: FONTE_REDE,
      fonteURL: fonteURLDoPonto(ponto.tipo),
      verificadoEm: VERIFICADO_EM,
      statusRevisao: publicar ? ('dispensada' as const) : ('pendente' as const),
      ...(publicar ? { revisadoPor: reviewer.id } : {}),
      observacoesInternas: publicar
        ? 'Dados operacionais conferidos nas páginas oficiais registradas em CONTEUDO.md.'
        : 'Registro importado para o CMS, mas mantido fora do portal até nova confirmação institucional.',
    },
  }
  if (current?._status === 'draft' && !sameSubset(current, data) && !allowReplaceDrafts) {
    throw new Error(
      'Existe rascunho pendente em rede-protecao: ' +
        ponto.nome +
        '. Use ALLOW_REPLACE_DRAFTS=true somente após autorizar a substituição.',
    )
  }

  if (current) {
    if (publicar) {
      if (published.docs[0] && sameSubset(published.docs[0], data)) return 'sem alteração'
      await payload.update({
        collection: 'rede-protecao',
        id: current.id,
        data,
        draft: false,
        overrideAccess: true,
        req,
      })
    } else {
      if (!published.docs[0] && sameSubset(current, data)) return 'sem alteração'
      await payload.update({
        collection: 'rede-protecao',
        id: current.id,
        data,
        unpublishAllLocales: true,
        overrideAccess: true,
        req,
      })
    }
    return 'atualizado'
  }

  await payload.create({
    collection: 'rede-protecao',
    data,
    draft: !publicar,
    overrideAccess: true,
    req,
  })
  return 'criado'
}

async function publishConfiguracoes(
  payload: Payload,
  req: PayloadRequest,
  reviewer: User,
  allowReplaceDrafts: boolean,
): Promise<Resultado> {
  const [published, latest] = await Promise.all([
    payload.findGlobal({
      slug: 'configuracoes',
      draft: false,
      depth: 0,
      showHiddenFields: true,
      overrideAccess: true,
      req,
    }),
    payload.findGlobal({
      slug: 'configuracoes',
      draft: true,
      depth: 0,
      showHiddenFields: true,
      overrideAccess: true,
      req,
    }),
  ])
  const publishedCfg = published as Configuracoe
  const latestCfg = latest as Configuracoe
  if (latestCfg._status === 'draft' && !allowReplaceDrafts) {
    throw new Error(
      'Existe rascunho pendente em configuracoes. Use ALLOW_REPLACE_DRAFTS=true somente após autorizar a substituição.',
    )
  }

  const desired = {
    nomeConselho: publishedCfg.nomeConselho,
    municipio: publishedCfg.municipio,
    diretoria: publishedCfg.diretoria,
    contato: {
      ...publishedCfg.contato,
      casaConselhosEndereco: null,
      casaConselhosTelefone: null,
      assessora: null,
    },
    redes: publishedCfg.redes,
    fmdca: publishedCfg.fmdca,
    baseLegal: {
      ...publishedCfg.baseLegal,
      leiCMDCA: LEI_CMDCA,
      leiFMDCA: LEI_FMDCA,
    },
    tribunaUrl: publishedCfg.tribunaUrl,
    controleEditorial: {
      fonte: FONTE_CONFIG,
      fonteURL: FONTE_LEIS_URL,
      verificadoEm: VERIFICADO_EM,
      statusRevisao: 'aprovada' as const,
      revisadoPor: reviewer.id,
      observacoesInternas:
        BOOTSTRAP_MARKER +
        ' Publicação inicial autorizada para dados institucionais e bases legais. Dados bancários não confirmados e indicadores permanecem protegidos pelos controles próprios.',
    },
    _status: 'published' as const,
  }

  if (latestCfg._status !== 'draft' && sameSubset(publishedCfg, desired)) {
    return 'sem alteração'
  }
  await payload.updateGlobal({
    slug: 'configuracoes',
    data: desired,
    draft: false,
    overrideAccess: true,
    req,
  })
  return 'atualizado'
}

async function removePlaceholders(
  payload: Payload,
  req: PayloadRequest,
  allowReplaceDrafts: boolean,
): Promise<number> {
  let removidos = 0
  for (const nome of ['CRAS (unidades)', 'CREAS']) {
    const found = await payload.find({
      collection: 'rede-protecao',
      where: { nome: { equals: nome } },
      limit: 50,
      depth: 0,
      draft: true,
      overrideAccess: true,
      req,
    })
    for (const doc of found.docs) {
      if (doc._status === 'draft' && !allowReplaceDrafts) {
        throw new Error(
          'Existe rascunho pendente no placeholder ' + nome + '; exclusão interrompida.',
        )
      }
      await payload.delete({
        collection: 'rede-protecao',
        id: doc.id,
        overrideAccess: true,
        req,
      })
      removidos += 1
    }
  }
  return removidos
}

async function unpublishOutdatedNews(
  payload: Payload,
  req: PayloadRequest,
  allowReplaceDrafts: boolean,
): Promise<number> {
  const found = await payload.find({
    collection: 'noticias',
    where: {
      and: [{ slug: { equals: NOTICIA_DESATUALIZADA_SLUG } }, { _status: { equals: 'published' } }],
    },
    limit: 10,
    depth: 0,
    draft: false,
    overrideAccess: true,
    req,
  })
  for (const noticia of found.docs) {
    const latest = await payload.findByID({
      collection: 'noticias',
      id: noticia.id,
      draft: true,
      depth: 0,
      overrideAccess: true,
      req,
    })
    if (latest._status === 'draft' && !allowReplaceDrafts) {
      throw new Error('Existe rascunho pendente na notícia antiga; despublicação interrompida.')
    }
    await payload.update({
      collection: 'noticias',
      id: noticia.id,
      data: { _status: 'draft' },
      unpublishAllLocales: true,
      overrideAccess: true,
      req,
    })
  }
  return found.docs.length
}

async function main() {
  if (process.env.APPLY_CONFIRMED_DATA !== 'true') {
    throw new Error(
      'Operação bloqueada. Defina APPLY_CONFIRMED_DATA=true após conferir o banco alvo.',
    )
  }

  const payload = await getPayload({ config: await configPromise })
  let req: PayloadRequest | undefined
  let transactionStarted = false
  try {
    const reviewer = await findReviewer(payload)
    req = await createLocalReq(
      { user: reviewer, context: { operation: 'apply-confirmed-production-data' } },
      payload,
    )
    transactionStarted = await initTransaction(req)
    if (!transactionStarted) throw new Error('Não foi possível iniciar a transação do seed.')

    const allowReplaceDrafts = process.env.ALLOW_REPLACE_DRAFTS === 'true'
    const bootstrapState = (await payload.findGlobal({
      slug: 'configuracoes',
      draft: true,
      depth: 0,
      showHiddenFields: true,
      overrideAccess: true,
      req,
    })) as Configuracoe
    if (bootstrapState.controleEditorial?.observacoesInternas?.includes(BOOTSTRAP_MARKER)) {
      await commitTransaction(req)
      transactionStarted = false
      payload.logger.info('Lote oficial de 19/07/2026 já aplicado; nenhuma alteração necessária.')
      return
    }

    const configResult = await publishConfiguracoes(payload, req, reviewer, allowReplaceDrafts)
    const removidos = await removePlaceholders(payload, req, allowReplaceDrafts)
    const resultados: Array<{ nome: string; resultado: Resultado }> = []
    for (const ponto of PONTOS) {
      resultados.push({
        nome: ponto.nome,
        resultado: await upsertPonto(payload, ponto, req, reviewer, allowReplaceDrafts),
      })
    }
    const noticiasDespublicadas = await unpublishOutdatedNews(payload, req, allowReplaceDrafts)

    await commitTransaction(req)
    transactionStarted = false
    payload.logger.info({
      msg: 'Dados confirmados aplicados em transação única.',
      reviewer: reviewer.email,
      configuracoes: configResult,
      placeholdersRemovidos: removidos,
      redeProtecao: resultados,
      noticiasDespublicadas,
    })
  } catch (error) {
    if (req && transactionStarted) await killTransaction(req)
    throw error
  } finally {
    await payload.destroy()
  }
}

main().catch((error) => {
  console.error('Falha ao aplicar dados confirmados:', error)
  process.exitCode = 1
})
