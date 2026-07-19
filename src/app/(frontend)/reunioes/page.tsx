import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/Reveal'
import { ReunioesLista, type ReuniaoItem } from '@/components/ReunioesLista'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { containsUnverifiedMarker, publicHref, publicText } from '@/lib/site'
import type { Reunioe } from '@/payload-types'

export const revalidate = 300

export const metadata: Metadata = createMetadata({
  title: 'Reuniões do CMDCA | Calendário, Pautas e Atas',
  description:
    'Consulte datas, locais, classificação e atas aprovadas das reuniões do CMDCA de Pindamonhangaba.',
  path: '/reunioes',
})

export default async function ReunioesPage() {
  const payload = await getPayloadClient()
  const res = await payload
    .find({
      collection: 'reunioes',
      where: { _status: { equals: 'published' } },
      sort: '-data',
      limit: 200,
      depth: 1,
    })
    .catch(() => ({ docs: [] as Reunioe[] }))

  const reunioes: ReuniaoItem[] = (res.docs as Reunioe[]).flatMap((r) => {
    const titulo = publicText(r.titulo)
    if (!titulo || containsUnverifiedMarker(r)) return []

    return [
      {
        id: r.id,
        titulo,
        data: r.data,
        tipo: r.tipo,
        local: publicText(r.local),
        ataUrl: typeof r.ata === 'object' && r.ata ? publicHref(r.ata.url) : null,
      },
    ]
  })

  return (
    <section className="band">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <span className="eyebrow">Agenda do colegiado</span>
              <h1>Calendário e atas</h1>
              <p>
                Filtre por ano e classificação. Consulte cada registro para verificar data, local e
                forma de acesso. As atas ficam disponíveis após aprovação e publicação.
              </p>
            </div>
          </div>
          <ReunioesLista reunioes={reunioes} />
          <div className="participate">
            <h3>Como acompanhar</h3>
            <p>
              Reuniões identificadas como públicas podem ser acompanhadas pela comunidade, conforme
              as informações divulgadas no calendário. Reuniões reservadas podem ocorrer quando a
              pauta exigir proteção de informações ou de direitos. A existência de transmissão só
              deve ser considerada quando houver link publicado no registro do encontro.
            </p>
            <p style={{ marginTop: 10 }}>
              Consulte também as <Link href="/resolucoes">resoluções</Link> aprovadas e a página de{' '}
              <Link href="/participe">participação</Link>.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
