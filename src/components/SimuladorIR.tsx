'use client'

import { useState } from 'react'

type Props = {
  percentual?: number
  eyebrow?: string
  titulo?: string
  texto?: string
}

const fmt = (x: number, dec = 0) =>
  x.toLocaleString('pt-BR', dec ? { minimumFractionDigits: dec, maximumFractionDigits: dec } : undefined)

export function SimuladorIR({
  percentual = 6,
  eyebrow = 'Imposto que vira projeto',
  titulo = 'Parte do seu Imposto de Renda pode ficar em Pindamonhangaba.',
  texto = 'Pessoas físicas e empresas podem destinar parte do imposto devido ao FMDCA. O recurso permanece na cidade, financiando projetos locais para a infância.',
}: Props) {
  const [v, setV] = useState(3000)
  const destino = v * (percentual / 100)
  const meses = Math.round(destino / 60)

  return (
    <div className="sim">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h3>{titulo}</h3>
        <p>{texto}</p>
      </div>
      <div className="sim-box">
        <label htmlFor="sim-ir-range">
          Seu imposto devido <b>R$ {fmt(v)}</b>
        </label>
        <input
          id="sim-ir-range"
          type="range"
          min={0}
          max={20000}
          step={100}
          value={v}
          onChange={(e) => setV(Number(e.target.value))}
          aria-label="Imposto de renda devido"
          aria-valuetext={`R$ ${fmt(v)}`}
        />
        <div className="sim-out" aria-live="polite">
          Você poderia destinar até<b>R$ {fmt(destino, 2)}</b>
        </div>
        <div className="sim-impact">
          <svg className="icn" viewBox="0 0 24 24">
            <path d="M12 21C7 17.5 4 14 4 9.5 4 6.5 6.2 4.5 9 4.5c1.7 0 3 .9 3 .9s1.3-.9 3-.9c2.8 0 5 2 5 5C20 14 17 17.5 12 21Z" />
          </svg>
          <span>
            {meses <= 0
              ? '—'
              : `≈ ${meses} ${meses === 1 ? 'mês' : 'meses'} de oficina para 1 criança`}
          </span>
        </div>
        <div className="sim-note">
          <span className="confirm">a confirmar</span> Percentual ilustrativo — confirme o limite
          legal com seu contador.
        </div>
      </div>
    </div>
  )
}
