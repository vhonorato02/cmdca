'use client'

import { useMemo, useState } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Reunioe } from '@/payload-types'

export type ReuniaoItem = {
  id: string | number
  titulo: string
  data?: string | null
  tipo: string
  hora?: string | null
  modalidade?: Reunioe['modalidade']
  linkTransmissao?: string | null
  pauta?: Reunioe['pauta']
  local?: string | null
  ataUrl?: string | null
}

const TIPO: Record<string, { label: string; cls: string }> = {
  ordinaria: { label: 'Ordinária', cls: 'ord' },
  extraordinaria: { label: 'Extraordinária', cls: 'ext' },
}

const MESES_ABBR = [
  'JAN',
  'FEV',
  'MAR',
  'ABR',
  'MAI',
  'JUN',
  'JUL',
  'AGO',
  'SET',
  'OUT',
  'NOV',
  'DEZ',
]

export function ReunioesLista({ reunioes }: { reunioes: ReuniaoItem[] }) {
  const [year, setYear] = useState('all')
  const [type, setType] = useState('all')
  // Meeting dates are stored as midnight UTC; compare by calendar day.
  const todayKey = useMemo(() => {
    const now = new Date()
    return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  }, [])
  const isUpcoming = (value?: string | null) => {
    if (!value) return false
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return false
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) >= todayKey
  }

  const years = useMemo(() => {
    const set = new Set<number>()
    reunioes.forEach((r) => {
      const value = r.data ? new Date(r.data).getUTCFullYear() : NaN
      if (Number.isFinite(value)) set.add(value)
    })
    return Array.from(set).sort((a, b) => b - a)
  }, [reunioes])

  const filtered = useMemo(
    () =>
      reunioes.filter(
        (r) =>
          (year === 'all' || (r.data && String(new Date(r.data).getUTCFullYear()) === year)) &&
          (type === 'all' || r.tipo === type),
      ),
    [reunioes, type, year],
  )

  return (
    <>
      <div className="filters">
        <label className="filter-field">
          <span>Ano</span>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="all">Todos os anos</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-field">
          <span>Tipo de reunião</span>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">Todos os tipos</option>
            <option value="ordinaria">Ordinária</option>
            <option value="extraordinaria">Extraordinária</option>
          </select>
        </label>
      </div>
      <p className="results-status" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? 'reunião encontrada' : 'reuniões encontradas'}
      </p>
      {filtered.length ? (
        <>
          {[
            { key: 'next', title: 'Próximas reuniões', items: filtered.filter((r) => isUpcoming(r.data)).reverse() },
            { key: 'past', title: 'Reuniões realizadas', items: filtered.filter((r) => !isUpcoming(r.data)) },
          ].map((group) =>
            group.items.length ? (
              <div className="meeting-group" key={group.key}>
                <h2 className="meeting-group-title">{group.title}</h2>
                <ul className="meeting-list">
          {group.items.map((r) => {
            const parsedDate = r.data ? new Date(r.data) : null
            const d = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : null
            const ti = TIPO[r.tipo] || { label: r.tipo, cls: 'ord' }
            const upcoming = group.key === 'next'
            return (
              <li className="meet" key={r.id}>
                <time className="dt" dateTime={r.data || undefined}>
                  <b>{d ? String(d.getUTCDate()).padStart(2, '0') : '--'}</b>
                  <span>{d ? `${MESES_ABBR[d.getUTCMonth()]} ${d.getUTCFullYear()}` : ''}</span>
                </time>
                <div className="info">
                  <h3>
                    {r.titulo} <span className={`pill ${ti.cls}`}>{ti.label}</span>
                  </h3>
                  {r.local ? <p className="meta">{r.local}</p> : null}
                  <p className="meta">
                    {r.hora ? `Horário: ${r.hora}. ` : ''}
                    {r.modalidade === 'online' ? 'Online' : r.modalidade === 'hibrida' ? 'Híbrida' : 'Presencial'}
                  </p>
                  {r.pauta?.root?.children?.length ? (
                    <details className="meeting-agenda">
                      <summary>Consultar pauta</summary>
                      <RichText data={r.pauta} />
                    </details>
                  ) : null}
                </div>
                <div className="acts">
                  {upcoming && r.linkTransmissao ? (
                    <a
                      className="mini"
                      href={r.linkTransmissao}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Acessar reunião: ${r.titulo} (abre em nova aba)`}
                    >
                      Acessar reunião <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                  {r.ataUrl ? (
                    <a
                      className="mini"
                      href={r.ataUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Abrir ata em PDF de ${r.titulo} em nova aba`}
                    >
                      Ata em PDF <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="document-status">
                      {upcoming ? 'Ata após a reunião' : 'Ata ainda não disponível'}
                    </span>
                  )}
                </div>
              </li>
            )
          })}
                </ul>
              </div>
            ) : null,
          )}
        </>
      ) : (
        <p className="empty-state">Nenhuma reunião neste filtro.</p>
      )}
    </>
  )
}
