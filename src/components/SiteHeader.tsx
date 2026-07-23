'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const NAV = [
  { href: '/', label: 'Início' },
  { href: '/conselho', label: 'CMDCA' },
  { href: '/reunioes', label: 'Reuniões' },
  { href: '/transparencia', label: 'Transparência' },
  { href: '/noticias', label: 'Notícias' },
  { href: '/participe', label: 'Participe' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return

    const nav = navRef.current
    const menuButton = menuButtonRef.current
    const previousOverflow = document.body.style.overflow
    const isMobile = window.matchMedia('(max-width: 880px)').matches
    let focusFrame: number | undefined

    const closeMenu = (restoreFocus = false) => {
      setOpen(false)
      if (restoreFocus) menuButton?.focus()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu(true)
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return
      if (!nav?.contains(event.target) && !menuButton?.contains(event.target)) closeMenu()
    }

    if (isMobile) {
      document.body.style.overflow = 'hidden'
      focusFrame = requestAnimationFrame(() => nav?.querySelector<HTMLAnchorElement>('a')?.focus())
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)

    return () => {
      if (focusFrame !== undefined) cancelAnimationFrame(focusFrame)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header className={scrolled ? 'top scrolled' : 'top'}>
      <div className="wrap">
        <Link className="brand" href="/" aria-label="CMDCA Pindamonhangaba — página inicial">
          <span className="mk">
            <Image src="/brand/emblema.jpg" alt="Símbolo do CMDCA" width={40} height={40} priority />
          </span>
          <span className="t">
            <b>CMDCA</b>
            <span>Pindamonhangaba</span>
          </span>
        </Link>
        <Link className="help-link mobile-help" href="/ajuda">
          Buscar ajuda
        </Link>
        <nav
          ref={navRef}
          className={open ? 'main open' : 'main'}
          id="nav"
          aria-label="Navegação principal"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? 'active' : undefined}
              aria-current={isActive(item.href) ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link className="help-link" href="/ajuda" onClick={() => setOpen(false)}>
            Buscar ajuda
          </Link>
        </nav>
        <button
          ref={menuButtonRef}
          type="button"
          className="burger"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          aria-controls="nav"
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="icn" viewBox="0 0 24 24" aria-hidden="true">
            <path d={open ? 'M6 6l12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16'} />
          </svg>
        </button>
      </div>
    </header>
  )
}
