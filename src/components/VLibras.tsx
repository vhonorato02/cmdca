'use client'

import Script from 'next/script'

/**
 * Widget oficial VLibras (tradução para Libras). Os atributos vw/* são
 * personalizados do plugin; passados via spread para não conflitar com o TS.
 */
export function VLibras() {
  return (
    <>
      <div {...{ vw: 'true' }} className="enabled">
        <div {...{ 'vw-access-button': 'true' }} className="active" />
        <div {...{ 'vw-plugin-wrapper': 'true' }}>
          <div className="vw-plugin-top-wrapper" />
        </div>
      </div>
      <Script
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="afterInteractive"
        onLoad={() => {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            new (window as any).VLibras.Widget('https://vlibras.gov.br/app')
          } catch {
            /* widget indisponível offline; ignora */
          }
        }}
      />
    </>
  )
}
