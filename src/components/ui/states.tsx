import type { ReactNode } from 'react'

import { Alert, Document } from './icons'

/** Lista vazia: explica o motivo e oferece o próximo passo. */
export function EmptyState({
  title,
  children,
  action,
  as: Heading = 'h2',
}: {
  title: string
  children?: ReactNode
  action?: ReactNode
  as?: 'h2' | 'h3'
}) {
  return (
    <div className="state">
      <Document className="state__icon" />
      <Heading className="state__title">{title}</Heading>
      {children ? <div>{children}</div> : null}
      {action}
    </div>
  )
}

/** Falha ao carregar: diz o que houve e como seguir, sem jargão. */
export function ErrorState({
  title,
  children,
  action,
}: {
  title: string
  children?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="state state--error" role="alert">
      <Alert className="state__icon" />
      <h2 className="state__title">{title}</h2>
      {children ? <div>{children}</div> : null}
      {action}
    </div>
  )
}

/** Marcador de carregamento; o texto é anunciado uma única vez. */
export function Skeleton({ lines = 3, label = 'Carregando…' }: { lines?: number; label?: string }) {
  return (
    <div aria-busy="true" role="status">
      <span className="sr-only">{label}</span>
      <span className="skeleton skeleton--title" aria-hidden="true" />
      {Array.from({ length: lines }, (_, index) => (
        <span
          key={index}
          className="skeleton skeleton--line"
          style={{ width: `${92 - index * 11}%` }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export function Callout({
  title,
  tone = 'info',
  children,
  as: Heading = 'h2',
}: {
  title?: string
  tone?: 'info' | 'signal' | 'warning' | 'danger'
  children: ReactNode
  as?: 'h2' | 'h3'
}) {
  return (
    <aside className={`callout${tone === 'info' ? '' : ` callout--${tone}`}`}>
      {title ? <Heading className="callout__title">{title}</Heading> : null}
      <div>{children}</div>
    </aside>
  )
}

/** Esqueleto de página de lista, usado nos `loading.tsx` das rotas dinâmicas. */
export function ListPageSkeleton({ label }: { label: string }) {
  return (
    <>
      <div className="page-header">
        <div className="wrap page-header__inner">
          <Skeleton lines={2} label={label} />
        </div>
      </div>
      <div className="section" aria-hidden="true">
        <div className="wrap">
          {[0, 1, 2].map((item) => (
            <span key={item} className="skeleton skeleton--row" />
          ))}
        </div>
      </div>
    </>
  )
}
