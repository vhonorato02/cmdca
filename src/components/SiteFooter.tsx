import Image from 'next/image'
import Link from 'next/link'

import { phoneHref } from '@/lib/contact'
import type { NavigationLink } from '@/lib/navigation'
import { getSiteNavigation } from '@/lib/navigation'
import { getPayloadClient } from '@/lib/payload'
import { publicHref, publicText } from '@/lib/site'

const splitPhones = (value: string) => value.split(/\s*[·;]\s*/).filter(Boolean)

export async function SiteFooter() {
  const navigation = await getSiteNavigation()
  let casaTel: string | null = null
  let instagramUrl: string | null = null
  try {
    const payload = await getPayloadClient()
    const cfg = (await payload.findGlobal({ slug: 'configuracoes' })) as {
      contato?: { casaConselhosTelefone?: string | null }
      redes?: { instagramUrl?: string | null }
    }
    casaTel = publicText(cfg?.contato?.casaConselhosTelefone) || null
    instagramUrl = publicHref(cfg?.redes?.instagramUrl) || null
  } catch {
    /* usa fallback se o banco estiver indisponível */
  }

  const year = new Date().getFullYear()

  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <div className="fb">
            <div className="chip">
              <Image
                src="/brand/logo-cmdca.jpg"
                alt="CMDCA Pindamonhangaba"
                width={175}
                height={42}
                style={{ height: 'auto' }}
              />
            </div>
            <p>Conselho Municipal dos Direitos da Criança e do Adolescente de Pindamonhangaba.</p>
            {casaTel ? (
              <p className="footer-phones">
                {splitPhones(casaTel).map((phone, index) => (
                  <span key={`${phone}-${index}`}>
                    {index ? (
                      <span className="phone-separator" aria-hidden="true">
                        {' · '}
                      </span>
                    ) : null}
                    <a href={phoneHref(phone)}>{phone}</a>
                  </span>
                ))}
              </p>
            ) : null}
          </div>
          <nav aria-label="Navegação institucional">
            <h2>Navegação</h2>
            {navigation.rodapeInstitucional.map((item) => (
              <FooterLink key={`${item.href}-${item.label}`} item={item} />
            ))}
          </nav>
          <nav aria-label="Canais de proteção">
            <h2>Proteção</h2>
            <Link href="/ajuda">Buscar ajuda</Link>
            <Link href="/ajuda#emergencia">Disque 100 e emergência</Link>
            <Link href="/ajuda#conselhos-tutelares">Conselho Tutelar</Link>
            <Link href="/ajuda#rede">Rede de proteção</Link>
          </nav>
          <nav aria-label="Sobre o site">
            <h2>Sobre o site</h2>
            <Link href="/mapa-do-site">Mapa do site</Link>
            <Link href="/creditos">Créditos de imagens</Link>
            <Link href="/privacidade">Privacidade (LGPD)</Link>
            <Link href="/acessibilidade">Acessibilidade</Link>
            {instagramUrl ? (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                Instagram <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </nav>
        </div>
        <div className="foot-end">
          <span>© {year} CMDCA Pindamonhangaba</span>
          <Link href="/acessibilidade">Recursos de acessibilidade</Link>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ item }: { item: NavigationLink }) {
  if (/^https:\/\//i.test(item.href)) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer">
        {item.label}
      </a>
    )
  }
  return <Link href={item.href}>{item.label}</Link>
}
