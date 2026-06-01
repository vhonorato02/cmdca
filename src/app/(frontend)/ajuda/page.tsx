import type { Metadata } from 'next'

import { FaqAccordion } from '@/components/FaqAccordion'
import { Hero } from '@/components/Hero'
import { MapaRede, type Ponto } from '@/components/MapaRede'
import { Reveal } from '@/components/Reveal'
import { getPayloadClient } from '@/lib/payload'
import type { Faq, RedeProtecao } from '@/payload-types'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Preciso de ajuda',
  description:
    'Emergência (190), denúncia (Disque 100), Conselho Tutelar e a rede de proteção de Pindamonhangaba.',
}

export default async function AjudaPage() {
  const payload = await getPayloadClient()
  const [rede, faq] = await Promise.all([
    payload
      .find({ collection: 'rede-protecao', where: { _status: { equals: 'published' } }, limit: 100, depth: 0 })
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

  const pontos: Ponto[] = (rede.docs as RedeProtecao[]).map((r) => ({
    id: r.id,
    nome: r.nome,
    tipo: r.tipo,
    endereco: r.endereco,
    telefone: r.telefone,
    lat: r.lat,
    lng: r.lng,
  }))
  const faqItems = (faq.docs as Faq[]).map((f) => ({ pergunta: f.pergunta, resposta: f.resposta }))

  return (
    <>
      <Hero
        eyebrow="Você está no lugar certo"
        titulo="Se uma criança ou adolescente precisa de proteção, ajudamos a encontrar o caminho."
        texto="Você não precisa resolver tudo sozinho(a). Escolha abaixo a situação mais próxima da sua."
      />

      <div className="wrap">
        <div className="reveal">
          <div className="help-cards">
            <div className="hc urgent">
              <svg className="icn ic" viewBox="0 0 24 24">
                <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
              </svg>
              <div>
                <h3>É uma emergência</h3>
                <p>Risco imediato à vida ou à integridade de uma criança ou adolescente.</p>
                <div className="num">190</div>
                <div className="when">Polícia Militar — atendimento imediato, 24 horas.</div>
              </div>
            </div>
            <div className="hc">
              <svg className="icn ic" viewBox="0 0 24 24">
                <path d="M3 11l18-5v12L3 18zM11 9v6" />
              </svg>
              <div>
                <h3>Quero denunciar uma violação</h3>
                <p>Suspeita ou conhecimento de violência, negligência ou abuso.</p>
                <div className="num">Disque 100</div>
                <div className="when">Anônimo e gratuito, 24h. Em Pinda, também pelo Conselho Tutelar.</div>
              </div>
            </div>
            <div className="hc">
              <svg className="icn ic" viewBox="0 0 24 24">
                <circle cx="12" cy="7" r="3" />
                <path d="M12 10v6m-4 5 4-5 4 5" />
              </svg>
              <div>
                <h3>Sou criança ou adolescente</h3>
                <p>
                  Se algo está te machucando ou te assustando, você pode pedir ajuda. A culpa nunca é
                  sua.
                </p>
                <div className="num">Disque 100</div>
                <div className="when">É de graça e você não precisa se identificar.</div>
              </div>
            </div>
            <div className="hc">
              <svg className="icn ic" viewBox="0 0 24 24">
                <path d="M12 21s7-5 7-11a7 7 0 0 0-14 0c0 6 7 11 7 11Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <div>
                <h3>Conselho Tutelar de Pindamonhangaba</h3>
                <p>
                  <b>1º CT</b> — R. Aníbal de Jesus Pinto Monteiro, 237, Alto do Cardoso.
                </p>
                <div className="num">(12) 3550-0513 · 3550-0514</div>
                <div className="when">
                  <b>2º CT (Moreira César):</b> (12) 3641-1688 · seg a sex, 7h30–17h30. Plantão fora do
                  horário pela escala da Prefeitura.
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
        </div>
      </div>

      <section className="band" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="wrap">
          <Reveal>
            <div className="sec-head">
              <div>
                <span className="eyebrow">Rede de proteção</span>
                <h2>Onde encontrar apoio na cidade</h2>
                <p>
                  Filtre por tipo de serviço. Localizações aproximadas — confirme o endereço antes de
                  ir.
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
                  <h2>Perguntas que recebemos</h2>
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
