import { AppLink as Link } from '@/components/ui/AppLink'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { ExternalIcon } from './icons'

export type ButtonVariant = 'primary' | 'secondary' | 'signal' | 'danger'

type CommonProps = {
  variant?: ButtonVariant
  size?: 'md' | 'sm'
  className?: string
  children: ReactNode
}

const classes = ({ variant = 'primary', size = 'md', className }: Omit<CommonProps, 'children'>) =>
  ['btn', `btn--${variant}`, size === 'sm' ? 'btn--sm' : null, className].filter(Boolean).join(' ')

export const isExternalHref = (href: string) => /^https?:\/\//i.test(href)

/**
 * Link com aparência de botão. Caminhos internos usam <Link>; endereços
 * externos abrem em nova aba com `noopener` e um aviso para leitores de tela.
 */
export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  ariaLabel,
}: CommonProps & { href: string; ariaLabel?: string }) {
  const cls = classes({ variant, size, className })
  if (isExternalHref(href)) {
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
        {children}
        <ExternalIcon />
        {ariaLabel ? null : <span className="sr-only"> (abre em nova aba)</span>}
      </a>
    )
  }
  if (href.startsWith('tel:') || href.startsWith('mailto:')) {
    return (
      <a className={cls} href={href} aria-label={ariaLabel}>
        {children}
      </a>
    )
  }
  return (
    <Link className={cls} href={href} aria-label={ariaLabel}>
      {children}
    </Link>
  )
}

export function Button({
  variant,
  size,
  className,
  children,
  type = 'button',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={classes({ variant, size, className })} {...rest}>
      {children}
    </button>
  )
}

/** Link de texto que pode ser interno ou externo. */
export function SmartLink({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  if (isExternalHref(href)) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <ExternalIcon />
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
    )
  }
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  )
}
