import type { Metadata } from 'next'

import { SmartLink } from '@/components/ui/Button'
import { ArrowRight } from '@/components/ui/icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { getInstituicao, getTextos } from '@/lib/content'
import { phoneHref } from '@/lib/contact'
import { createMetadata } from '@/lib/seo'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const textos = await getTextos()
  return createMetadata({
    title: 'Participe do CMDCA | Pindamonhangaba',
    description: textos.participe.introducao,
    path: '/participe',
  })
}

export default async function ParticipePage() {
  const [textos, i] = await Promise.all([getTextos(), getInstituicao()])
  const t = textos.participe
  const endereco = [i.endereco, i.cep ? `CEP ${i.cep}` : undefined].filter(Boolean).join(', ')
  const casa = [i.casaEndereco, i.casaTelefone].filter(Boolean).join('. ')

  return (
    <>
      <PageHeader title={t.titulo} lead={t.introducao} />
      <Section id="formas">
        <div className="grid-2">
          <ul className="ruled-list ruled-list--single" aria-label="Formas de participar">
            {t.caminhos.map((c) => (
              <li key={c.href + c.titulo} className="ruled-link">
                <h2 className="ruled-link__title">
                  <SmartLink href={c.href}>{c.titulo}</SmartLink>
                </h2>
                <p>{c.texto}</p>
                <ArrowRight className="ruled-link__arrow" aria-hidden="true" />
              </li>
            ))}
          </ul>
          <aside className="contact-card" aria-labelledby="contato-conselho">
            <h2 id="contato-conselho" className="callout__title">
              {t.contatoTitulo}
            </h2>
            <dl>
              {i.email ? (
                <div>
                  <dt>E-mail</dt>
                  <dd>
                    <a href={`mailto:${i.email}`}>{i.email}</a>
                  </dd>
                </div>
              ) : null}
              {i.telefone ? (
                <div>
                  <dt>Telefone</dt>
                  <dd>{phoneHref(i.telefone) ? <a href={phoneHref(i.telefone)}>{i.telefone}</a> : i.telefone}</dd>
                </div>
              ) : null}
              {endereco ? (
                <div>
                  <dt>Endereço</dt>
                  <dd>{endereco}</dd>
                </div>
              ) : null}
              {i.horario ? (
                <div>
                  <dt>Atendimento</dt>
                  <dd>{i.horario}</dd>
                </div>
              ) : null}
              {casa ? (
                <div>
                  <dt>Casa dos Conselhos</dt>
                  <dd>{casa}</dd>
                </div>
              ) : null}
              {i.instagramUrl ? (
                <div>
                  <dt>Instagram</dt>
                  <dd>
                    <a href={i.instagramUrl} target="_blank" rel="noopener noreferrer">
                      {i.instagramHandle || 'Perfil do CMDCA'}
                      <span className="sr-only"> (abre em nova aba)</span>
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </aside>
        </div>
      </Section>
    </>
  )
}
