'use client'

import Script from 'next/script'
import { useEffect } from 'react'

type TranslationWindow = Window & {
  VLibras?: { Widget: new (url: string) => unknown }
}

function markTranslationState(state: 'ready' | 'error') {
  document.documentElement.dataset.translationState = state
}

/**
 * Widget oficial VLibras (tradução para Libras). Os atributos vw/* são
 * personalizados do plugin; passados via spread para não conflitar com o TS.
 */
export function VLibras() {
  useEffect(() => {
    // The widget adds its own floating wrapper outside the React container.
    const labelWidget = () => {
      const wrapper = document.getElementById('vlibras-access-wrapper')
      if (wrapper) {
        wrapper.setAttribute('role', 'region')
        wrapper.setAttribute('aria-label', 'Tradução para Libras')
      }
    }
    labelWidget()
    const observer = new MutationObserver(labelWidget)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])
  return (
    <>
      <div {...{ vw: 'true' }} className="enabled" role="region" aria-label="Tradutor VLibras">
        <div {...{ 'vw-access-button': 'true' }} className="active" />
        <div {...{ 'vw-plugin-wrapper': 'true' }}>
          <div className="vw-plugin-top-wrapper" />
        </div>
      </div>
      <Script
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="afterInteractive"
        onError={() => markTranslationState('error')}
        onLoad={() => {
          try {
            const widget = (window as TranslationWindow).VLibras?.Widget
            if (!widget) throw new Error('VLibras indisponível')
            new widget('https://vlibras.gov.br/app')
            markTranslationState('ready')
          } catch {
            markTranslationState('error')
          }
        }}
      />
    </>
  )
}
