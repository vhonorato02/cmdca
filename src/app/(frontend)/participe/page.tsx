import type { Metadata } from 'next'
import Link from 'next/link'

import { Hero } from '@/components/Hero'
import { Reveal } from '@/components/Reveal'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { publicHref, publicText } from '@/lib/site'

export const revalidate = 300

export const metadata: Metadata = createMetadata({
  title: 'Como Participar do CMDCA | Pindamonhangaba',
  description:
    'Saiba como acompanhar reuniões e atos do CMDCA, consultar entidades registradas e buscar os canais institucionais.',
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
        eyebrow="Acompanhe e participe"
        titulo="Participe do CMDCA"
        texto="Acompanhe reuniões, atos e recursos. A participação social também ajuda a definir prioridades para a política de direitos."
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
                  Comece pela informação pública.
                </h2>
                <p>
                  Consulte quais <Link href="/reunioes">reuniões são públicas</Link>, acompanhe os
                  documentos de <Link href="/transparencia">transparência</Link> e conheça as{' '}
                  <Link href="/entidades">entidades registradas</Link>. Para registro ou renovação,
                  busque orientação nos canais do conselho. Para destinar Imposto de Renda ao Fundo,
                  confira as regras na página do <Link href="/fmdca">FMDCA</Link>. Em uma situação
                  de proteção ou denúncia, acesse <Link href="/ajuda">Preciso de ajuda</Link>.
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
                <p>Confira regras e fontes oficiais para a destinação ao Fundo.</p>
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
