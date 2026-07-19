import { ImageResponse } from 'next/og'

export const alt = 'CMDCA de Pindamonhangaba: proteção, participação e transparência'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'stretch',
        background: '#f5f1e8',
        color: '#211f4b',
        display: 'flex',
        fontFamily: 'Arial, sans-serif',
        height: '100%',
        width: '100%',
      }}
    >
      <div style={{ background: '#211f4b', display: 'flex', width: 72 }} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 82px 68px',
          width: '100%',
        }}
      >
        <div
          style={{
            color: '#8b6f00',
            display: 'flex',
            fontSize: 25,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          Conselho municipal de direitos
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Georgia, serif',
              fontSize: 68,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.02,
              maxWidth: 920,
            }}
          >
            CMDCA de Pindamonhangaba
          </div>
          <div style={{ color: '#4f4b65', display: 'flex', fontSize: 30, lineHeight: 1.3 }}>
            Proteção, participação e transparência para crianças e adolescentes.
          </div>
        </div>
        <div style={{ background: '#c8a62a', display: 'flex', height: 8, width: 250 }} />
      </div>
    </div>,
    size,
  )
}
