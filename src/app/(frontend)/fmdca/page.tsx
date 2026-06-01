import type { Metadata } from 'next'

import { FaqAccordion } from '@/components/FaqAccordion'
import { Hero } from '@/components/Hero'
import { Reveal } from '@/components/Reveal'
import { SimuladorIR } from '@/components/SimuladorIR'
import { getPayloadClient } from '@/lib/payload'
import type { Faq } from '@/payload-types'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'FMDCA',
  description:
    'Fundo Municipal dos Direitos da Criança e do Adolescente: o que é, como destinar parte do IR e transparência.',
}

const isConfirm = (v?: string | null) => !v || v.includes('[A CONFIRMAR]')

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
  const percentual = fmdca?.percentualDeducaoIR ?? 6
  const faqItems = (faq.docs as Faq[]).map((f) => ({ pergunta: f.pergunta, resposta: f.resposta }))

  return (
    <>
      <Hero
        deep
        eyebrow="Fundo da infância"
        titulo="FMDCA — o imposto que fica na cidade vira projeto"
        texto="O Fundo Municipal dos Direitos da Criança e do Adolescente financia projetos locais e pode receber parte do seu Imposto de Renda."
      />

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
                  Recurso público, decisão coletiva.
                </h2>
                <p>
                  O <b>FMDCA</b> é gerido pelo conselho e reúne recursos destinados às políticas para a
                  infância e a adolescência. As prioridades de aplicação são deliberadas pelo colegiado,
                  de forma transparente.
                </p>
                <p style={{ marginTop: 16 }}>
                  {fmdca?.comoDestinar ||
                    'Pessoas físicas e jurídicas podem destinar parte do Imposto de Renda devido ao FMDCA. Os recursos permanecem em Pindamonhangaba.'}
                </p>
              </div>
              <div className="lead-box">
                <span className="k">Dados para destinação</span>
                <div className="ro" style={{ marginTop: 8 }}>
                  CNPJ do FMDCA:{' '}
                  {isConfirm(fmdca?.cnpj) ? <span className="confirm">a confirmar</span> : fmdca?.cnpj}
                </div>
                <hr />
                <div className="ro">
                  Conta bancária:{' '}
                  {isConfirm(fmdca?.conta) ? (
                    <span className="confirm">a confirmar</span>
                  ) : (
                    fmdca?.conta
                  )}
                </div>
                <div className="ro" style={{ marginTop: 10, fontSize: '.78rem' }}>
                  Confirme limites e prazos de dedução com seu contador.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <Reveal>
            <SimuladorIR
              percentual={percentual}
              eyebrow="Simulador"
              titulo="Quanto do seu IR pode virar projeto em Pinda?"
              texto="Arraste para estimar a destinação. O percentual é ilustrativo — confirme o limite legal com seu contador."
            />
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
