import type { Metadata } from 'next'

import { FaqAccordion } from '@/components/FaqAccordion'
import { Hero } from '@/components/Hero'
import { MapaRede, type Ponto } from '@/components/MapaRede'
import { Reveal } from '@/components/Reveal'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata, serializeJsonLd } from '@/lib/seo'
import { containsUnverifiedMarker, publicText } from '@/lib/site'
import type { Faq, RedeProtecao } from '@/payload-types'

export const revalidate = 300

export const metadata: Metadata = createMetadata({
  title: 'Proteção de Crianças e Adolescentes | Pindamonhangaba',
  description:
    'Em perigo imediato, ligue 190. Para denunciar violações de direitos, use o Disque 100 ou consulte a rede de proteção em Pindamonhangaba.',
  path: '/ajuda',
})

const DISQUE_100_URL = 'https://www.gov.br/pt-br/servicos/denunciar-violacao-de-direitos-humanos'
const TELEFONES_UTEIS_URL = 'https://pindamonhangaba.sp.gov.br/servicos-ao-cidadao/telefones-uteis'
const SEGUNDO_CT_URL =
  'https://pindamonhangaba.sp.gov.br/conselho-tutelar-de-moreira-cesar-passa-a-atuar-em-nova-sede-a-partir-do-dia-9-de-junho'

