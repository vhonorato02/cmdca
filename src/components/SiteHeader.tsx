'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV = [
  { href: '/', label: 'Início' },
  { href: '/conselho', label: 'O Conselho' },
  { href: '/reunioes', label: 'Reuniões' },
  { href: '/transparencia', label: 'Transparência' },
  { href: '/noticias', label: 'Notícias' },
  { href: '/participe', label: 'Participe' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className={scrolled ? 'top scrolled' : 'top'}>
      <div className="wrap">
        <Link className="brand" href="/" aria-label="CMDCA Pindamonhangaba — início">
          <span className="mk">
            <Image src="/brand/emblema.jpg" alt="Brasão do CMDCA" width={40} height={40} priority />
          </span>
          <span className="t">
            <b>CMDCA</b>
            <span>Pindamonhangaba</span>
          </span>
        </Link>
        <Link className="help-link mobile-help" href="/ajuda">
          Ajuda
        </Link>
        <nav className={open ? 'main open' : 'main'} id="nav">
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
            Preciso de ajuda
          </Link>
        </nav>
        <button
          type="button"
          className="burger"
          aria-label="Abrir menu"
          aria-expanded={open}
          aria-controls="nav"
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="icn" viewBox="0 0 24 24">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}
