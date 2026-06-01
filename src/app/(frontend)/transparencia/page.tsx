import type { Metadata } from 'next'
import Link from 'next/link'

import { Charts } from '@/components/Charts'
import { Reveal } from '@/components/Reveal'
import { SimuladorIR } from '@/components/SimuladorIR'
import { StatsBand } from '@/components/StatsBand'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Transparência',
  description:
    'Indicadores, gráficos e simulador de destinação de Imposto de Renda ao FMDCA de Pindamonhangaba.',
}

export default async function TransparenciaPage() {
  const payload = await getPayloadClient()
  const [ind, config] = await Promise.all([
    payload.findGlobal({ slug: 'indicadores' }).catch(() => null),
    payload.findGlobal({ slug: 'configuracoes' }).catch(() => null),
  ])

  const stats = ind
    ? [
        { value: ind.alcancados ?? 0, label: 'crianças e adolescentes alcançados' },
        { value: ind.projetos ?? 0, label: 'projetos apoiados pelo FMDCA' },
        { value: ind.entidades ?? 0, label: 'entidades registradas' },
        { value: ind.reunioesNoAno ?? 0, label: 'reuniões realizadas no ano' },
      ]
    : []

  const serieAnual = (ind?.serieAnual || [])
    .filter((s) => s.ano && typeof s.valor === 'number')
    .map((s) => ({ ano: String(s.ano), valor: s.valor as number }))
  const aplicacao = (ind?.aplicacaoPorArea || [])
    .filter((a) => a.area && typeof a.percentual === 'number')
    .map((a) => ({ area: String(a.area), percentual: a.percentual as number }))

  const percentual = config?.fmdca?.percentualDeducaoIR ?? 6
  const tribuna = config?.tribunaUrl || 'https://www.jornaltribunadonorte.com.br'

  return (
    <>
      <section className="band">
        <div className="wrap">
          <Reveal>
            <div className="sec-head">
              <div>
                <span className="eyebrow">Transparência viva</span>
                <h1>O que fazemos, em números e gráficos</h1>
                <p>
                  Todos os valores vêm do painel e são editáveis pela coordenação e pelo jurídico.{' '}
                  {ind?.observacao || 'Dados ilustrativos.'}
                </p>
              </div>
            </div>
            {stats.length ? <StatsBand stats={stats} style={{ marginBottom: 30 }} /> : null}
            {serieAnual.length || aplicacao.length ? (
              <Charts serieAnual={serieAnual} aplicacaoPorArea={aplicacao} />
            ) : null}
          </Reveal>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <Reveal>
            <SimuladorIR percentual={percentual} />
          </Reveal>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <Reveal>
            <div className="sec-head">
              <div>
                <span className="eyebrow">Documentos</span>
                <h2>Prestação de contas e planos de aplicação</h2>
                <p>
                  Os documentos do FMDCA serão disponibilizados aqui. Os atos oficiais do conselho
                  também são publicados na{' '}
                  <a href={tribuna} target="_blank" rel="noopener noreferrer">
                    Tribuna do Norte
                  </a>
                  .
                </p>
              </div>
            </div>
            <p style={{ color: 'var(--ink-2)' }}>
              Consulte também as <Link href="/resolucoes">Resoluções</Link> e os{' '}
              <Link href="/editais">Editais</Link> do conselho.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
