'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

import type { MapPoint } from './RedeMapInner'

// Leaflet e os blocos do OpenStreetMap só carregam quando a pessoa pede o mapa.
const RedeMapInner = dynamic(() => import('./RedeMapInner'), {
  ssr: false,
  loading: () => (
    <p className="muted" role="status">
      Carregando mapa…
    </p>
  ),
})

// Centro de Pindamonhangaba.
const CENTRO: [number, number] = [-22.92389, -45.46167]

export function MapaRede({ pontos }: { pontos: MapPoint[] }) {
  const [visible, setVisible] = useState(false)
  if (!pontos.length) return null
  return (
    <div className="map-panel">
      {visible ? (
        <>
          <p className="muted">
            Os pontos são aproximados. Confirme endereço e horário antes de sair.
          </p>
          <div className="map-panel__frame" id="mapa-rede">
            <RedeMapInner points={pontos} center={CENTRO} zoom={13} />
          </div>
        </>
      ) : (
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => setVisible(true)}
        >
          Ver os endereços no mapa
        </button>
      )}
    </div>
  )
}
