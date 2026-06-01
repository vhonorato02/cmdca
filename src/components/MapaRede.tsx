'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'

const RedeMapInner = dynamic(() => import('./RedeMapInner'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'grid', placeContent: 'center', minHeight: 360, color: 'var(--ink-2)' }}>
      Carregando mapa…
    </div>
  ),
})

export type Ponto = {
  id: string | number
  nome: string
  tipo: string
  endereco?: string | null
  telefone?: string | null
  lat?: number | null
  lng?: number | null
}

const TIPO_COR: Record<string, string> = {
  ct: '#262357',
  cras: '#1f7a4d',
  creas: '#9C2A22',
  casa: '#C9A227',
  outro: '#9a96c4',
}

const TIPOS = [
  { t: 'all', label: 'Todos' },
  { t: 'ct', label: 'Conselho Tutelar' },
  { t: 'cras', label: 'CRAS' },
  { t: 'creas', label: 'CREAS' },
  { t: 'casa', label: 'Casa dos Conselhos' },
]

// Centro de Pindamonhangaba (coordenadas reais do município).
const CENTRO: [number, number] = [-22.92389, -45.46167]

export function MapaRede({ pontos }: { pontos: Ponto[] }) {
  const [filtro, setFiltro] = useState('all')

  const visiveis = useMemo(
    () => pontos.filter((p) => filtro === 'all' || p.tipo === filtro),
    [pontos, filtro],
  )

  const comCoords = useMemo(
    () =>
      visiveis
        .filter((p) => typeof p.lat === 'number' && typeof p.lng === 'number')
        .map((p) => ({
          id: p.id,
          nome: p.nome,
          lat: p.lat as number,
          lng: p.lng as number,
          color: TIPO_COR[p.tipo] || TIPO_COR.outro,
          endereco: p.endereco,
          telefone: p.telefone,
        })),
    [visiveis],
  )

  return (
    <>
      <div className="map-tools">
        {TIPOS.map((x) => (
          <button
            key={x.t}
            className={filtro === x.t ? 'on' : undefined}
            onClick={() => setFiltro(x.t)}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div className="map-grid">
        <div className="svgmap" style={{ minHeight: 360 }}>
          {comCoords.length ? (
            <RedeMapInner points={comCoords} center={CENTRO} zoom={13} />
          ) : (
            <div
              style={{
                display: 'grid',
                placeContent: 'center',
                minHeight: 360,
                padding: 24,
                textAlign: 'center',
                color: 'var(--ink-2)',
                fontSize: '.9rem',
              }}
            >
              Coordenadas dos pontos a confirmar — consulte a lista ao lado.
            </div>
          )}
        </div>
        <div className="places">
          {visiveis.length === 0 ? (
            <p style={{ color: 'var(--ink-2)' }}>Nenhum ponto neste filtro.</p>
          ) : null}
          {visiveis.map((p) => (
            <div className="place" key={p.id}>
              <h4>
                <span className="dot" style={{ background: TIPO_COR[p.tipo] || TIPO_COR.outro }} />
                {p.nome}
              </h4>
              {p.endereco ? <p>{p.endereco}</p> : null}
              {p.telefone ? <div className="ph">{p.telefone}</div> : null}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
