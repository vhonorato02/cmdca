import type { Metadata } from 'next'

import { FaqList, publicFaq } from '@/components/FaqList'
import { MapaRede } from '@/components/MapaRede'
import { QuickExit } from '@/components/QuickExit'
import type { MapPoint } from '@/components/RedeMapInner'
import { SourceList } from '@/components/SourceList'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section } from '@/components/ui/Section'
import { Callout, EmptyState } from '@/components/ui/states'
import { COORDENADAS_APROXIMADAS } from '@/content/geo'
import { canaisDiscaveis, getTextos } from '@/lib/content'
import { phoneHref } from '@/lib/contact'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { publicText } from '@/lib/site'
import type { Faq, RedeProtecao } from '@/payload-types'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const textos = await getTextos()
  return createMetadata({
    title: 'Buscar ajuda: proteção de crianças e adolescentes | Pindamonhangaba',
    description: textos.ajuda.introducao,
    path: '/ajuda',
  })
}

const TIPO_LABEL: Record<string, string> = {
  creas: 'CREAS: atendimento especializado',
  cras: 'CRAS: assistência social perto de casa',
  casa: 'Casa dos Conselhos',
  outro: 'Outros serviços',
}
const TIPO_ORDEM = ['creas', 'cras', 'casa', 'outro']
const TIPO_COR: Record<string, string> = {
  ct: '#271A58',
  cras: '#1D6B3A',
  creas: '#B42318',
  casa: '#8A5300',
  outro: '#4A3D8F',
}

type Lugar = {
  id: number | string
  nome: string
  tipo: string
  endereco?: string
  telefone?: string
  horario?: string
}

const splitPhones = (value: string) => value.split(/\s*[·;]\s*/).filter(Boolean)

const directionsHref = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, Pindamonhangaba - SP`)}`

function PlaceCard({ lugar, headingLevel = 3 }: { lugar: Lugar; headingLevel?: 3 | 4 }) {
  const Heading = headingLevel === 4 ? 'h4' : 'h3'
  return (
    <li className="place">
      <Heading className="place__name">{lugar.nome}</Heading>
      {lugar.telefone ? (
        <p className="place__phones">
          {splitPhones(lugar.telefone).map((phone, index) => {
            const href = phoneHref(phone)
            return href ? (
              <a key={`${phone}-${index}`} href={href}>
                {phone}
              </a>
            ) : (
              <span key={`${phone}-${index}`}>{phone}</span>
            )
          })}
        </p>
      ) : null}
      {lugar.endereco ? <p>{lugar.endereco}</p> : null}
      {lugar.horario ? <p className="place__hours">{lugar.horario}</p> : null}
      {lugar.endereco ? (
        <p>
          <a href={directionsHref(lugar.endereco)} target="_blank" rel="noopener noreferrer">
            Ver rota até {lugar.nome}
            <span className="sr-only"> (abre o mapa em nova aba)</span>
          </a>
        </p>
      ) : null}
    </li>
  )
}

export default async function AjudaPage() {
  const payload = await getPayloadClient()
  const [textos, rede, faq] = await Promise.all([
    getTextos(),
    payload
      .find({
        collection: 'rede-protecao',
        where: { _status: { equals: 'published' } },
        sort: 'nome',
        limit: 100,
        depth: 0,
      })
      .catch(() => null),
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

  const t = textos.ajuda
  const canais = canaisDiscaveis(textos.protecao.canais)
  const lugares: Lugar[] = ((rede?.docs ?? []) as RedeProtecao[]).flatMap((r) => {
    const nome = publicText(r.nome)
    if (!nome) return []
    return [
      {
        id: r.id,
        nome,
        tipo: r.tipo,
        endereco: publicText(r.endereco),
        telefone: publicText(r.telefone),
        horario: publicText(r.horario),
      },
    ]
  })
  const conselhos = lugares.filter((l) => l.tipo === 'ct').sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  const outros = TIPO_ORDEM.map((tipo) => ({
    tipo,
    itens: lugares.filter((l) => (TIPO_ORDEM.includes(l.tipo) ? l.tipo : 'outro') === tipo),
  })).filter((grupo) => grupo.itens.length)

  const pontos: MapPoint[] = ((rede?.docs ?? []) as RedeProtecao[]).flatMap((r) => {
    const nome = publicText(r.nome)
    if (!nome) return []
    const fallback = COORDENADAS_APROXIMADAS[nome]
    const lat = typeof r.lat === 'number' ? r.lat : fallback?.[0]
    const lng = typeof r.lng === 'number' ? r.lng : fallback?.[1]
    if (lat === undefined || lng === undefined) return []
    return [
      {
        id: r.id,
        nome,
        lat,
        lng,
        color: TIPO_COR[r.tipo] ?? TIPO_COR.outro,
        endereco: publicText(r.endereco),
        telefone: publicText(r.telefone),
      },
    ]
  })

  return (
    <>
      <PageHeader title={t.titulo} lead={t.introducao} />
      <QuickExit />

      <Section id="emergencia" title="Ligue para o canal certo">
        <ul className="help-cards">
          {canais.map((canal) => (
            <li key={`${canal.tipo}-${canal.situacao}`} className={`help-card help-card--${canal.tipo}`}>
              <h3 className="help-card__title">{canal.situacao}</h3>
              <p>{canal.descricao}</p>
              {canal.href ? (
                <a
                  className={`btn help-card__call ${canal.tipo === 'emergencia' ? 'btn--danger' : 'btn--primary'}`}
                  href={canal.href}
                >
                  Ligar: {canal.numero}
                </a>
              ) : null}
              {canal.observacao ? <p className="help-card__note">{canal.observacao}</p> : null}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <Callout tone="signal" as="h3" title={textos.protecao.avisoTitulo}>
            <p>{textos.protecao.aviso}</p>
          </Callout>
        </div>
      </Section>

      <Section id="conselhos-tutelares" title={t.conselhosTitulo} lead={t.conselhosTexto} alt>
        {conselhos.length ? (
          <ul className="places">
            {conselhos.map((lugar) => (
              <PlaceCard key={lugar.id} lugar={lugar} />
            ))}
          </ul>
        ) : (
          <EmptyState as="h3" title="Contatos em atualização">
            Enquanto isso, ligue para o Disque 100 ou, em perigo imediato, para o 190.
          </EmptyState>
        )}
      </Section>

      <Section id="rede" title={t.redeTitulo} lead={t.redeTexto}>
        {rede === null ? (
          <EmptyState as="h3" title="Não foi possível carregar a rede de proteção">
            Tente de novo em alguns minutos. Os telefones de emergência acima continuam valendo.
          </EmptyState>
        ) : outros.length ? (
          <>
            {outros.map((grupo) => (
              <div key={grupo.tipo}>
                <h3 className="group-title">{TIPO_LABEL[grupo.tipo]}</h3>
                <ul className="places">
                  {grupo.itens.map((lugar) => (
                    <PlaceCard key={lugar.id} lugar={lugar} headingLevel={4} />
                  ))}
                </ul>
              </div>
            ))}
            <MapaRede pontos={pontos} />
          </>
        ) : (
          <EmptyState as="h3" title="Lista de serviços em atualização">
            Use os telefones de emergência e dos Conselhos Tutelares acima.
          </EmptyState>
        )}
      </Section>

      {publicFaq(faq.docs as Faq[]).length ? (
        <Section id="duvidas" title="Dúvidas frequentes" alt>
          <FaqList items={publicFaq(faq.docs as Faq[])} />
        </Section>
      ) : null}

      <Section>
        <SourceList items={t.fontes} />
      </Section>
    </>
  )
}
