'use client'

import { useState } from 'react'

export type Voz = { frase: string; autor: string; papel?: string | null }

export function Vozes({ vozes }: { vozes: Voz[] }) {
  const [cur, setCur] = useState(0)
  const n = vozes.length

  if (!n) return null

  const activeIndex = Math.min(cur, n - 1)

  return (
    <section className="voices" aria-label="Vozes da comunidade" aria-roledescription="carrossel">
      <div className="orb" aria-hidden="true" />
      <p className="sr-only" aria-live="polite">
        Relato {activeIndex + 1} de {n}
      </p>
      {vozes.map((v, i) => (
        <figure
          className={i === activeIndex ? 'vc on' : 'vc'}
          key={`${v.autor}-${v.frase}`}
          hidden={i !== activeIndex}
          aria-label={`${i + 1} de ${n}`}
          aria-roledescription="slide"
        >
          <q>{v.frase}</q>
          <figcaption className="who">
            <b>{v.autor}</b>
            {v.papel ? <span>{v.papel}</span> : null}
          </figcaption>
        </figure>
      ))}
      {n > 1 ? (
        <div className="voice-controls" role="group" aria-label="Controles dos relatos">
          <button
            type="button"
            className="voice-arrow"
            aria-label="Relato anterior"
            onClick={() => setCur((activeIndex - 1 + n) % n)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <div className="v-dots">
            {vozes.map((v, i) => (
              <button
                type="button"
                key={`${v.autor}-${i}`}
                className={i === activeIndex ? 'on' : undefined}
                aria-current={i === activeIndex ? 'true' : undefined}
                aria-label={`Mostrar relato ${i + 1}, de ${v.autor}`}
                onClick={() => setCur(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="voice-arrow"
            aria-label="Próximo relato"
            onClick={() => setCur((activeIndex + 1) % n)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : null}
    </section>
  )
}
