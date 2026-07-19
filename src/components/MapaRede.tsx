'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'

const RedeMapInner = dynamic(() => import('./RedeMapInner'), {
  ssr: false,
  loading: () => (
    <div className="map-loading" role="status">
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

const TIPO_LABEL = Object.fromEntries(TIPOS.map(({ t, label }) => [t, label]))

const phoneHref = (value: string) => {
  const number = value.replace(/[^\d+]/g, '')
  return number ? `tel:${number}` : undefined
}

const splitPhones = (value: string) => value.split(/\s*[·;]\s*/).filter(Boolean)

const directionsHref = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address}, Pindamonhangaba - SP`,
  )}`

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
      <div className="map-tools" role="group" aria-label="Filtrar locais por tipo">
        {TIPOS.map((x) => (
          <button
            type="button"
            key={x.t}
            className={filtro === x.t ? 'on' : undefined}
            aria-pressed={filtro === x.t}
            onClick={() => setFiltro(x.t)}
          >
            {x.label}
          </button>
        ))}
      </div>
      <p className="map-result-count" aria-live="polite">
        {visiveis.length} {visiveis.length === 1 ? 'local exibido' : 'locais exibidos'}
      </p>
      <div className="map-grid">
        <div className="svgmap">
          {comCoords.length ? (
            <RedeMapInner points={comCoords} center={CENTRO} zoom={13} />
          ) : (
            <div className="map-empty">
              O mapa não está disponível para este filtro — consulte a lista de serviços ao lado.
            </div>
          )}
        </div>
        <div className="places" aria-labelledby="places-title">
          <h3 className="sr-only" id="places-title">
            Lista de locais da rede de proteção
          </h3>
          {visiveis.length === 0 ? (
            <p className="empty-state">Nenhum ponto neste filtro.</p>
          ) : (
            <ul className="places-list">
              {visiveis.map((p) => (
                <li className="place" key={p.id}>
                  <h3>
                    <span
                      className="dot"
                      style={{ background: TIPO_COR[p.tipo] || TIPO_COR.outro }}
                      aria-hidden="true"
                    />
                    {p.nome}
                  </h3>
                  <span className="place-kind">{TIPO_LABEL[p.tipo] || 'Outro serviço'}</span>
                  {p.endereco ? <p>{p.endereco}</p> : null}
                  {p.telefone ? (
                    <div className="ph">
                      {splitPhones(p.telefone).map((phone, index) => (
                        <span key={`${phone}-${index}`}>
                          {index ? <span aria-hidden="true"> · </span> : null}
                          <a href={phoneHref(phone)}>{phone}</a>
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {p.endereco ? (
                    <a
                      className="place-route"
                      href={directionsHref(p.endereco)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver rota no mapa <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
