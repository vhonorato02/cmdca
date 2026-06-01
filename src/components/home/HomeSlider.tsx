'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

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
  const go = useCallback((i: number) => setCur((i + n) % n), [n])

  useEffect(() => {
    if (n <= 1) return
    const t = setInterval(() => setCur((c) => (c + 1) % n), 6000)
    return () => clearInterval(t)
  }, [n])

  if (!n) return null

  return (
    <div className="slider" id="slider">
      {slides.map((d, i) => {
        const href = d.cta?.href || ''
        const isInternal = href.startsWith('/')
        return (
          <div className={i === cur ? 'slide on' : 'slide'} key={i}>
            <div className="vis">
              <Illustration theme={d.tema || 'cidade'} />
              <span className="credit">ilustração CMDCA</span>
            </div>
            <div className="txt">
              {d.kicker ? <span className="kick">{d.kicker}</span> : null}
              <h1>{d.titulo}</h1>
              {d.texto ? <p>{d.texto}</p> : null}
              {d.cta?.label && href ? (
                <div>
                  {isInternal ? (
                    <Link className="btn ghost-w" href={href}>
                      {d.cta.label}
                    </Link>
                  ) : (
                    <a className="btn ghost-w" href={href} target="_blank" rel="noopener noreferrer">
                      {d.cta.label}
                    </a>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )
      })}
      <button className="sl-arrow prev" aria-label="Slide anterior" onClick={() => go(cur - 1)}>
        <svg className="icn" viewBox="0 0 24 24">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <button className="sl-arrow next" aria-label="Próximo slide" onClick={() => go(cur + 1)}>
        <svg className="icn" viewBox="0 0 24 24">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
      <div className="sl-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={i === cur ? 'on' : undefined}
            aria-label={`Ir para o slide ${i + 1}`}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  )
}
