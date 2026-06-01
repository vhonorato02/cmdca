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

const MESES_ABBR = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']

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

  const filtered = reunioes.filter(
    (r) =>
      (year === 'all' || (r.data && String(new Date(r.data).getUTCFullYear()) === year)) &&
      (type === 'all' || r.tipo === type),
  )

  return (
    <>
      <div className="filters">
        <select value={year} onChange={(e) => setYear(e.target.value)} aria-label="Filtrar por ano">
          <option value="all">Todos os anos</option>
          {years.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Filtrar por tipo">
          <option value="all">Todos os tipos</option>
          <option value="ordinaria">Ordinária</option>
          <option value="extraordinaria">Extraordinária</option>
          <option value="publica">Pública</option>
          <option value="reservada">Reservada</option>
        </select>
      </div>
      {filtered.length ? (
        filtered.map((r) => {
          const d = r.data ? new Date(r.data) : null
          const ti = TIPO[r.tipo] || { label: r.tipo, cls: 'ord' }
          return (
            <div className="meet" key={r.id}>
              <div className="dt">
                <b>{d ? String(d.getUTCDate()).padStart(2, '0') : '--'}</b>
                <span>{d ? `${MESES_ABBR[d.getUTCMonth()]} ${d.getUTCFullYear()}` : ''}</span>
              </div>
              <div className="info">
                <h4>
                  {r.titulo} <span className={`pill ${ti.cls}`}>{ti.label}</span>
                </h4>
                {r.local ? <div className="meta">{r.local}</div> : null}
              </div>
              <div className="acts">
                {r.ataUrl ? (
                  <a className="mini" href={r.ataUrl} target="_blank" rel="noopener noreferrer">
                    Ata (PDF)
                  </a>
                ) : (
                  <span className="mini" style={{ opacity: 0.5 }}>
                    Ata em breve
                  </span>
                )}
              </div>
            </div>
          )
        })
      ) : (
        <p style={{ color: 'var(--ink-2)' }}>Nenhuma reunião neste filtro.</p>
      )}
    </>
  )
}
