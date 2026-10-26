import type { Metadata } from 'next'
import Link from 'next/link'

import { Hero } from '@/components/Hero'
import { Reveal } from '@/components/Reveal'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { publicText } from '@/lib/site'

export const revalidate = 600

export const metadata: Metadata = createMetadata({
  title: 'Acessibilidade do Site | CMDCA de Pindamonhangaba',
  description:
    'Conheça os recursos, as referências adotadas, as limitações conhecidas e o canal para comunicar barreiras de acessibilidade.',
  path: '/acessibilidade',
})

const EMAG_URL =
  'https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/acessibilidade-digital/modelo-de-acessibilidade'
const WCAG_URL = 'https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/'

export default async function AcessibilidadePage() {
  const payload = await getPayloadClient()
  const config = await payload.findGlobal({ slug: 'configuracoes' }).catch(() => null)
  const email = publicText(config?.contato?.email)

  return (
    <>
      <Hero
        deep
        eyebrow="Para todas as pessoas"
        titulo="Acessibilidade"
        texto="Esta página apresenta os recursos do site, as referências adotadas e os canais para relatar barreiras."
      />
      <section className="band">
        <div className="wrap">
          <Reveal>
            <div className="post-body" style={{ margin: 0 }}>
              <p>
                <b>Declaração revisada em 19 de julho de 2026.</b> O uso dessas referências não
                significa certificação de conformidade integral. O site precisa de verificações
                contínuas, inclusive testes manuais e com tecnologias assistivas.
              </p>

              <h2>Referências adotadas</h2>
              <p>
                O desenvolvimento considera o{' '}
                <a href={EMAG_URL} target="_blank" rel="noopener noreferrer">
                  Modelo de Acessibilidade em Governo Eletrônico (eMAG)
                </a>{' '}
                e as{' '}
                <a href={WCAG_URL} target="_blank" rel="noopener noreferrer">
                  Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.2
                </a>
                . Elas orientam melhorias, mas não são um selo nem garantem ausência de barreiras.
              </p>

              <h2>Recursos disponíveis</h2>
              <p>
                Na barra superior você encontra ferramentas de acessibilidade: aumentar e diminuir o
                tamanho da fonte (A+ / A−), ativar o <b>alto contraste</b> e abrir o tradutor de
                Libras (<b>VLibras</b>). As preferências de fonte e contraste ficam salvas no seu
                navegador.
              </p>
              <h2>Navegação</h2>
              <p>
                A interface oferece o atalho “Pular para o conteúdo”, estrutura de títulos e
                indicação de foco nos controles interativos. O objetivo é manter navegação por
                teclado, textos claros, contraste adequado e alternativas textuais. Consulte também
                o <Link href="/mapa-do-site">mapa do site</Link>.
              </p>

              <h2>Limitações conhecidas</h2>
              <p>
                Documentos antigos em PDF podem não ter estrutura adequada para leitores de tela. O
                mapa, o VLibras e outros recursos de terceiros possuem comportamento próprio e podem
                apresentar barreiras que não controlamos integralmente. Quando um documento ou
                recurso não estiver acessível, solicite uma alternativa pelo canal abaixo.
              </p>

              <h2>Encontrou uma barreira?</h2>
              <p>
                Informe a página ou o documento, descreva a barreira e, se souber, diga qual
                navegador e tecnologia assistiva utiliza.
                {email ? (
                  <>
                    {' '}
                    Envie a mensagem para <a href={`mailto:${email}`}>{email}</a>.
                  </>
                ) : null}{' '}
                O relato ajuda a analisar a barreira e, quando possível, orientar uma alternativa de
                acesso.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
