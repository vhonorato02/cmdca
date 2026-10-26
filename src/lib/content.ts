import { cache } from 'react'

import { PAGINA_INICIAL_PADRAO, TEXTOS_PADRAO, type TextosPadrao } from '@/content/defaults'
import type { Configuracoe, Media, PaginaInicial } from '@/payload-types'

import { getPayloadClient } from './payload'
import { publicHref, publicText } from './site'

type Plain = Record<string, unknown>

const URL_KEY = /(?:url|href)$/i

function cleanString(key: string, value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  return URL_KEY.test(key) ? publicHref(value) : publicText(value)
}

/**
 * Combina o valor publicado no CMS com o padrão. Textos vazios, inválidos ou
 * com marcadores de pendência voltam ao padrão. Listas publicadas substituem a
 * lista padrão inteira; itens sem nenhum texto público são descartados.
 */
function merge<T>(fallback: T, value: unknown, key = ''): T {
  if (typeof fallback === 'string') return (cleanString(key, value) ?? fallback) as T
  if (typeof fallback === 'number') {
    return (typeof value === 'number' && Number.isFinite(value) ? value : fallback) as T
  }
  if (typeof fallback === 'boolean') return (typeof value === 'boolean' ? value : fallback) as T
  if (Array.isArray(fallback)) {
    if (!Array.isArray(value) || !value.length) return fallback
    const template = fallback[0] as Plain
    const items = value.flatMap((item) => {
      if (!item || typeof item !== 'object') return []
      const entry: Plain = {}
      let hasText = false
      for (const [field, sample] of Object.entries(template)) {
        const raw = (item as Plain)[field]
        if (typeof sample === 'string') {
          const text = cleanString(field, raw) ?? ''
          hasText ||= Boolean(text)
          entry[field] = text
        } else {
          entry[field] = typeof raw === typeof sample ? raw : sample
        }
      }
      return hasText ? [entry] : []
    })
    return (items.length ? items : fallback) as T
  }
  if (fallback && typeof fallback === 'object') {
    const source = value && typeof value === 'object' ? (value as Plain) : {}
    const out: Plain = {}
    for (const [field, sample] of Object.entries(fallback as Plain)) {
      out[field] = merge(sample, source[field], field)
    }
    return out as T
  }
  return fallback
}

export const getTextos = cache(async (): Promise<TextosPadrao> => {
  try {
    const payload = await getPayloadClient()
    const doc = await payload.findGlobal({ slug: 'textos', depth: 0 })
    return merge(TEXTOS_PADRAO, doc)
  } catch {
    return TEXTOS_PADRAO
  }
})

export type PaginaInicialConteudo = typeof PAGINA_INICIAL_PADRAO & {
  imagem: Media | null
  blocos: string[] | null
}

export const getPaginaInicial = cache(async (): Promise<PaginaInicialConteudo> => {
  let doc: PaginaInicial | null = null
  try {
    const payload = await getPayloadClient()
    doc = await payload.findGlobal({ slug: 'pagina-inicial', depth: 1 })
  } catch {
    doc = null
  }
  const blocos = doc?.blocos?.length
    ? doc.blocos.filter((bloco) => bloco.ativo !== false).map((bloco) => bloco.tipo)
    : null
  const imagem = typeof doc?.capa?.imagem === 'object' && doc.capa.imagem ? doc.capa.imagem : null
  return { ...merge(PAGINA_INICIAL_PADRAO, doc), imagem, blocos }
})

export const getConfiguracoes = cache(async (): Promise<Configuracoe | null> => {
  try {
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'configuracoes', depth: 0 })
  } catch {
    return null
  }
})

export type Instituicao = {
  nome: string
  email?: string
  telefone?: string
  endereco?: string
  cep?: string
  horario?: string
  casaTelefone?: string
  casaEndereco?: string
  assessoria?: string
  instagramUrl?: string
  instagramHandle?: string
  gestao?: string
  presidente?: { nome: string; cargo: string }
  vice?: { nome: string; cargo: string }
  leiCMDCA?: string
  leiFMDCA?: string
  regimento?: string
  lgpd: { controlador?: string; encarregado?: string; encarregadoContato?: string }
  fmdca: { cnpj?: string; conta?: string }
}

/** Dados institucionais prontos para exibição: somente valores públicos e confirmados. */
export const getInstituicao = cache(async (): Promise<Instituicao> => {
  const config = await getConfiguracoes()
  const c = config?.contato
  const d = config?.diretoria
  const presidente = publicText(d?.presidenteNome)
  const vice = publicText(d?.viceNome)
  const bankConfirmed = config?.fmdca?.dadosBancariosConfirmados === true
  return {
    nome:
      publicText(config?.nomeConselho) ||
      'Conselho Municipal dos Direitos da Criança e do Adolescente de Pindamonhangaba',
    email: publicText(c?.email),
    telefone: publicText(c?.telefone),
    endereco: publicText(c?.endereco),
    cep: publicText(c?.cep),
    horario: publicText(c?.horario),
    casaTelefone: publicText(c?.casaConselhosTelefone),
    casaEndereco: publicText(c?.casaConselhosEndereco),
    assessoria: publicText(c?.assessora),
    instagramUrl: publicHref(config?.redes?.instagramUrl),
    instagramHandle: publicText(config?.redes?.instagramHandle),
    gestao: publicText(d?.gestaoLabel),
    presidente: presidente
      ? { nome: presidente, cargo: publicText(d?.presidenteCargo) || 'Presidente' }
      : undefined,
    vice: vice ? { nome: vice, cargo: publicText(d?.viceCargo) || 'Vice-presidente' } : undefined,
    leiCMDCA: publicText(config?.baseLegal?.leiCMDCA),
    leiFMDCA: publicText(config?.baseLegal?.leiFMDCA),
    regimento: publicText(config?.baseLegal?.regimento),
    lgpd: {
      controlador: publicText(config?.lgpd?.controlador),
      encarregado: publicText(config?.lgpd?.encarregado),
      encarregadoContato: publicText(config?.lgpd?.encarregadoContato),
    },
    fmdca: bankConfirmed
      ? { cnpj: publicText(config?.fmdca?.cnpj), conta: publicText(config?.fmdca?.conta) }
      : {},
  }
})

export type Canal = TextosPadrao['protecao']['canais'][number] & { href?: string }

/** Canais com número discável; a faixa usa no máximo três. */
export function canaisDiscaveis(canais: TextosPadrao['protecao']['canais']): Canal[] {
  return canais.flatMap((canal) => {
    if (!canal.rotulo || !canal.numero) return []
    const digits = (canal.discagem || canal.numero).replace(/[^\d+]/g, '')
    return [{ ...canal, href: digits ? `tel:${digits}` : undefined }]
  })
}
