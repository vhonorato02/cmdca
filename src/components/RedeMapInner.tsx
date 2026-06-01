'use client'

import 'leaflet/dist/leaflet.css'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'

export type MapPoint = {
  id: string | number
  nome: string
  lat: number
  lng: number
  color: string
  endereco?: string | null
  telefone?: string | null
}

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
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%', minHeight: 360 }}
    >
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
            <b>{p.nome}</b>
            {p.endereco ? (
              <>
                <br />
                {p.endereco}
              </>
            ) : null}
            {p.telefone ? (
              <>
                <br />
                {p.telefone}
              </>
            ) : null}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
