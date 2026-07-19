import type { CSSProperties } from 'react'

export type StatItem = { value: number; label: string }

/** Indicadores legíveis imediatamente, inclusive com movimento reduzido ou sem JavaScript. */
export function StatsBand({
  stats,
  className,
  style,
}: {
  stats: StatItem[]
  className?: string
  style?: CSSProperties
}) {
  return (
    <dl className={className ? `stats ${className}` : 'stats'} style={style}>
      {stats.map((s) => (
        <div className="stat" key={s.label}>
          <dd>
            <b>{s.value.toLocaleString('pt-BR')}</b>
          </dd>
          <dt>
            <span>{s.label}</span>
          </dt>
        </div>
      ))}
    </dl>
  )
}
