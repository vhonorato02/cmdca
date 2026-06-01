import type { Metadata } from 'next'

import { Hero } from '@/components/Hero'
import { Reveal } from '@/components/Reveal'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Créditos',
  description: 'Créditos de imagens, identidade visual e tecnologias do site do CMDCA de Pindamonhangaba.',
}

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
                As ilustrações são autorais do CMDCA, construídas a partir do motivo da órbita do logo
                — evitando, por padrão, o uso de fotografias de crianças identificáveis.
              </p>
              <h3>Identidade visual</h3>
              <p>Logotipo oficial do CMDCA Pindamonhangaba, cedido pelo conselho.</p>
              <h3>Mapa</h3>
              <p>
                Mapas e dados geográficos por{' '}
                <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
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
                Site construído com Next.js e Payload CMS; conteúdo gerido pela coordenação e pelo
                jurídico do conselho.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
