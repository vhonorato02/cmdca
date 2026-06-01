import type { Metadata } from 'next'
import Image from 'next/image'

import { Hero } from '@/components/Hero'
import { Reveal } from '@/components/Reveal'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'O Conselho',
  description:
    'Órgão paritário, deliberativo, consultivo e fiscalizador (art. 88 do ECA). Composição, atribuições e base legal do CMDCA de Pindamonhangaba.',
}

const isConfirm = (v?: string | null) => !v || v.includes('[A CONFIRMAR]')

function Valor({ value }: { value?: string | null }) {
  return isConfirm(value) ? <span className="confirm">a confirmar</span> : <>{value}</>
}

export default async function ConselhoPage() {
  const payload = await getPayloadClient()
  const config = await payload.findGlobal({ slug: 'configuracoes' }).catch(() => null)
  const dir = config?.diretoria
  const base = config?.baseLegal

  return (
    <>
      <Hero
        deep
        eyebrow="Institucional"
        titulo="O Conselho Municipal dos Direitos da Criança e do Adolescente"
        texto="Órgão paritário, deliberativo e fiscalizador, previsto no art. 88 do ECA (Lei Federal 8.069/1990)."
      />

      <section className="band">
        <div className="wrap">
          <Reveal>
            <div className="about">
              <div>
                <span className="eyebrow">Composição e funcionamento</span>
                <h2
                  style={{
                    fontFamily: 'var(--serif)',
                    fontWeight: 600,
                    fontSize: '1.8rem',
                    margin: '11px 0 14px',
                    lineHeight: 1.1,
                  }}
                >
                  Participação social, em igual peso.
                </h2>
                <p>
                  O CMDCA é <b>paritário</b>: poder público e sociedade civil dividem, em igual número,
                  as cadeiras do colegiado, em mandato voluntário de dois anos. As reuniões podem ser{' '}
                  <b>ordinárias</b>, <b>extraordinárias</b>, <b>públicas</b> ou <b>reservadas</b>.
                </p>
                <p style={{ marginTop: 16 }}>
                  Entre as atribuições: gerir o orçamento do <b>FMDCA</b>, registrar e acompanhar as
                  organizações da área (arts. 90 e 91 do ECA) e fiscalizar o processo de escolha dos
                  conselheiros tutelares.
                </p>
              </div>
              <div className="lead-box">
                <span className="k">{dir?.gestaoLabel || 'Gestão 2025–2027'}</span>
                <div className="nm">{dir?.presidenteNome || 'Dr. Rodolfo Brockhof'}</div>
                <div className="ro">{dir?.presidenteCargo || 'Presidente'}</div>
                <hr />
                <div className="nm" style={{ fontSize: '1.05rem' }}>
                  {dir?.viceNome || 'Andrea Campos Sales Martins'}
                </div>
                <div className="ro">{dir?.viceCargo || 'Vice-presidente'}</div>
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
                <span className="eyebrow">O que faz</span>
                <h2>Atribuições</h2>
              </div>
            </div>
            <div className="links" style={{ borderTop: '1px solid var(--line)' }}>
              <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--line)' }}>
                <h4 style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: '1.12rem', marginBottom: 5 }}>
                  Gerir o FMDCA
                </h4>
                <p style={{ fontSize: '.9rem', color: 'var(--ink-2)' }}>
                  Deliberar sobre o orçamento e a aplicação dos recursos do Fundo Municipal.
                </p>
              </div>
              <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--line)' }}>
                <h4 style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: '1.12rem', marginBottom: 5 }}>
                  Registrar e acompanhar entidades
                </h4>
                <p style={{ fontSize: '.9rem', color: 'var(--ink-2)' }}>
                  Conforme os arts. 90 e 91 do ECA, registrar e fiscalizar as organizações da área.
                </p>
              </div>
              <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--line)' }}>
                <h4 style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: '1.12rem', marginBottom: 5 }}>
                  Fiscalizar a escolha dos conselheiros tutelares
                </h4>
                <p style={{ fontSize: '.9rem', color: 'var(--ink-2)' }}>
                  Regulamentar e acompanhar o processo de escolha dos membros do Conselho Tutelar.
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
                <span className="eyebrow">Composição</span>
                <h2>Diretoria e colegiado</h2>
                <p>
                  A diretoria atual conduz os trabalhos do biênio. A composição nominal completa e
                  paritária (titulares e suplentes, por segmento) está em atualização.
                </p>
              </div>
            </div>
            <div className="lead-box" style={{ maxWidth: 560 }}>
              <span className="k">Lista nominal paritária</span>
              <p style={{ marginTop: 8, color: 'var(--ink-2)', fontSize: '.92rem' }}>
                Relação completa de conselheiros (governamental e sociedade civil):{' '}
                <span className="confirm">a confirmar</span>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <Reveal>
            <div className="sec-head">
              <div>
                <span className="eyebrow">Base legal</span>
                <h2>Leis e regimento</h2>
              </div>
            </div>
            <div className="panel" style={{ maxWidth: 620 }}>
              <div className="ver">
                <span>Lei municipal do CMDCA</span>
                <span>
                  <Valor value={base?.leiCMDCA} />
                </span>
              </div>
              <div className="ver">
                <span>Lei municipal do FMDCA</span>
                <span>
                  <Valor value={base?.leiFMDCA} />
                </span>
              </div>
              <div className="ver">
                <span>Regimento interno</span>
                <span>
                  <Valor value={base?.regimento} />
                </span>
              </div>
              <div className="ver" style={{ borderBottom: 'none' }}>
                <span>Base federal</span>
                <span>ECA — Lei 8.069/1990 (art. 88)</span>
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
                <span className="eyebrow">Identidade</span>
                <h2>Logo oficial</h2>
              </div>
            </div>
            <div className="logo-real" style={{ maxWidth: 520 }}>
              <Image
                src="/brand/logo-cmdca.jpg"
                alt="Logo do CMDCA Pindamonhangaba"
                width={460}
                height={110}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
