import type { ReactNode } from 'react'

/**
 * Seção com título h2 opcional, apresentação e ação à direita. `alt` aplica o
 * fundo de apoio para alternar o ritmo entre blocos.
 */
export function Section({
  id,
  title,
  lead,
  action,
  alt,
  className,
  children,
}: {
  id?: string
  title?: string
  lead?: ReactNode
  action?: ReactNode
  alt?: boolean
  className?: string
  children: ReactNode
}) {
  const headingId = id ? `${id}-titulo` : undefined
  return (
    <section
      id={id}
      className={['section', alt ? 'section--alt' : null, className].filter(Boolean).join(' ')}
      aria-labelledby={title ? headingId : undefined}
    >
      <div className="wrap">
        {title ? (
          <div className="section-head">
            <div className="section-head__text">
              <h2 id={headingId}>{title}</h2>
              {lead ? <p className="section-head__lead">{lead}</p> : null}
            </div>
            {action}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  )
}
