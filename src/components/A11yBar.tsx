'use client'

import { useCallback } from 'react'

/**
 * Barra de acessibilidade (portada da prévia): ajuste de fonte (--fs),
 * alto contraste (html.contrast) e atalho para o VLibras. Persiste a escolha
 * em localStorage; o script inline no <head> reaplica antes da pintura.
 */
export function A11yBar() {
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
        <button type="button" onClick={toggleContrast} aria-pressed={false}>
          Alto contraste
        </button>
        <button type="button" onClick={openVLibras} title="Tradução para Libras">
          VLibras
        </button>
      </div>
    </div>
  )
}
