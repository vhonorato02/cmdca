import Link from 'next/link'

import { Emblem } from '@/components/ui/brand'
import type { Canal } from '@/lib/content'
import type { NavigationLink } from '@/lib/navigation'

import { MainNav } from './MainNav'

export function SiteHeader({
  links,
  canais,
  chamada,
}: {
  links: NavigationLink[]
  canais: Canal[]
  chamada: string
}) {
  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <Link className="brand" href="/" aria-label="CMDCA Pindamonhangaba, página inicial">
          <Emblem className="brand__mark" />
          <span className="brand__text" aria-hidden="true">
            <span className="brand__name">CMDCA</span>
            <span className="brand__place">Pindamonhangaba</span>
          </span>
        </Link>
        <MainNav links={links} canais={canais} chamada={chamada} />
      </div>
    </header>
  )
}
