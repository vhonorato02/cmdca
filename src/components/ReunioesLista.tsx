'use client'

import { useMemo, useState } from 'react'

export type ReuniaoItem = {
  id: string | number
  titulo: string
  data?: string | null
  tipo: string
  local?: string | null
  ataUrl?: string | null
}

const TIPO: Record<string, { label: string; cls: string }> = {
  ordinaria: { label: 'Ordinária', cls: 'ord' },
  extraordinaria: { label: 'Extraordinária', cls: 'ext' },
  publica: { label: 'Pública', cls: 'ord' },
  reservada: { label: 'Reservada', cls: 'ext' },
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

  const years = useMemo(() => {
    const set = new Set<number>()
    reunioes.forEach((r) => {
      if (r.data) set.add(new Date(r.data).getUTCFullYear())
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
            <option value="publica">Pública</option>
            <option value="reservada">Reservada</option>
          </select>
        </label>
      </div>
      <p className="results-status" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? 'reunião encontrada' : 'reuniões encontradas'}
      </p>
      {filtered.length ? (
        <ul className="meeting-list">
          {filtered.map((r) => {
            const parsedDate = r.data ? new Date(r.data) : null
            const d = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : null
            const ti = TIPO[r.tipo] || { label: r.tipo, cls: 'ord' }
            return (
              <li className="meet" key={r.id}>
                <time className="dt" dateTime={r.data || undefined}>
                  <b>{d ? String(d.getUTCDate()).padStart(2, '0') : '--'}</b>
                  <span>{d ? `${MESES_ABBR[d.getUTCMonth()]} ${d.getUTCFullYear()}` : ''}</span>
                </time>
                <div className="info">
                  <h2>
                    {r.titulo} <span className={`pill ${ti.cls}`}>{ti.label}</span>
                  </h2>
                  {r.local ? <p className="meta">{r.local}</p> : null}
                </div>
                <div className="acts">
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
                    <span className="document-status">Ata ainda não disponível</span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="empty-state">Nenhuma reunião neste filtro.</p>
      )}
    </>
  )
}
