'use client'

import { useId, useState } from 'react'

type Props = {
  percentual?: number
  eyebrow?: string
  titulo?: string
  texto?: string
}

const fmt = (x: number, dec = 0) =>
  x.toLocaleString(
    'pt-BR',
    dec ? { minimumFractionDigits: dec, maximumFractionDigits: dec } : undefined,
  )

export function SimuladorIR({
  percentual = 6,
  eyebrow = 'Imposto que vira projeto',
  titulo = 'Parte do seu Imposto de Renda pode ficar em Pindamonhangaba.',
  texto = 'Pessoas físicas e empresas podem destinar parte do imposto devido ao FMDCA. O recurso permanece na cidade, financiando projetos locais para a infância.',
}: Props) {
  const [v, setV] = useState(3000)
  const numberId = useId()
  const rangeId = useId()
  const noteId = useId()
  const safePercentual = Math.max(percentual, 0)
  const destino = v * (safePercentual / 100)

  const updateValue = (value: number) => {
    if (!Number.isFinite(value)) {
      setV(0)
      return
    }
    setV(Math.max(0, Math.min(20000, value)))
  }

  return (
    <div className="sim">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h3>{titulo}</h3>
        <p>{texto}</p>
      </div>
      <div className="sim-box">
        <div className="sim-value-row">
          <label htmlFor={numberId}>Seu imposto devido</label>
          <div className="sim-number">
            <span aria-hidden="true">R$</span>
            <input
              id={numberId}
              type="number"
              inputMode="numeric"
              min={0}
              max={20000}
              step={100}
              value={v}
              onChange={(event) => updateValue(event.currentTarget.valueAsNumber)}
              aria-describedby={noteId}
            />
          </div>
        </div>
        <input
          id={rangeId}
          type="range"
          min={0}
          max={20000}
          step={100}
          value={v}
          onChange={(event) => updateValue(event.currentTarget.valueAsNumber)}
          aria-label="Imposto de renda devido"
          aria-valuetext={`R$ ${fmt(v)}`}
          aria-describedby={noteId}
        />
        <output className="sim-out" htmlFor={`${numberId} ${rangeId}`}>
          Você poderia destinar até <b>R$ {fmt(destino, 2)}</b>
        </output>
        <div className="sim-impact">
          <svg className="icn" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21C7 17.5 4 14 4 9.5 4 6.5 6.2 4.5 9 4.5c1.7 0 3 .9 3 .9s1.3-.9 3-.9c2.8 0 5 2 5 5C20 14 17 17.5 12 21Z" />
          </svg>
          <span>Estimativa calculada com {fmt(safePercentual, safePercentual % 1 ? 1 : 0)}%.</span>
        </div>
        <p className="sim-note" id={noteId}>
          Simulação informativa. O limite aplicável depende do tipo de contribuinte e das regras
          vigentes; confirme com seu contador ou com a Receita Federal.
        </p>
      </div>
    </div>
  )
}
