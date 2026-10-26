'use client'

import { useId, useState } from 'react'

type Serie = { ano: string; valor: number }
type Area = { area: string; percentual: number }

const PALETTE = ['#262357', '#9C2A22', '#C9A227', '#9a96c4']

export function Charts({
  serieAnual,
  aplicacaoPorArea,
}: {
  serieAnual: Serie[]
  aplicacaoPorArea: Area[]
}) {
  const [mode, setMode] = useState<'ano' | 'area'>('ano')
  const barsTitleId = useId()
  const areaTitleId = useId()

  const bars =
    mode === 'ano'
      ? serieAnual.map((s) => ({ label: s.ano, value: s.valor }))
      : aplicacaoPorArea.map((a) => ({ label: a.area, value: a.percentual }))
  const max = Math.max(...bars.map((b) => b.value), 1) * 1.15
  const areaTotal = aplicacaoPorArea.reduce((sum, area) => sum + Math.max(area.percentual, 0), 0)

  // Normaliza apenas a representação visual; a tabela mantém os valores informados no CMS.
  const parts = aplicacaoPorArea.map((a, i) => {
    const startValue = aplicacaoPorArea
      .slice(0, i)
      .reduce((sum, x) => sum + Math.max(x.percentual, 0), 0)
    const start = areaTotal ? (startValue / areaTotal) * 100 : 0
    const end = areaTotal ? ((startValue + Math.max(a.percentual, 0)) / areaTotal) * 100 : 0
    return `${PALETTE[i % PALETTE.length]} ${start}% ${end}%`
  })

  const firstColumn = mode === 'ano' ? 'Ano' : 'Área'
  const secondColumn = mode === 'ano' ? 'Projetos apoiados' : 'Percentual'

  return (
    <>
      <div className="chart-tabs" role="group" aria-label="Visualização dos indicadores">
        <button
          type="button"
          className={mode === 'ano' ? 'on' : undefined}
          aria-pressed={mode === 'ano'}
          onClick={() => setMode('ano')}
        >
          Por ano
        </button>
        <button
          type="button"
          className={mode === 'area' ? 'on' : undefined}
          aria-pressed={mode === 'area'}
          onClick={() => setMode('area')}
        >
          Por área
        </button>
      </div>
      <div className="chart-grid">
        <section className="panel" aria-labelledby={barsTitleId}>
          <h3 id={barsTitleId}>
            {mode === 'ano' ? 'Projetos apoiados por ano' : 'Aplicação por área'}
          </h3>
          <p className="cap">Dados informados no painel do CMDCA.</p>
          <BarsChart bars={bars} max={max} mode={mode} />
          <DataTable
            caption={mode === 'ano' ? 'Projetos apoiados por ano' : 'Aplicação por área'}
            firstColumn={firstColumn}
            secondColumn={secondColumn}
            rows={bars}
            suffix={mode === 'area' ? '%' : ''}
          />
        </section>
        <section className="panel" aria-labelledby={areaTitleId}>
          <h3 id={areaTitleId}>Aplicação dos recursos do FMDCA</h3>
          <p className="cap">Distribuição proporcional por área.</p>
          <div className="donut-wrap">
            <div
              className="donut"
              style={
                parts.length ? { background: `conic-gradient(${parts.join(',')})` } : undefined
              }
              aria-hidden="true"
            />
            <div className="legend" aria-hidden="true">
              {aplicacaoPorArea.map((a, i) => (
                <div key={a.area}>
                  <i className={`tone-${i % PALETTE.length}`} />
                  {a.area} · {a.percentual}%
                </div>
              ))}
            </div>
          </div>
          <DataTable
            caption="Aplicação dos recursos por área"
            firstColumn="Área"
            secondColumn="Percentual"
            rows={aplicacaoPorArea.map((area) => ({ label: area.area, value: area.percentual }))}
            suffix="%"
          />
        </section>
      </div>
    </>
  )
}

function BarsChart({
  bars,
  max,
  mode,
}: {
  bars: { label: string; value: number }[]
  max: number
  mode: 'ano' | 'area'
}) {
  return (
    <div className="bars" aria-hidden="true">
      {bars.map((b, i) => (
        <div className="bar" key={b.label}>
          <span className="vl">
            {b.value.toLocaleString('pt-BR')}
            {mode === 'area' ? '%' : ''}
          </span>
          <span
            className={`col tone-${i % PALETTE.length}`}
            style={{ height: `${(Math.max(b.value, 0) / max) * 100}%` }}
          />
          <span className="lb">{b.label}</span>
        </div>
      ))}
    </div>
  )
}

function DataTable({
  caption,
  firstColumn,
  secondColumn,
  rows,
  suffix = '',
}: {
  caption: string
  firstColumn: string
  secondColumn: string
  rows: { label: string; value: number }[]
  suffix?: string
}) {
  return (
    <div className="chart-table-wrap">
      <table className="chart-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">{firstColumn}</th>
            <th scope="col">{secondColumn}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>
                {row.value.toLocaleString('pt-BR')}
                {suffix}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
