'use client'

import { useId, useState } from 'react'

const MAX = 20000
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const integer = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 })
const percent = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })

/** Estimativa da destinação na declaração. Textos e percentual vêm do CMS. */
export function SimuladorIR({
  titulo,
  texto,
  percentual,
}: {
  titulo: string
  texto: string
  percentual: number
}) {
  const [value, setValue] = useState(3000)
  const numberId = useId()
  const noteId = useId()
  const rate = Math.max(0, Math.min(percentual, 6))
  const destino = value * (rate / 100)

  const update = (next: number) => setValue(Number.isFinite(next) ? Math.max(0, Math.min(MAX, next)) : 0)

  return (
    <div className="sim">
      <div className="sim__text">
        <h2>{titulo}</h2>
        <p>{texto}</p>
      </div>
      <div className="sim__box">
        <div className="sim__row">
          <label htmlFor={numberId}>Seu imposto devido</label>
          <span className="sim__number">
            <span aria-hidden="true">R$</span>
            <input
              id={numberId}
              type="number"
              inputMode="numeric"
              min={0}
              max={MAX}
              step={100}
              value={value}
              onChange={(event) => update(event.currentTarget.valueAsNumber)}
              aria-describedby={noteId}
            />
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={MAX}
          step={100}
          value={value}
          onChange={(event) => update(event.currentTarget.valueAsNumber)}
          aria-label="Imposto de renda devido"
          aria-valuetext={`R$ ${integer.format(value)}`}
          aria-describedby={noteId}
        />
        <output className="sim-out" htmlFor={numberId} aria-live="polite">
          Você pode destinar até <b>{currency.format(destino)}</b>
        </output>
        <p className="sim__note" id={noteId}>
          Estimativa com {percent.format(rate)}% do imposto devido. O limite real depende da sua
          declaração e das regras do ano; confirme com a Receita Federal.
        </p>
      </div>
    </div>
  )
}
