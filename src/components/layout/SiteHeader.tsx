import { AppLink as Link } from '@/components/ui/AppLink'

import { Emblem } from '@/components/ui/brand'
import type { NavigationLink } from '@/lib/navigation'

import { MainNav } from './MainNav'

export function SiteHeader({ links }: { links: NavigationLink[] }) {
  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <Link className="brand" href="/">
          <Emblem className="brand__mark" />
          <span className="brand__text">
            <span className="brand__name">CMDCA</span>{' '}
            <span className="brand__place">Pindamonhangaba</span>
            <span className="sr-only">, página inicial</span>
          </span>
        </Link>
        <MainNav links={links} />
      </div>
    </header>
  )
}
