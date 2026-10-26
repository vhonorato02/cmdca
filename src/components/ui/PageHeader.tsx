import Link from 'next/link'
import type { ReactNode } from 'react'

import { Orbit } from './brand'

export type Crumb = { label: string; href?: string }

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumb" aria-label="Você está em">
      <ol>
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`}>
              {item.href && !last ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={last ? 'page' : undefined}>{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/**
 * Cabeçalho das páginas internas: trilha, título único (h1), apresentação e a
 * órbita da marca. A faixa amarela inferior repete a faixa do logo.
 */
export function PageHeader({
  title,
  lead,
  crumbs,
  meta,
  children,
}: {
  title: string
  lead?: ReactNode
  crumbs?: Crumb[]
  meta?: ReactNode
  children?: ReactNode
}) {
  return (
    <header className="page-header">
      <Orbit className="page-header__orbit" strokeWidth={2} />
      <div className="wrap page-header__inner">
        <Breadcrumb items={[{ label: 'Início', href: '/' }, ...(crumbs ?? []), { label: title }]} />
        <h1 className="page-header__title">{title}</h1>
        {lead ? <p className="page-header__lead">{lead}</p> : null}
        {meta ? <p className="page-header__meta">{meta}</p> : null}
        {children}
      </div>
    </header>
  )
}