export default async function AjudaPage() {
  const payload = await getPayloadClient()
  const [rede, faq] = await Promise.all([
    payload
      .find({
        collection: 'rede-protecao',
        where: { _status: { equals: 'published' } },
        limit: 100,
        depth: 0,
      })
      .catch(() => ({ docs: [] as RedeProtecao[] })),
    payload
      .find({
        collection: 'faq',
        where: { _status: { equals: 'published' }, contexto: { in: ['ajuda', 'geral'] } },
        sort: 'ordem',
        limit: 50,
        depth: 0,
      })
      .catch(() => ({ docs: [] as Faq[] })),
  ])

  const pontos: Ponto[] = (rede.docs as RedeProtecao[]).flatMap((r) => {
    const nome = publicText(r.nome)
    if (!nome) return []
    return [
      {
        id: r.id,
        nome,
        tipo: r.tipo,
        endereco: publicText(r.endereco),
        telefone: publicText(r.telefone),
        lat: r.lat,
        lng: r.lng,
      },
    ]
  })
  const faqItems = (faq.docs as Faq[]).flatMap((f) => {
    const pergunta = publicText(f.pergunta)
    const resposta = publicText(f.resposta)
    return pergunta && resposta && !containsUnverifiedMarker([pergunta, resposta])
      ? [{ pergunta, resposta }]
      : []
  })
  const faqLd = faqItems.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.pergunta,
          acceptedAnswer: { '@type': 'Answer', text: item.resposta },
        })),
      }
    : null

  return (
    <>
      <Hero
        eyebrow="Proteção começa com o canal certo"
        titulo="Uma criança ou adolescente precisa de ajuda?"
        texto="Escolha a situação mais próxima da sua. Em perigo imediato, ligue 190."
      />

      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqLd) }}
        />
      ) : null}

      <div className="wrap" id="emergencia">
        <Reveal>
          <div className="help-cards">
            <div className="hc urgent">
              <svg className="icn ic" viewBox="0 0 24 24">
                <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
              </svg>
              <div>
                <h3>É uma emergência</h3>
                <p>Risco imediato à vida ou à integridade de uma criança ou adolescente.</p>
                <div className="num">
                  <a href="tel:190" aria-label="Ligar para a Polícia Militar no número 190">
                    190
                  </a>
                </div>
                <div className="when">Polícia Militar — atendimento imediato, 24 horas.</div>
              </div>
            </div>
            <div className="hc">
              <svg className="icn ic" viewBox="0 0 24 24">
                <path d="M3 11l18-5v12L3 18zM11 9v6" />
              </svg>
              <div>
                <h3>Quero denunciar uma violação de direitos</h3>
                <p>Use este canal em casos de violência, negligência, abuso ou suspeita.</p>
                <div className="num">
                  <a href="tel:100" aria-label="Ligar para o Disque 100">
                    Disque 100
                  </a>
                </div>
                <div className="when">
                  Atendimento gratuito e disponível 24 horas. A denúncia pode ser anônima.
                </div>
              </div>
            </div>
            <div className="hc">
              <svg className="icn ic" viewBox="0 0 24 24">
                <circle cx="12" cy="7" r="3" />
                <path d="M12 10v6m-4 5 4-5 4 5" />
              </svg>
              <div>
                <h3>Sou criança ou adolescente e preciso falar com alguém</h3>
                <p>
                  Se algo está machucando, assustando ou ameaçando você, peça ajuda. A culpa não é
                  sua.
                </p>
                <div className="num">
                  <a href="tel:100" aria-label="Ligar para o Disque 100">
                    Disque 100
                  </a>
                </div>
                <div className="when">A ligação é gratuita. Você pode denunciar sem se identificar.</div>
              </div>
            </div>
            <div className="hc">
              <svg className="icn ic" viewBox="0 0 24 24">
                <path d="M12 21s7-5 7-11a7 7 0 0 0-14 0c0 6 7 11 7 11Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <div>
                <h3>Conselhos Tutelares</h3>
                <p>
                  <b>1º Conselho Tutelar:</b> atendimento pelos telefones oficiais.
                </p>
                <div className="num">
                  <a href="tel:+551235500513">(12) 3550-0513</a> ·{' '}
                  <a href="tel:+551235500514">3550-0514</a>
                </div>
                <div className="when">
                  <b>2º Conselho Tutelar (Moreira César):</b> Av. das Hortências, 168, Vale das
                  Acácias · <a href="tel:+551236411688">(12) 3641-1688</a>. Confirme o plantão antes
                  de se deslocar.
                </div>
              </div>
            </div>
          </div>
          <div className="calm">
            <svg className="icn ic" viewBox="0 0 24 24" style={{ color: 'var(--alert)' }}>
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            <div>
              <b>Sua segurança importa.</b> A denúncia pelo Disque 100 pode ser anônima. Em caso de
              perigo imediato, ligue 190 antes de qualquer outra coisa.
            </div>
          </div>
          <p style={{ color: 'var(--ink-2)', marginTop: 16 }}>
            Fontes: serviço federal do{' '}
            <a href={DISQUE_100_URL} target="_blank" rel="noopener noreferrer">
              Disque 100
            </a>
            , página municipal de{' '}
            <a href={TELEFONES_UTEIS_URL} target="_blank" rel="noopener noreferrer">
              telefones úteis
            </a>{' '}
            e comunicado sobre a{' '}
            <a href={SEGUNDO_CT_URL} target="_blank" rel="noopener noreferrer">
              sede do Conselho Tutelar de Moreira César
            </a>
            .
          </p>
        </Reveal>
      </div>

      <section className="band" id="rede" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="wrap">
          <Reveal>
            <div className="sec-head">
              <div>
                <span className="eyebrow">Rede de proteção</span>
                <h2>Onde encontrar apoio na cidade</h2>
                <p>
                  Filtre por tipo de serviço. Os pontos no mapa são aproximados; confirme endereço
                  e horário antes de sair.
                </p>
              </div>
            </div>
            <MapaRede pontos={pontos} />
          </Reveal>
        </div>
      </section>

      {faqItems.length ? (
        <section className="band">
          <div className="wrap">
            <Reveal>
              <div className="sec-head">
                <div>
                  <span className="eyebrow">Dúvidas frequentes</span>
                  <h2>Dúvidas frequentes</h2>
                </div>
              </div>
              <FaqAccordion items={faqItems} />
            </Reveal>
          </div>
        </section>
      ) : null}
    </>
  )
}
