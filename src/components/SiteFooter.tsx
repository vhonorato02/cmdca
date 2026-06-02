import Image from 'next/image'
import Link from 'next/link'

import { getPayloadClient } from '@/lib/payload'

const FALLBACK = {
  casaTel: '(12) 3643-1607 · (12) 3643-1609',
  instagramUrl: 'https://www.instagram.com/cmdca_pindamonhangaba',
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
            <p>{casaTel}</p>
          </div>
          <div>
            <h5>Navegação</h5>
            <Link href="/conselho">O Conselho</Link>
            <Link href="/reunioes">Reuniões</Link>
            <Link href="/transparencia">Transparência</Link>
            <Link href="/noticias">Notícias</Link>
          </div>
          <div>
            <h5>Proteção</h5>
            <Link href="/ajuda">Preciso de ajuda</Link>
            <Link href="/ajuda#emergencia">Disque 100 e emergência</Link>
            <Link href="/ajuda#rede">Conselho Tutelar</Link>
            <Link href="/ajuda#rede">Rede de proteção</Link>
          </div>
          <div>
            <h5>Transparência</h5>
            <Link href="/creditos">Créditos de imagens</Link>
            <Link href="/privacidade">Privacidade (LGPD)</Link>
            <Link href="/acessibilidade">Acessibilidade</Link>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </div>
        <div className="foot-end">
          <span>© {year} CMDCA Pindamonhangaba</span>
          <div className="seals">
            <span className="seal">eMAG / WCAG 2.1 AA</span>
            <span className="seal">VLibras</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
