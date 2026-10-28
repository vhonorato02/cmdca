import type { Metadata } from 'next'
import { AppLink as Link } from '@/components/ui/AppLink'

import { SourceList } from '@/components/SourceList'
import { ButtonLink } from '@/components/ui/Button'
import { ArrowRight, TopicIcon } from '@/components/ui/icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { getInstituicao, getTextos } from '@/lib/content'
import { createMetadata } from '@/lib/seo'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const textos = await getTextos()
  return createMetadata({
    title: 'O CMDCA de Pindamonhangaba | Composição e atribuições',
    description: textos.conselho.introducao,
    path: '/conselho',
  })
}

export default async function ConselhoPage() {
  const [textos, instituicao] = await Promise.all([getTextos(), getInstituicao()])
  const t = textos.conselho
  const pessoas = [instituicao.presidente, instituicao.vice].filter(
    (p): p is { nome: string; cargo: string } => Boolean(p),
  )
  const leis = [
    instituicao.leiCMDCA ? { termo: 'Lei de criação do CMDCA', valor: instituicao.leiCMDCA } : null,
    instituicao.leiFMDCA ? { termo: 'Lei do Fundo Municipal', valor: instituicao.leiFMDCA } : null,
    instituicao.regimento ? { termo: 'Regimento interno', valor: instituicao.regimento } : null,
  ].filter((item): item is { termo: string; valor: string } => Boolean(item))

  return (
    <>
      <PageHeader title={t.titulo} lead={t.introducao} />

      <Section id="atribuicoes" title={t.atribuicoesTitulo}>
        <ul className="ruled-list ruled-list--icons">
          {t.atribuicoes.map((a) => (
            <li key={a.titulo}>
              <span className="topic-icon">
                <TopicIcon title={a.titulo} text={a.texto} />
              </span>
              <h3>{a.titulo}</h3>
              <p>{a.texto}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="composicao" alt>
        <div className="grid-2">
          <div>
            <h2>{t.composicaoTitulo}</h2>
            <p className="lead mt-4">{t.composicaoTexto}</p>
            {t.composicaoLinkUrl ? (
              <div className="actions mt-6">
                <ButtonLink href={t.composicaoLinkUrl} variant="secondary">
                  {t.composicaoLinkRotulo}
                </ButtonLink>
              </div>
            ) : null}
          </div>
          {pessoas.length ? (
            <div className="stack">
              <h3>Diretoria{instituicao.gestao ? `, ${instituicao.gestao.replace(/^Gestão\s*/i, 'gestão ')}` : ''}</h3>
              <ul className="person-list">
                {pessoas.map((p) => (
                  <li className="person" key={p.nome}>
                    <p className="person__role">{p.cargo}</p>
                    <p className="person__name">{p.nome}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Section>

      <Section id="base-legal" title="Base legal">
        <dl className="definition-list">
          {leis.map((lei) => (
            <div key={lei.termo}>
              <dt>{lei.termo}</dt>
              <dd>{lei.valor}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6">
          <Link className="more-link" href="/resolucoes">
            Ver as resoluções do conselho
            <ArrowRight />
          </Link>
        </p>
      </Section>

      <Section alt>
        <SourceList items={t.fontes} />
      </Section>
    </>
  )
}
