'use client'

import { useCallback, useSyncExternalStore } from 'react'

/** Assina mudanças na classe do <html> para refletir o alto contraste. */
function subscribeContrast(onChange: () => void) {
  const mo = new MutationObserver(onChange)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => mo.disconnect()
}
const getContrast = () => document.documentElement.classList.contains('contrast')

/**
 * Barra de acessibilidade (portada da prévia): ajuste de fonte (--fs),
 * alto contraste (html.contrast) e atalho para o VLibras. Persiste a escolha
 * em localStorage; o script inline no <head> reaplica antes da pintura.
 */
export function A11yBar() {
  // Estado real do alto contraste (lido da classe do <html>, aplicada pelo script
  // inline a partir do localStorage) para o aria-pressed correto no leitor de tela.
  const contrast = useSyncExternalStore(subscribeContrast, getContrast, () => false)

  const fontStep = useCallback((d: number) => {
    const root = document.documentElement
    const current = parseInt(getComputedStyle(root).getPropertyValue('--fs'), 10) || 100
    const fs = Math.max(85, Math.min(135, current + d * 8))
    root.style.setProperty('--fs', fs + '%')
    try {
      localStorage.setItem('cmdca-fs', String(fs))
    } catch {
      /* ignora */
    }
  }, [])

  const toggleContrast = useCallback(() => {
    // Alterna a classe; o useSyncExternalStore detecta a mudança e re-renderiza.
    const on = document.documentElement.classList.toggle('contrast')
    try {
      localStorage.setItem('cmdca-contrast', on ? '1' : '0')
    } catch {
      /* ignora */
    }
  }, [])

  const openVLibras = useCallback(() => {
    const btn = document.querySelector('[vw-access-button]') as HTMLElement | null
    btn?.click()
  }, [])

  return (
    <div className="a11y">
      <div className="wrap">
        <span className="lbl">Acessibilidade</span>
        <button type="button" onClick={() => fontStep(-1)} aria-label="Diminuir tamanho da fonte">
          A−
        </button>
        <button type="button" onClick={() => fontStep(1)} aria-label="Aumentar tamanho da fonte">
          A+
        </button>
        <button type="button" onClick={toggleContrast} aria-pressed={contrast}>
          Alto contraste
        </button>
        <button type="button" onClick={openVLibras} title="Tradução para Libras">
          VLibras
        </button>
      </div>
    </div>
  )
}
