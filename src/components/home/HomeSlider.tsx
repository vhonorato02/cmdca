'use client'

import Link from 'next/link'
import { useState } from 'react'

import { Illustration } from '@/components/Illustration'

export type Slide = {
  kicker?: string | null
  titulo: string
  texto?: string | null
  cta?: { label?: string | null; href?: string | null } | null
  tema?: string | null
}

export function HomeSlider({ slides }: { slides: Slide[] }) {
  const [cur, setCur] = useState(0)
  const n = slides.length

  if (!n) return null

  const activeIndex = Math.min(cur, n - 1)
  const go = (index: number) => setCur((index + n) % n)

  return (
    <section className="slider" id="slider" aria-label="Destaques" aria-roledescription="carrossel">
      <p className="sr-only" aria-live="polite">
        Destaque {activeIndex + 1} de {n}: {slides[activeIndex]?.titulo}
      </p>
      {slides.map((d, i) => {
        const href = d.cta?.href || ''
        const isInternal = href.startsWith('/')
        return (
          <article
            className={i === activeIndex ? 'slide on' : 'slide'}
            key={`${d.titulo}-${i}`}
            hidden={i !== activeIndex}
            inert={i !== activeIndex ? true : undefined}
            aria-label={`${i + 1} de ${n}`}
            aria-roledescription="slide"
          >
            <div className="txt">
              {d.kicker ? <span className="kick">{d.kicker}</span> : null}
              <h2>{d.titulo}</h2>
              {d.texto ? <p>{d.texto}</p> : null}
              {d.cta?.label && href ? (
                <div>
                  {isInternal ? (
                    <Link className="btn ghost-w" href={href}>
                      {d.cta.label}
                    </Link>
                  ) : (
                    <a
                      className="btn ghost-w"
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {d.cta.label} <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              ) : null}
            </div>
            <div className="vis" aria-hidden="true">
              <Illustration theme={d.tema || 'cidade'} />
              <span className="credit">ilustração CMDCA</span>
            </div>
          </article>
        )
      })}
      {n > 1 ? (
        <div className="slider-controls" role="group" aria-label="Controles dos destaques">
          <button
            type="button"
            className="sl-arrow prev"
            aria-label="Destaque anterior"
            onClick={() => go(activeIndex - 1)}
          >
            <svg className="icn" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <div className="sl-dots">
            {slides.map((slide, i) => (
              <button
                type="button"
                key={`${slide.titulo}-${i}`}
                className={i === activeIndex ? 'on' : undefined}
                aria-current={i === activeIndex ? 'true' : undefined}
                aria-label={`Ir para o destaque ${i + 1}: ${slide.titulo}`}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="sl-arrow next"
            aria-label="Próximo destaque"
            onClick={() => go(activeIndex + 1)}
          >
            <svg className="icn" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      ) : null}
    </section>
  )
}
