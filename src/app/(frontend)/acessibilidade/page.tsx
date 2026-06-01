import type { Metadata } from 'next'

import { Hero } from '@/components/Hero'
import { Reveal } from '@/components/Reveal'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Acessibilidade',
  description: 'Compromisso de acessibilidade do site do CMDCA de Pindamonhangaba (eMAG / WCAG 2.1 AA).',
}

export default async function AcessibilidadePage() {
  const payload = await getPayloadClient()
  const config = await payload.findGlobal({ slug: 'configuracoes' }).catch(() => null)
  const email = config?.contato?.email || 'cmdca@pindamonhangaba.sp.gov.br'

  return (
    <>
      <Hero
        deep
        eyebrow="Para todas as pessoas"
        titulo="Acessibilidade"
        texto="Buscamos um site utilizável por todas as pessoas, seguindo as diretrizes eMAG e WCAG 2.1 nível AA."
      />
      <section className="band">
        <div className="wrap">
          <Reveal>
            <div className="post-body" style={{ margin: 0 }}>
              <h3>Recursos disponíveis</h3>
              <p>
                Na barra superior você encontra ferramentas de acessibilidade: aumentar e diminuir o
                tamanho da fonte (A+ / A−), ativar o <b>alto contraste</b> e abrir o tradutor de Libras
                (<b>VLibras</b>). As preferências de fonte e contraste ficam salvas no seu navegador.
              </p>
              <h3>Navegação</h3>
              <p>
                O site pode ser navegado pelo teclado, com foco visível nos elementos interativos e um
                atalho “Pular para o conteúdo”. As ilustrações decorativas são marcadas para não
                interferir em leitores de tela.
              </p>
              <h3>Encontrou uma barreira?</h3>
              <p>
                Se algo dificultou o seu acesso, conte para a gente pelo e-mail{' '}
                <a href={`mailto:${email}`}>{email}</a>. Seu retorno ajuda a melhorar o site.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
