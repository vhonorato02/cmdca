'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { Close, Menu } from '@/components/ui/icons'
import type { Canal } from '@/lib/content'
import type { NavigationLink } from '@/lib/navigation'

const MOBILE = '(max-width: 899.98px)'
const FOCUSABLE = 'a[href], button:not([disabled])'

/**
 * Navegação principal. No celular vira um painel que prende o foco enquanto
 * aberto, fecha com Esc (devolvendo o foco ao botão) e expõe `aria-expanded`.
 */
export function MainNav({
  links,
  canais,
  chamada,
}: {
  links: NavigationLink[]
  canais: Canal[]
  chamada: string
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    const nav = navRef.current
    const button = buttonRef.current
    const media = window.matchMedia(MOBILE)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const frame = requestAnimationFrame(() => nav?.querySelector<HTMLElement>(FOCUSABLE)?.focus())

    const close = (restoreFocus: boolean) => {
      setOpen(false)
      if (restoreFocus) button?.focus()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close(true)
        return
      }
      if (event.key !== 'Tab' || !nav || !button) return
      const items = [button, ...nav.querySelectorAll<HTMLElement>(FOCUSABLE)]
      const index = items.indexOf(document.activeElement as HTMLElement)
      if (event.shiftKey && index <= 0) {
        event.preventDefault()
        items[items.length - 1].focus()
      } else if (!event.shiftKey && (index === -1 || index === items.length - 1)) {
        event.preventDefault()
        items[0].focus()
      }
    }
    const onMediaChange = () => {
      if (!media.matches) close(false)
    }

    document.addEventListener('keydown', onKeyDown)
    media.addEventListener('change', onMediaChange)
    return () => {
      cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      media.removeEventListener('change', onMediaChange)
    }
  }, [open])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="menu-toggle burger"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
        aria-controls="nav"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <Close /> : <Menu />}
        <span aria-hidden="true">Menu</span>
      </button>
      <nav
        ref={navRef}
        id="nav"
        className={open ? 'site-nav is-open' : 'site-nav'}
        aria-label="Navegação principal"
      >
        <ul className="site-nav__list">
          {links.map((item) => {
            const external = /^https:\/\//i.test(item.href)
            const active = !external && isActive(item.href)
            return (
              <li key={`${item.href}-${item.label}`}>
                {external ? (
                  <a
                    className="site-nav__link"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                ) : (
                  <Link
                    className="site-nav__link"
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
        <Link
          className="btn btn--signal site-nav__help"
          href="/ajuda"
          aria-current={isActive('/ajuda') ? 'page' : undefined}
          onClick={() => setOpen(false)}
        >
          Buscar ajuda
        </Link>
        {canais.length ? (
          <div className="site-nav__channels">
            <p>{chamada}</p>
            <div className="actions">
              {canais.map((canal) => (
                <a
                  key={`${canal.tipo}-${canal.numero}`}
                  className={`btn btn--sm ${canal.tipo === 'emergencia' ? 'btn--danger' : 'btn--primary'}`}
                  href={canal.href}
                >
                  {canal.rotulo}: {canal.numero}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </nav>
    </>
  )
}
