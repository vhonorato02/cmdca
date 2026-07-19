import type { Metadata } from 'next'
import Link from 'next/link'

import { Hero } from '@/components/Hero'
import { Reveal } from '@/components/Reveal'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { publicHref, publicText } from '@/lib/site'

export const revalidate = 300

export const metadata: Metadata = createMetadata({
  title: 'Participe do CMDCA | Reuniões, Entidades e Contato',
  description:
    'Veja como acompanhar reuniões públicas, buscar orientação sobre registro de entidade, conhecer o Fundo e falar com o CMDCA.',
  path: '/participe',
})

export default async function ParticipePage() {
  const payload = await getPayloadClient()
  const config = await payload.findGlobal({ slug: 'configuracoes' }).catch(() => null)
  const c = config?.contato
  const email = publicText(c?.email)
  const telefone = publicText(c?.telefone)
  const cep = publicText(c?.cep)
  const casaTelefone = publicText(c?.casaConselhosTelefone)
  const assessora = publicText(c?.assessora)
  const instagram = publicHref(config?.redes?.instagramUrl)
  const instagramHandle = publicText(config?.redes?.instagramHandle) || 'Instagram do CMDCA'

  return (
    <>
      <Hero
        eyebrow="Sua voz conta"
        titulo="Participe do conselho"
        texto="A participação social ajuda a definir prioridades, acompanhar decisões e fortalecer a política municipal de direitos."
      />

      <section className="band">
        <div className="wrap">
          <Reveal>
            <div className="about">
              <div>
                <span className="eyebrow">Como participar</span>
                <h2
                  style={{
                    fontFamily: 'var(--serif)',
                    fontWeight: 600,
                    fontSize: '1.8rem',
                    margin: '11px 0 14px',
                    lineHeight: 1.1,
                  }}
                >
                  Há muitas formas de fazer parte.
                </h2>
                <p>
                  Consulte quais <Link href="/reunioes">reuniões são públicas</Link>, acompanhe a{' '}
                  <Link href="/transparencia">transparência</Link> dos recursos, registre sua
                  entidade com orientação do CMDCA, conheça as{' '}
                  <Link href="/entidades">entidades registradas</Link> ou destine parte do seu{' '}
                  <Link href="/fmdca">Imposto de Renda</Link> ao FMDCA. Se precisar de proteção ou
                  quiser denunciar, comece pela página <Link href="/ajuda">Preciso de ajuda</Link>.
                </p>
              </div>
              <div className="lead-box">
                <span className="k">Contato do conselho</span>
                {email ? (
                  <div className="ro" style={{ marginTop: 8 }}>
                    <a href={`mailto:${email}`}>{email}</a>
                  </div>
                ) : null}
                {telefone ? <div className="ro">Telefone: {telefone}</div> : null}
                {cep ? <div className="ro">CEP: {cep}</div> : null}
                <hr />
                <span className="k">Casa dos Conselhos</span>
                {casaTelefone ? (
                  <div className="ro" style={{ marginTop: 8 }}>
                    {casaTelefone}
                  </div>
                ) : null}
                {assessora ? <div className="ro">Atendimento: {assessora}</div> : null}
                <div className="ro" style={{ marginTop: 8 }}>
                  Confirme o horário antes de se deslocar.
                </div>
                {instagram ? (
                  <>
                    <hr />
                    <div className="ro">
                      Instagram:{' '}
                      <a href={instagram} target="_blank" rel="noopener noreferrer">
                        {instagramHandle}
                      </a>
                    </div>
                  </>
                ) : null}
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
                <span className="eyebrow">Atalhos</span>
                <h2>Por onde começar</h2>
              </div>
            </div>
            <div className="links">
              <Link href="/reunioes">
                <h4>Acompanhar reuniões</h4>
                <p>Veja calendário, classificação e atas publicadas.</p>
              </Link>
              <Link href="/entidades">
                <h4>Orientação para entidades</h4>
                <p>Conheça a relação pública e fale com o conselho sobre registro e renovação.</p>
              </Link>
              <Link href="/fmdca">
                <h4>Destinar IR ao FMDCA</h4>
                <p>Transforme parte do imposto em projeto local.</p>
              </Link>
              <Link href="/ajuda">
                <h4>Pedir ajuda / denunciar</h4>
                <p>Emergência, Disque 100 e Conselho Tutelar.</p>
              </Link>
              <Link href="/mapa-do-site">
                <h4>Mapa do site</h4>
                <p>Acesse todas as áreas institucionais e de serviço.</p>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
