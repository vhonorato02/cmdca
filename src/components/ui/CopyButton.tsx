'use client'

import { useEffect, useState } from 'react'

import { Check, Copy } from './icons'

/** Copia um dado (CNPJ, conta) com um toque e confirma na própria tela. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [state, setState] = useState<'idle' | 'ok' | 'erro'>('idle')

  useEffect(() => {
    if (state === 'idle') return
    const timer = window.setTimeout(() => setState('idle'), 2500)
    return () => window.clearTimeout(timer)
  }, [state])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setState('ok')
    } catch {
      setState('erro')
    }
  }

  return (
    <button
      type="button"
      className={`copy-btn${state === 'ok' ? ' is-done' : ''}`}
      onClick={copy}
      aria-label={`Copiar ${label}`}
    >
      {state === 'ok' ? <Check /> : <Copy />}
      <span aria-hidden="true">{state === 'ok' ? 'Copiado' : 'Copiar'}</span>
      <span className="sr-only" role="status">
        {state === 'ok' ? `${label} copiado` : state === 'erro' ? 'Não foi possível copiar. Selecione o texto.' : ''}
      </span>
    </button>
  )
}
