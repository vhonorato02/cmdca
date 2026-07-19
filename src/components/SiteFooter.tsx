import Image from 'next/image'
import Link from 'next/link'

import { getPayloadClient } from '@/lib/payload'

const FALLBACK = {
  casaTel: '(12) 3643-1607 · (12) 3643-1609',
  instagramUrl: 'https://www.instagram.com/cmdca_pindamonhangaba',
}

const splitPhones = (value: string) => value.split(/\s*[·;]\s*/).filter(Boolean)

const phoneHref = (value: string) => {
  const number = value.replace(/[^\d+]/g, '')
  return number ? `tel:${number}` : undefined
}

export async function SiteFooter() {
  let casaTel = FALLBACK.casaTel
  let instagramUrl = FALLBACK.instagramUrl
  try {
    const payload = await getPayloadClient()
    const cfg = (await payload.findGlobal({ slug: 'configuracoes' })) as {
      contato?: { casaConselhosTelefone?: string | null }
      redes?: { instagramUrl?: string | null }
    }
    casaTel = cfg?.contato?.casaConselhosTelefone || casaTel
    instagramUrl = cfg?.redes?.instagramUrl || instagramUrl
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
              />
            </div>
            <p>
              Conselho Municipal dos Direitos da Criança e do Adolescente. Casa dos Conselhos —
              Secretaria de Assistência Social.
            </p>
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
          </div>
          <nav aria-label="Navegação institucional">
            <h5>Navegação</h5>
            <Link href="/conselho">O Conselho</Link>
            <Link href="/reunioes">Reuniões</Link>
            <Link href="/transparencia">Transparência</Link>
            <Link href="/noticias">Notícias</Link>
          </nav>
          <nav aria-label="Canais de proteção">
            <h5>Proteção</h5>
            <Link href="/ajuda">Preciso de ajuda</Link>
            <Link href="/ajuda#emergencia">Disque 100 e emergência</Link>
            <Link href="/ajuda#rede">Conselho Tutelar</Link>
            <Link href="/ajuda#rede">Rede de proteção</Link>
          </nav>
          <nav aria-label="Transparência e redes sociais">
            <h5>Transparência</h5>
            <Link href="/creditos">Créditos de imagens</Link>
            <Link href="/privacidade">Privacidade (LGPD)</Link>
            <Link href="/acessibilidade">Acessibilidade</Link>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
              Instagram <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </div>
        <div className="foot-end">
          <span>© {year} CMDCA Pindamonhangaba</span>
          <div className="seals">
            <span className="seal">Acessibilidade digital</span>
            <span className="seal">VLibras</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
