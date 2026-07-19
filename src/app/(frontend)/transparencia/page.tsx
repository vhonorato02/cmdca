import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/Reveal'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { publicHref } from '@/lib/site'

export const revalidate = 300

export const metadata: Metadata = createMetadata({
  title: 'Transparência do Fundo | Receitas, Projetos e Prestação de Contas',
  description:
    'Acompanhe atos, projetos, planos de aplicação e prestações de contas do Fundo da Criança e do Adolescente em Pindamonhangaba.',
  path: '/transparencia',
})

export default async function TransparenciaPage() {
  const payload = await getPayloadClient()
  const config = await payload.findGlobal({ slug: 'configuracoes' }).catch(() => null)
  const tribuna = publicHref(config?.tribunaUrl) || 'https://www.jornaltribunadonorte.com.br'

  return (
    <>
      <section className="band">
        <div className="wrap">
          <Reveal>
            <div className="sec-head">
              <div>
                <span className="eyebrow">Controle social</span>
                <h1>Transparência do Fundo e do conselho</h1>
                <p>
                  Consulte os atos que orientam as decisões do CMDCA e os documentos disponíveis
                  sobre a aplicação dos recursos. Números consolidados só são exibidos quando
                  acompanhados de período de referência, metodologia e fonte verificável.
                </p>
              </div>
            </div>
            <div className="links">
              <Link href="/resolucoes">
                <h2>Resoluções</h2>
                <p>Deliberações e atos normativos publicados pelo colegiado.</p>
              </Link>
              <Link href="/editais">
                <h2>Editais</h2>
                <p>Chamamentos, processos, prazos, anexos e resultados disponíveis.</p>
              </Link>
              <Link href="/reunioes">
                <h2>Reuniões e atas</h2>
                <p>Calendário e atas disponibilizadas após aprovação.</p>
              </Link>
              <Link href="/entidades">
                <h2>Entidades registradas</h2>
                <p>
                  Relação pública mantida pelo CMDCA, com registro e validade quando informados.
                </p>
              </Link>
            </div>
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
                  Esta área deve reunir planos de aplicação, receitas, saldos, projetos financiados
                  e prestações de contas à medida que os documentos forem oficialmente publicados.
                  Não apresentamos estimativas ou valores sem fonte documental.
                </p>
                <p style={{ marginTop: 12 }}>
                  Para pesquisar as edições do órgão de imprensa oficial, acesse o portal da{' '}
                  <a href={tribuna} target="_blank" rel="noopener noreferrer">
                    Tribuna do Norte
                  </a>
                  . Sempre prefira, nas listas de atos, o link direto para a publicação específica.
                </p>
              </div>
            </div>
            <p style={{ color: 'var(--ink-2)' }}>
              Quer entender a destinação do Imposto de Renda? Consulte os limites e as fontes
              oficiais na página do <Link href="/fmdca">Fundo Municipal</Link>.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
