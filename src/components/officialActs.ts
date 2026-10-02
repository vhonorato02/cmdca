import { containsUnverifiedMarker, publicHref, publicText } from '../lib/site'

export type StatusTone = 'ok' | 'warn' | 'alert'
export type StatusInfo = { label: string; tone: StatusTone }

export const RESOLUCAO_SITUACAO: Record<string, StatusInfo> = {
  vigente: { label: 'Vigente', tone: 'ok' },
  alterada: { label: 'Alterada', tone: 'warn' },
  revogada: { label: 'Revogada', tone: 'alert' },
  sem_efeito: { label: 'Sem efeito', tone: 'alert' },
}

export const EDITAL_SITUACAO: Record<string, StatusInfo> = {
  vigente: { label: 'Vigente ou em andamento', tone: 'ok' },
  encerrado: { label: 'Encerrado', tone: 'warn' },
  suspenso: { label: 'Suspenso', tone: 'alert' },
  revogado: { label: 'Revogado', tone: 'alert' },
  anulado: { label: 'Anulado', tone: 'alert' },
}

export const ENTIDADE_SITUACAO: Record<string, StatusInfo> = {
  ativo: { label: 'Registro ativo', tone: 'ok' },
  vencido: { label: 'Registro vencido', tone: 'alert' },
  suspenso: { label: 'Registro suspenso', tone: 'alert' },
  cancelado: { label: 'Registro cancelado', tone: 'alert' },
}

const UNKNOWN_STATUS: StatusInfo = { label: 'Situação não informada', tone: 'warn' }

export function statusInfo(map: Record<string, StatusInfo>, value?: string | null): StatusInfo {
  return (value && map[value]) || UNKNOWN_STATUS
}

type ActLike = {
  id: number | string
  numero?: string | null
  titulo?: string | null
  _status?: string | null
  retifica?: (number | string | ActLike)[] | null
}

export type ActRef = { id: number | string; numero: string; titulo?: string; listed: boolean }

const isPublicAct = (act: ActLike) =>
  act._status !== 'draft' &&
  Boolean(publicText(act.numero)) &&
  !containsUnverifiedMarker([act.numero, act.titulo])

const toRef = (act: ActLike, listed: boolean): ActRef => ({
  id: act.id,
  numero: publicText(act.numero) as string,
  titulo: publicText(act.titulo),
  listed,
})

/**
 * Atos anteriores que este ato retifica ou altera. Só expõe relações populadas,
 * publicadas e sem marcador de pendência. "listed" indica se o ato relacionado
 * aparece na mesma página, para permitir link interno.
 */
export function relatedActs(act: ActLike, listedIds: Set<number | string>): ActRef[] {
  return (act.retifica || []).flatMap((rel) =>
    typeof rel === 'object' && rel && isPublicAct(rel) ? [toRef(rel, listedIds.has(rel.id))] : [],
  )
}

/** Atos publicados da lista que retificam ou alteram o ato informado. */
export function amendedBy(target: ActLike, acts: ActLike[]): ActRef[] {
  return acts.flatMap((act) => {
    if (act.id === target.id || !isPublicAct(act)) return []
    const touches = (act.retifica || []).some(
      (rel) => (typeof rel === 'object' && rel ? rel.id : rel) === target.id,
    )
    return touches ? [toRef(act, true)] : []
  })
}

type MediaLike = {
  id?: number | string
  url?: string | null
  alt?: string | null
  _status?: string | null
}

/** Documentos públicos de uma entidade, ignorando rascunhos e URLs inválidas. */
export function publicDocuments(docs?: (number | string | MediaLike)[] | null) {
  return (docs || []).flatMap((doc, index) => {
    if (typeof doc !== 'object' || !doc || doc._status === 'draft') return []
    const href = publicHref(doc.url)
    if (!href) return []
    const label = publicText(doc.alt) || `Documento público ${index + 1}`
    return [{ key: String(doc.id ?? index), href, label }]
  })
}

/** Indica se a data é anterior ao dia de referência, comparando em UTC. */
export function isPastDate(value?: string | null, today = new Date()): boolean {
  if (!value) return false
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false
  const day = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  const ref = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  return day < ref
}
