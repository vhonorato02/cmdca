'use client'

import { useEffect, useState } from 'react'

export type Voz = { frase: string; autor: string; papel?: string | null }

export function Vozes({ vozes }: { vozes: Voz[] }) {
  const [cur, setCur] = useState(0)
  const n = vozes.length

  useEffect(() => {
    if (n <= 1) return
    const t = setInterval(() => setCur((c) => (c + 1) % n), 7000)
    return () => clearInterval(t)
  }, [n])

  if (!n) return null

  return (
    <div className="voices">
      <div className="orb" />
      {vozes.map((v, i) => (
        <div className={i === cur ? 'vc on' : 'vc'} key={i}>
          <q>{v.frase}</q>
          <div className="who">
            <b>{v.autor}</b>
            <span>{v.papel}</span>
          </div>
        </div>
      ))}
      <div className="v-dots">
        {vozes.map((_, i) => (
          <button
            key={i}
            className={i === cur ? 'on' : undefined}
            aria-label={`Depoimento ${i + 1}`}
            onClick={() => setCur(i)}
          />
        ))}
      </div>
    </div>
  )
}
