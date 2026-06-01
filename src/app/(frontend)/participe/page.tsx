import type { Metadata } from 'next'
import Link from 'next/link'

import { Hero } from '@/components/Hero'
import { Reveal } from '@/components/Reveal'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Participe',
  description: 'Como participar do CMDCA de Pindamonhangaba e canais de contato.',
}

export default async function ParticipePage() {
  const payload = await getPayloadClient()
  const config = await payload.findGlobal({ slug: 'configuracoes' }).catch(() => null)
  const c = config?.contato
  const instagram = config?.redes?.instagramUrl || 'https://www.instagram.com/cmdca_pindamonhangaba'
  const instagramHandle = config?.redes?.instagramHandle || '@cmdca_pindamonhangaba'

  return (
    <>
      <Hero
        eyebrow="Sua voz conta"
        titulo="Participe do conselho"
        texto="As decisões sobre a infância e a adolescência são públicas — e melhores com você por perto."
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
                  Acompanhe as <Link href="/reunioes">reuniões abertas</Link>, conheça a{' '}
                  <Link href="/transparencia">transparência</Link> dos recursos, registre sua entidade
                  (<Link href="/entidades">arts. 90 e 91 do ECA</Link>) ou destine parte do seu{' '}
                  <Link href="/fmdca">Imposto de Renda</Link> ao FMDCA. Se precisar de proteção ou
                  quiser denunciar, comece pela página <Link href="/ajuda">Preciso de ajuda</Link>.
                </p>
              </div>
              <div className="lead-box">
                <span className="k">Contato do conselho</span>
                {c?.email ? (
                  <div className="ro" style={{ marginTop: 8 }}>
                    <a href={`mailto:${c.email}`}>{c.email}</a>
                  </div>
                ) : null}
                {c?.telefone ? <div className="ro">Tel./Fax: {c.telefone}</div> : null}
                {c?.cep ? <div className="ro">CEP: {c.cep}</div> : null}
                <hr />
                <span className="k">Casa dos Conselhos</span>
                {c?.casaConselhosTelefone ? (
                  <div className="ro" style={{ marginTop: 8 }}>
                    {c.casaConselhosTelefone}
                  </div>
                ) : null}
                {c?.assessora ? <div className="ro">Assessora: {c.assessora}</div> : null}
                <hr />
                <div className="ro">
                  Instagram:{' '}
                  <a href={instagram} target="_blank" rel="noopener noreferrer">
                    {instagramHandle}
                  </a>
                </div>
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
                <p>Calendário, pautas e atas — abertas ao público.</p>
              </Link>
              <Link href="/entidades">
                <h4>Registrar entidade</h4>
                <p>Organizações da área da infância (arts. 90 e 91 do ECA).</p>
              </Link>
              <Link href="/fmdca">
                <h4>Destinar IR ao FMDCA</h4>
                <p>Transforme parte do imposto em projeto local.</p>
              </Link>
              <Link href="/ajuda">
                <h4>Pedir ajuda / denunciar</h4>
                <p>Emergência, Disque 100 e Conselho Tutelar.</p>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
