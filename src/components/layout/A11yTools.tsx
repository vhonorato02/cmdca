'use client'

import { AppLink as Link } from '@/components/ui/AppLink'
import { useCallback, useState, useSyncExternalStore } from 'react'

import { openVLibras } from '@/components/VLibras'

/** Assina mudanças na classe do <html> para refletir o alto contraste. */
function subscribeContrast(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}
const getContrast = () => document.documentElement.classList.contains('contrast')

const FONT_MIN = 90
const FONT_MAX = 130

/**
 * Recursos de acessibilidade do eMAG: tamanho da letra (--fs no <html>), alto
 * contraste (html.contrast) e atalho para o VLibras. As escolhas ficam no
 * localStorage e o script inline do layout as reaplica antes da pintura.
 */
export function A11yTools() {
  const [translationUnavailable, setTranslationUnavailable] = useState(false)
  const contrast = useSyncExternalStore(subscribeContrast, getContrast, () => false)

  const fontStep = useCallback((direction: number) => {
    const root = document.documentElement
    const current = Number.parseInt(getComputedStyle(root).getPropertyValue('--fs'), 10) || 100
    const next = Math.max(FONT_MIN, Math.min(FONT_MAX, current + direction * 10))
    root.style.setProperty('--fs', `${next}%`)
    try {
      localStorage.setItem('cmdca-fs', String(next))
    } catch {
      /* armazenamento indisponível: vale só nesta visita */
    }
  }, [])

  const toggleContrast = useCallback(() => {
    const on = document.documentElement.classList.toggle('contrast')
    try {
      localStorage.setItem('cmdca-contrast', on ? '1' : '0')
    } catch {
      /* armazenamento indisponível: vale só nesta visita */
    }
  }, [])

  const [translationLoading, setTranslationLoading] = useState(false)
  const openTranslation = useCallback(async () => {
    setTranslationUnavailable(false)
    setTranslationLoading(true)
    try {
      await openVLibras()
    } catch {
      setTranslationUnavailable(true)
    } finally {
      setTranslationLoading(false)
    }
  }, [])

  return (
    <>
      <div className="a11y-tools" role="group" aria-label="Recursos de acessibilidade">
        <span className="a11y-tools__label" aria-hidden="true">
          Acessibilidade
        </span>
        <button
          type="button"
          className="a11y-tools__btn"
          onClick={() => fontStep(-1)}
          aria-label="A- Diminuir tamanho da fonte"
        >
          A-
        </button>
        <button
          type="button"
          className="a11y-tools__btn"
          onClick={() => fontStep(1)}
          aria-label="A+ Aumentar tamanho da fonte"
        >
          A+
        </button>
        <button
          type="button"
          className="a11y-tools__btn"
          onClick={toggleContrast}
          aria-pressed={contrast}
          aria-label={contrast ? 'Desativar alto contraste' : 'Ativar alto contraste'}
        >
          Contraste
        </button>
        <button
          type="button"
          className="a11y-tools__btn"
          onClick={openTranslation}
          aria-busy={translationLoading}
          aria-label="VLibras: abrir tradução para Libras"
        >
          {translationLoading ? 'Carregando…' : 'Libras'}
        </button>
      </div>
      {translationUnavailable ? (
        <p role="status" className="a11y-status">
          O tradutor VLibras não respondeu. Tente de novo em instantes ou veja outras
          opções na <Link href="/acessibilidade">página de acessibilidade</Link>.
        </p>
      ) : null}
    </>
  )
}
