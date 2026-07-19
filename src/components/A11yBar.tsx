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
    const fs = Math.max(90, Math.min(130, current + d * 10))
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
    <aside className="a11y" aria-label="Recursos de acessibilidade">
      <div className="wrap">
        <span className="lbl">Acessibilidade</span>
        <button type="button" onClick={() => fontStep(-1)} aria-label="Diminuir tamanho da fonte">
          A−
        </button>
        <button type="button" onClick={() => fontStep(1)} aria-label="Aumentar tamanho da fonte">
          A+
        </button>
        <button
          type="button"
          onClick={toggleContrast}
          aria-pressed={contrast}
          aria-label={contrast ? 'Desativar alto contraste' : 'Ativar alto contraste'}
        >
          Contraste
        </button>
        <button type="button" onClick={openVLibras} aria-label="Abrir tradução para Libras">
          VLibras
        </button>
      </div>
    </aside>
  )
}
