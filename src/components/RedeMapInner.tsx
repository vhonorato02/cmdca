'use client'

import 'leaflet/dist/leaflet.css'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'

import { phoneHref } from '@/lib/contact'

export type MapPoint = {
  id: string | number
  nome: string
  lat: number
  lng: number
  color: string
  endereco?: string | null
  telefone?: string | null
}

const splitPhones = (value: string) => value.split(/\s*[·;]\s*/).filter(Boolean)

const directionsHref = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address}, Pindamonhangaba - SP`,
  )}`

export default function RedeMapInner({
  points,
  center,
  zoom,
}: {
  points: MapPoint[]
  center: [number, number]
  zoom: number
}) {
  return (
    <div className="leaflet-region" role="region" aria-label="Mapa interativo da rede de proteção">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="rede-map">
        <TileLayer
          attribution='&copy; colaboradores do <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={10}
            pathOptions={{ color: '#fff', weight: 2.5, fillColor: p.color, fillOpacity: 1 }}
          >
            <Popup>
              <strong>{p.nome}</strong>
              {p.endereco ? (
                <>
                  <br />
                  <a href={directionsHref(p.endereco)} target="_blank" rel="noopener noreferrer">
                    {p.endereco}
                  </a>
                </>
              ) : null}
              {p.telefone ? (
                <>
                  <br />
                  {splitPhones(p.telefone).map((phone, index) => (
                    <span key={`${phone}-${index}`}>
                      {index ? <span aria-hidden="true"> · </span> : null}
                      <a href={phoneHref(phone)}>{phone}</a>
                    </span>
                  ))}
                </>
              ) : null}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
