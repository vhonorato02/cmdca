import type { Metadata } from 'next'
import Link from 'next/link'

import { FaqAccordion } from '@/components/FaqAccordion'
import { Hero } from '@/components/Hero'
import { Reveal } from '@/components/Reveal'
import { SimuladorIR } from '@/components/SimuladorIR'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata, serializeJsonLd } from '@/lib/seo'
import { containsUnverifiedMarker, publicText } from '@/lib/site'
import type { Faq } from '@/payload-types'

export const revalidate = 300

export const metadata: Metadata = createMetadata({
  title: 'Fundo Municipal | Destinação do Imposto de Renda',
  description:
    'Entenda as regras para destinar parte do Imposto de Renda ao Fundo Municipal e consulte fontes oficiais antes de concluir.',
  path: '/fmdca',
})

const RECEITA_DECLARACAO_URL =
  'https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/preenchimento/manual-mir/destinacao-na-declaracao'
const ECA_URL = 'https://www.planalto.gov.br/ccivil_03/leis/l8069compilado.htm'
const ORIENTACAO_MUNICIPAL_URL =
  'https://www.pindamonhangaba.sp.gov.br/noticias/assistencia-social/destina-acao-orienta-contribuintes-sobre-destinacao-do-imposto-de-renda-em-pindamonhangaba'

