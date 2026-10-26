import type { Metadata } from 'next'
import { AppLink as Link } from '@/components/ui/AppLink'

import { FaqList, publicFaq } from '@/components/FaqList'
import { SimuladorIR } from '@/components/SimuladorIR'
import { SourceList } from '@/components/SourceList'
import { ButtonLink } from '@/components/ui/Button'
import { ArrowRight } from '@/components/ui/icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { Callout } from '@/components/ui/states'
import { getInstituicao, getTextos } from '@/lib/content'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import type { Faq } from '@/payload-types'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const textos = await getTextos()
  return createMetadata({
    title: 'Fundo Municipal e Imposto de Renda | CMDCA de Pindamonhangaba',
    description: textos.fmdca.introducao,
    path: '/fmdca',
  })
}

export default async function FmdcaPage() {
  const payload = await getPayloadClient()
  const [textos, instituicao, faq] = await Promise.all([
    getTextos(),
    getInstituicao(),
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
  const t = textos.fmdca
  const { cnpj, conta } = instituicao.fmdca
  const manual = t.fontes[0]
  const faqItems = publicFaq(faq.docs as Faq[])

  return (
    <>
      <PageHeader title={t.titulo} lead={t.introducao} />

      <Section id="limites" title={t.modalidadesTitulo}>
        <ul className="limits">
          {t.modalidades.map((m) => (
            <li key={`${m.limite}-${m.titulo}`} className="limit">
              <p className="limit__value">
                <span className="sr-only">Até </span>
                {m.limite}
              </p>
              <h3 className="limit__title">{m.titulo}</h3>
              <p>{m.texto}</p>
            </li>
          ))}
        </ul>
        <p className="muted mt-4">{t.aviso}</p>
      </Section>

      <Section id="passo-a-passo" title={t.passosTitulo} alt>
        <ol className="steps">
          {t.passos.map((passo) => (
            <li key={passo.titulo}>
              <h3 className="steps__title">{passo.titulo}</h3>
              <p>{passo.texto}</p>
            </li>
          ))}
        </ol>
        {manual?.url ? (
          <div className="actions mt-6">
            <ButtonLink href={manual.url}>{manual.rotulo}</ButtonLink>
          </div>
        ) : null}
      </Section>

      <Section id="simulador">
        <SimuladorIR titulo={t.simuladorTitulo} texto={t.simuladorTexto} percentual={t.simuladorPercentual} />
      </Section>

      <Section id="o-fundo" alt>
        <div className="grid-2">
          <div>
            <h2>{t.oQueETitulo}</h2>
            <p className="lead mt-4">{t.oQueE}</p>
            <p className="mt-4">
              <Link className="more-link" href="/transparencia">
                Ver como o Fundo é aplicado
                <ArrowRight />
              </Link>
            </p>
          </div>
          {cnpj || conta ? (
            <aside className="contact-card" aria-labelledby="dados-fundo">
              <h3 id="dados-fundo" className="callout__title">
                {t.bancarioTitulo}
              </h3>
              <dl>
                {cnpj ? (
                  <div>
                    <dt>CNPJ do Fundo</dt>
                    <dd className="num">{cnpj}</dd>
                  </div>
                ) : null}
                {conta ? (
                  <div>
                    <dt>Dados bancários</dt>
                    <dd className="num">{conta}</dd>
                  </div>
                ) : null}
              </dl>
            </aside>
          ) : (
            <Callout tone="warning" as="h3" title={t.bancarioTitulo}>
              <p>{t.bancarioAviso}</p>
            </Callout>
          )}
        </div>
      </Section>

      {faqItems.length ? (
        <Section id="duvidas" title="Dúvidas sobre o Fundo">
          <FaqList items={faqItems} />
        </Section>
      ) : null}

      <Section alt={!faqItems.length}>
        <SourceList items={t.fontes} />
      </Section>
    </>
  )
}
