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
 * Widget oficial VLibras (tradução para Libras). A versão atual do plugin cria
 * o próprio botão flutuante em shadow DOM (#vlibras-access-wrapper) e expõe
 * window.VLibrasWidget.open(), usado pela barra de acessibilidade.
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
  )
}