export default async function FmdcaPage() {
  const payload = await getPayloadClient()
  const [config, faq] = await Promise.all([
    payload.findGlobal({ slug: 'configuracoes' }).catch(() => null),
    payload
      .find({
        collection: 'faq',
        where: { _status: { equals: 'published' }, contexto: { in: ['fmdca', 'geral'] } },
        sort: 'ordem',
        limit: 50,
        depth: 0,
      })
      .catch(() => ({ docs: [] as Faq[] })),
  ])

  const fmdca = config?.fmdca
  const cnpj = publicText(fmdca?.cnpj)
  const conta = publicText(fmdca?.conta)
  const faqItems = (faq.docs as Faq[]).flatMap((f) => {
    const pergunta = publicText(f.pergunta)
    const resposta = publicText(f.resposta)
    return pergunta && resposta && !containsUnverifiedMarker([pergunta, resposta])
      ? [{ pergunta, resposta }]
      : []
  })
  const faqLd = faqItems.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.pergunta,
          acceptedAnswer: { '@type': 'Answer', text: item.resposta },
        })),
      }
    : null

  return (
    <>
      <Hero
        deep
        eyebrow="Fundo da infância"
        titulo="Fundo Municipal dos Direitos da Criança e do Adolescente"
        texto="Entenda as regras para destinar parte do Imposto de Renda devido. Antes de concluir, confirme o procedimento nos canais oficiais."
      />

      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqLd) }}
        />
      ) : null}

      <section className="band">
        <div className="wrap">
          <Reveal>
            <div className="about">
              <div>
                <span className="eyebrow">O que é</span>
                <h2
                  style={{
                    fontFamily: 'var(--serif)',
                    fontWeight: 600,
                    fontSize: '1.8rem',
                    margin: '11px 0 14px',
                    lineHeight: 1.1,
                  }}
                >
                  Recursos públicos destinados à política de direitos.
                </h2>
                <p>
                  O Fundo reúne recursos destinados a programas e projetos de promoção, proteção e
                  defesa dos direitos de crianças e adolescentes. O CMDCA delibera sobre prioridades
                  de aplicação. Arrecadação, projetos apoiados e prestação de contas devem ser
                  divulgados nos atos e documentos correspondentes.
                </p>
                <p style={{ marginTop: 16 }}>
                  A destinação pode direcionar ao Fundo uma parcela do imposto devido, dentro dos
                  limites legais. A modalidade, o prazo e o limite aplicável variam conforme o
                  momento da destinação e a situação tributária da pessoa ou empresa.
                </p>
              </div>
              <div className="lead-box">
                <span className="k">Dados locais verificados</span>
                {cnpj ? (
                  <div className="ro" style={{ marginTop: 8 }}>
                    CNPJ do Fundo: {cnpj}
                  </div>
                ) : null}
                {conta ? <div className="ro">Conta para destinação: {conta}</div> : null}
                {!cnpj && !conta ? (
                  <p className="ro" style={{ marginTop: 8 }}>
                  Dados bancários não são exibidos sem validação formal. Não faça transferências com
                  base em mensagens ou dados que não estejam em ato oficial.
                  </p>
                ) : null}
                <hr />
                <p className="ro" style={{ fontSize: '.82rem' }}>
                  Na destinação feita dentro da declaração, o próprio programa da Receita Federal
                  gera o DARF. Para outras modalidades, confirme procedimento, prazo e comprovante.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <Reveal>
            <div className="sec-head">
              <div>
                <span className="eyebrow">Duas formas de destinar</span>
                <h2>O limite varia conforme o momento da destinação</h2>
                <p>
                  As regras abaixo se referem à pessoa física e não substituem orientação tributária
                  individual.
                </p>
              </div>
            </div>
            <div className="links">
              <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--line)' }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', marginBottom: 8 }}>
                  Na declaração: até 3%
                </h3>
                <p style={{ color: 'var(--ink-2)' }}>
                  No modelo por deduções legais, a pessoa física pode destinar até 3% do imposto
                  devido diretamente na declaração, dentro do prazo da Receita Federal.
                </p>
                <a href={RECEITA_DECLARACAO_URL} target="_blank" rel="noopener noreferrer">
                  Consultar o manual da Receita Federal
                </a>
              </div>
              <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--line)' }}>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', marginBottom: 8 }}>
                  Durante o ano: até 6%
                </h3>
                <p style={{ color: 'var(--ink-2)' }}>
                  Destinações feitas ao longo do ano-calendário podem alcançar até 6% do imposto
                  devido, observados o limite global, os comprovantes e o art. 260 do ECA.
                </p>
                <a href={ECA_URL} target="_blank" rel="noopener noreferrer">
                  Consultar o ECA no Planalto
                </a>
              </div>
            </div>
            <p style={{ color: 'var(--ink-2)', marginTop: 18 }}>
              Empresas tributadas pelo lucro real seguem regras próprias. Antes de destinar, confirme
              enquadramento, prazo e documentação com a Receita Federal ou um profissional de
              contabilidade.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <Reveal>
            <SimuladorIR
              percentual={3}
              eyebrow="Estimativa para a declaração"
              titulo="Estime até 3% do imposto devido"
              texto="Esta é uma estimativa para a destinação feita diretamente na declaração por pessoa física no modelo por deduções legais. O valor efetivo depende da apuração da Receita Federal."
            />
          </Reveal>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <Reveal>
            <div className="sec-head">
              <div>
                <span className="eyebrow">Fontes oficiais</span>
                <h2>Consulte as fontes antes de destinar</h2>
              </div>
            </div>
            <p style={{ color: 'var(--ink-2)' }}>
              Consulte a{' '}
              <a href={ORIENTACAO_MUNICIPAL_URL} target="_blank" rel="noopener noreferrer">
                orientação da Prefeitura para a campanha Destina Ação
              </a>{' '}
              e o manual da Receita Federal. Para acompanhar a aplicação dos recursos, acesse a
              página de <Link href="/transparencia">Transparência</Link>.
            </p>
          </Reveal>
        </div>
      </section>

      {faqItems.length ? (
        <section className="band">
          <div className="wrap">
            <Reveal>
              <div className="sec-head">
                <div>
                  <span className="eyebrow">Dúvidas</span>
                  <h2>Sobre o fundo</h2>
                </div>
              </div>
              <FaqAccordion items={faqItems} />
            </Reveal>
          </div>
        </section>
      ) : null}
    </>
  )
}
