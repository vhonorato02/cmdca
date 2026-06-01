'use client'

import { useEffect, useState } from 'react'

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

  const bars =
    mode === 'ano'
      ? serieAnual.map((s) => ({ label: s.ano, value: s.valor }))
      : aplicacaoPorArea.map((a) => ({ label: a.area, value: a.percentual }))
  const max = Math.max(...bars.map((b) => b.value), 1) * 1.15

  // Segmentos do donut (conic-gradient) sem mutação de acumulador.
  const parts = aplicacaoPorArea.map((a, i) => {
    const start = aplicacaoPorArea.slice(0, i).reduce((sum, x) => sum + x.percentual, 0)
    const end = start + a.percentual
    return `${PALETTE[i % PALETTE.length]} ${start}% ${end}%`
  })

  return (
    <>
      <div className="chart-tabs">
        <button className={mode === 'ano' ? 'on' : undefined} onClick={() => setMode('ano')}>
          Por ano
        </button>
        <button className={mode === 'area' ? 'on' : undefined} onClick={() => setMode('area')}>
          Por área
        </button>
      </div>
      <div className="chart-grid">
        <div className="panel">
          <h4>{mode === 'ano' ? 'Projetos apoiados por ano' : 'Aplicação por área'}</h4>
          <div className="cap">Atualizável no painel · ilustrativo</div>
          {/* key={mode} remonta para reanimar as barras ao trocar de aba */}
          <BarsChart key={mode} bars={bars} max={max} />
        </div>
        <div className="panel">
          <h4>Aplicação dos recursos do FMDCA</h4>
          <div className="cap">Distribuição por área · ilustrativo</div>
          <div className="donut-wrap">
            <div className="donut" style={{ background: `conic-gradient(${parts.join(',')})` }} />
            <div className="legend">
              {aplicacaoPorArea.map((a, i) => (
                <div key={i}>
                  <i style={{ background: PALETTE[i % PALETTE.length] }} />
                  {a.area} · {a.percentual}%
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function BarsChart({ bars, max }: { bars: { label: string; value: number }[]; max: number }) {
  const [grown, setGrown] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setGrown(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="bars">
      {bars.map((b, i) => (
        <div className="bar" key={i}>
          <span className="vl">{b.value}</span>
          <span className="col" style={{ height: grown ? `${(b.value / max) * 100}%` : '0%' }} />
          <span className="lb">{b.label}</span>
        </div>
      ))}
    </div>
  )
}
