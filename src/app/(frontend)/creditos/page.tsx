import type { Metadata } from 'next'
import Link from 'next/link'

import { Hero } from '@/components/Hero'
import { Reveal } from '@/components/Reveal'
import { createMetadata } from '@/lib/seo'

export const revalidate = 600

export const metadata: Metadata = createMetadata({
  title: 'Créditos e Licenças do Site | CMDCA de Pindamonhangaba',
  description:
    'Consulte as referências de imagens, identidade visual, mapas, tipografia e tecnologias utilizadas pelo site do CMDCA.',
  path: '/creditos',
})

export default function CreditosPage() {
  return (
    <>
      <Hero
        deep
        eyebrow="Transparência"
        titulo="Créditos"
        texto="Identidade, imagens e tecnologias que compõem este site."
      />
      <section className="band">
        <div className="wrap">
          <Reveal>
            <div className="post-body" style={{ margin: 0 }}>
              <h3>Ilustrações</h3>
              <p>
                O site prioriza ilustrações e imagens não identificáveis para reduzir a exposição de
                crianças e adolescentes. As artes da interface usam formas e cores inspiradas na
                identidade visual do conselho. Créditos específicos de mídia, quando aplicáveis,
                devem acompanhar o respectivo arquivo ou publicação.
              </p>
              <h3>Identidade visual</h3>
              <p>Logotipo oficial do CMDCA Pindamonhangaba, cedido pelo conselho.</p>
              <h3>Mapa</h3>
              <p>
                Mapas e dados geográficos por{' '}
                <a
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OpenStreetMap
                </a>{' '}
                e colaboradores.
              </p>
              <h3>Tipografia</h3>
              <p>
                Fontes <b>Newsreader</b> e <b>Public Sans</b> (Google Fonts, licença SIL Open Font
                License).
              </p>
              <h3>Tecnologia</h3>
              <p>
                Site construído com Next.js e Payload CMS. Consulte também o{' '}
                <Link href="/privacidade">aviso de privacidade</Link> e a{' '}
                <Link href="/acessibilidade">declaração de acessibilidade</Link>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
