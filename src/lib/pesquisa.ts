import type { Payload, Where } from 'payload'

import { yearOf } from '@/components/ActFilters'
import { publicText } from '@/lib/site'

/**
 * Pesquisa de conteúdo do portal (Lei de Acesso à Informação, art. 8º, § 3º, I).
 *
 * Usa a API local com `overrideAccess: false` e sem usuário: valem as mesmas regras
 * de acesso de um visitante anônimo (só publicado, reuniões reservadas e campos
 * internos de fora). Nenhum filtro de visibilidade é reimplementado aqui.
 */

export const PESQUISA_MIN = 2
export const PESQUISA_MAX = 80
const POR_TIPO = 8

export type Resultado = {
  tipo: string
  titulo: string
  href: string
  resumo?: string
  data?: string
}

export function normalizarTermo(value: unknown): string {
  const raw = Array.isArray(value) ? value[0] : value
  if (typeof raw !== 'string') return ''
  return raw.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, PESQUISA_MAX)
}

const like = (fields: string[], termo: string): Where => ({
  or: fields.map((field) => ({ [field]: { like: termo } })),
})

type Fonte = {
  collection: 'noticias' | 'resolucoes' | 'editais' | 'reunioes' | 'entidades' | 'paginas'
  fields: string[]
  sort?: string
  map: (doc: Record<string, unknown>) => Resultado | null
}

const texto = (value: unknown) => publicText(typeof value === 'string' ? value : undefined)

const FONTES: Fonte[] = [
  {
    collection: 'paginas',
    fields: ['titulo', 'resumo'],
    sort: 'titulo',
    map: (d) =>
      texto(d.titulo) && typeof d.slug === 'string'
        ? { tipo: 'Página', titulo: texto(d.titulo)!, href: `/${d.slug}`, resumo: texto(d.resumo) }
        : null,
  },
  {
    collection: 'noticias',
    fields: ['title', 'resumo'],
    sort: '-data',
    map: (d) =>
      texto(d.title) && typeof d.slug === 'string'
        ? {
            tipo: 'Notícia',
            titulo: texto(d.title)!,
            href: `/noticias/${d.slug}`,
            resumo: texto(d.resumo),
            data: typeof d.data === 'string' ? d.data : undefined,
          }
        : null,
  },
  {
    collection: 'resolucoes',
    fields: ['numero', 'titulo'],
    sort: '-data',
    map: (d) => {
      const titulo = texto(d.titulo)
      if (!titulo || !texto(d.numero)) return null
      const data = typeof d.data === 'string' ? d.data : undefined
      const ano = data ? yearOf(data) : undefined
      return {
        tipo: 'Resolução',
        titulo: `Resolução ${texto(d.numero)}: ${titulo}`,
        href: `/resolucoes${ano ? `?ano=${ano}` : ''}#resolucao-${d.id}`,
        data,
      }
    },
  },
  {
    collection: 'editais',
    fields: ['numero', 'titulo'],
    sort: '-data',
    map: (d) => {
      const titulo = texto(d.titulo)
      if (!titulo) return null
      const data = typeof d.data === 'string' ? d.data : undefined
      const ano = data ? yearOf(data) : undefined
      const numero = texto(d.numero)
      return {
        tipo: 'Edital',
        titulo: numero ? `Edital ${numero}: ${titulo}` : titulo,
        href: `/editais${ano ? `?ano=${ano}` : ''}#edital-${d.id}`,
        data,
      }
    },
  },
  {
    collection: 'reunioes',
    fields: ['titulo'],
    sort: '-data',
    map: (d) =>
      texto(d.titulo)
        ? {
            tipo: 'Reunião',
            titulo: texto(d.titulo)!,
            href: '/reunioes',
            data: typeof d.data === 'string' ? d.data : undefined,
          }
        : null,
  },
  {
    collection: 'entidades',
    fields: ['nome'],
    sort: 'nome',
    map: (d) =>
      texto(d.nome) ? { tipo: 'Entidade registrada', titulo: texto(d.nome)!, href: '/entidades' } : null,
  },
]

export async function pesquisar(payload: Payload, termo: string): Promise<Resultado[] | null> {
  if (termo.length < PESQUISA_MIN) return []
  try {
    const grupos = await Promise.all(
      FONTES.map(async (fonte) => {
        const res = await payload
          .find({
            collection: fonte.collection,
            where: like(fonte.fields, termo),
            sort: fonte.sort,
            limit: POR_TIPO,
            depth: 0,
            overrideAccess: false,
          })
          .catch(() => ({ docs: [] }))
        return (res.docs as unknown as Record<string, unknown>[]).flatMap((doc) => {
          const item = fonte.map(doc)
          return item ? [item] : []
        })
      }),
    )
    return grupos.flat()
  } catch {
    return null
  }
}
