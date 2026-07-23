import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Hero } from '@/components/Hero'
import { Reveal } from '@/components/Reveal'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { publicText } from '@/lib/site'

export const revalidate = 300

export const metadata: Metadata = createMetadata({
  title: 'CMDCA de Pindamonhangaba | Composição e Atribuições',
  description:
    'Conheça a composição, as atribuições, a base legal e os atos públicos do CMDCA de Pindamonhangaba.',
  path: '/conselho',
})

const ECA_URL = 'https://www.planalto.gov.br/ccivil_03/leis/l8069compilado.htm'
const COMPOSICAO_URL =
  'https://pindamonhangaba.sp.gov.br/prefeitura-recebe-cerimonia-de-posse-do-cmdca'
const FUNDO_LEI_SOURCE_URL =
  'https://sapl.pindamonhangaba.sp.leg.br/pysc/download_materia_pysc?cod_materia=MzI0MDE%3D&texto_original=1'

export default async function ConselhoPage() {
  const payload = await getPayloadClient()
  const config = await payload.findGlobal({ slug: 'configuracoes' }).catch(() => null)
  const dir = config?.diretoria
  const base = config?.baseLegal
  const leiCMDCA = publicText(base?.leiCMDCA) || 'Lei Municipal nº 2.626/1991'
  const leiFundo = publicText(base?.leiFMDCA) || 'Lei Municipal nº 4.140/2004'
  const regimento = publicText(base?.regimento)

  return (
    <>
      <Hero
        deep
        eyebrow="Institucional"
        titulo="O Conselho Municipal dos Direitos da Criança e do Adolescente"
        texto="Órgão paritário que delibera e acompanha a política municipal de atendimento, nos termos do art. 88 do ECA."
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
                  Poder público e sociedade civil, com o mesmo número de cadeiras.
                </h2>
                <p>
                  O CMDCA é <b>paritário</b>: poder público e sociedade civil têm o mesmo número de
                  cadeiras no colegiado. As reuniões podem ser ordinárias ou extraordinárias. O
                  acesso depende da pauta e das regras aplicáveis a cada sessão.
                </p>
                <p style={{ marginTop: 16 }}>
                  Entre suas atribuições estão deliberar sobre os recursos do Fundo, registrar e
                  acompanhar entidades e programas e conduzir o processo de escolha do Conselho
                  Tutelar, sob fiscalização do Ministério Público.
                </p>
              </div>
              <div className="lead-box">
                <span className="k">{publicText(dir?.gestaoLabel) || 'Gestão 2025–2027'}</span>
                <div className="nm">Representação paritária</div>
                <p className="ro" style={{ marginTop: 8 }}>
                  Consulte a publicação oficial para conferir titulares, suplentes e a vigência da
                  composição.
                </p>
                <a
                  className="mini"
                  href={COMPOSICAO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', marginTop: 14 }}
                >
                  Ver composição publicada pela Prefeitura
                </a>
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
                <h3
                  style={{
                    fontFamily: 'var(--serif)',
                    fontWeight: 600,
                    fontSize: '1.12rem',
                    marginBottom: 5,
                  }}
                >
                  Deliberar sobre o Fundo Municipal
                </h3>
                <p style={{ fontSize: '.9rem', color: 'var(--ink-2)' }}>
                  Definir prioridades e deliberar sobre a aplicação dos recursos. Os atos devem ser
                  públicos e submetidos ao controle social.
                </p>
              </div>
              <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--line)' }}>
                <h3
                  style={{
                    fontFamily: 'var(--serif)',
                    fontWeight: 600,
                    fontSize: '1.12rem',
                    marginBottom: 5,
                  }}
                >
                  Registrar e acompanhar entidades
                </h3>
                <p style={{ fontSize: '.9rem', color: 'var(--ink-2)' }}>
                  Registrar e fiscalizar entidades e programas, conforme os arts. 90 e 91 do ECA.
                </p>
              </div>
              <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--line)' }}>
                <h3
                  style={{
                    fontFamily: 'var(--serif)',
                    fontWeight: 600,
                    fontSize: '1.12rem',
                    marginBottom: 5,
                  }}
                >
                  Organizar o processo de escolha do Conselho Tutelar
                </h3>
                <p style={{ fontSize: '.9rem', color: 'var(--ink-2)' }}>
                  Regulamentar e conduzir o processo, que ocorre sob fiscalização do Ministério
                  Público, conforme o art. 139 do ECA.
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
                  Consulte a publicação oficial para verificar nomes, representação e vigência da
                  composição atual.
                </p>
              </div>
            </div>
            <div className="lead-box" style={{ maxWidth: 560 }}>
              <span className="k">Lista nominal paritária</span>
              <p style={{ marginTop: 8, color: 'var(--ink-2)', fontSize: '.92rem' }}>
                Acesse a{' '}
                <a href={COMPOSICAO_URL} target="_blank" rel="noopener noreferrer">
                  notícia oficial da cerimônia de posse
                </a>{' '}
                e o ato municipal correspondente. Esta página não reproduz a lista nominal sem
                confirmação de grafia e vigência.
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
                <span>{leiCMDCA}</span>
              </div>
              <div className="ver">
                <span>Lei municipal do Fundo</span>
                <span>
                  <a href={FUNDO_LEI_SOURCE_URL} target="_blank" rel="noopener noreferrer">
                    {leiFundo}
                  </a>
                </span>
              </div>
              {regimento ? (
                <div className="ver">
                  <span>Regimento interno</span>
                  <span>{regimento}</span>
                </div>
              ) : null}
              <div className="ver" style={{ borderBottom: 'none' }}>
                <span>Base federal</span>
                <span>
                  <a href={ECA_URL} target="_blank" rel="noopener noreferrer">
                    ECA — Lei Federal nº 8.069/1990
                  </a>
                </span>
              </div>
            </div>
            <p style={{ color: 'var(--ink-2)', marginTop: 16 }}>
              Atos complementares e versões publicadas do regimento podem ser consultados em{' '}
              <Link href="/resolucoes">Resoluções</Link>.
            </p>
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
