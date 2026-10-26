import type { ReactNode } from 'react'

import type { StatusInfo } from '../officialActs'

/**
 * Lista de atos oficiais e reuniões. Cada item destaca um numeral (número do
 * ato ou dia da reunião) em Archivo condensada: a assinatura "numerais de ato".
 */
export function ActList({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <ul className="act-list" aria-label={label}>
      {children}
    </ul>
  )
}

export function ActItem({
  id,
  numeral,
  numeralLabel,
  numeralDateTime,
  title,
  headingLevel = 2,
  badges,
  meta,
  actions,
  children,
}: {
  id?: string
  numeral: string
  numeralLabel?: string
  numeralDateTime?: string
  title: string
  headingLevel?: 2 | 3
  badges?: ReactNode
  meta?: ReactNode
  actions?: ReactNode
  children?: ReactNode
}) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2'
  const isCode = numeral.length > 4
  return (
    <li className="act" id={id}>
      <div className="act__num">
        <b className={isCode ? 'is-code' : undefined}>{numeral}</b>
        {numeralLabel ? (
          numeralDateTime ? (
            <time dateTime={numeralDateTime}>{numeralLabel}</time>
          ) : (
            <span>{numeralLabel}</span>
          )
        ) : null}
      </div>
      <div className="act__body">
        <Heading className="act__title">{title}</Heading>
        {badges ? <div className="act__badges">{badges}</div> : null}
        {meta}
        {children}
      </div>
      {actions ? <div className="act__actions">{actions}</div> : null}
    </li>
  )
}

export function StatusPill({ status }: { status: StatusInfo }) {
  return (
    <span className={`pill status-${status.tone}`}>
      <span className="sr-only">Situação: </span>
      {status.label}
    </span>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="pill">{children}</span>
}
