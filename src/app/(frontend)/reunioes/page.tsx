import type { Metadata } from 'next'

import { Reveal } from '@/components/Reveal'
import { ReunioesLista, type ReuniaoItem } from '@/components/ReunioesLista'
import { getPayloadClient } from '@/lib/payload'
import type { Reunioe } from '@/payload-types'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Reuniões',
  description: 'Calendário, pautas e atas das reuniões do CMDCA de Pindamonhangaba.',
}

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

  const reunioes: ReuniaoItem[] = (res.docs as Reunioe[]).map((r) => ({
    id: r.id,
    titulo: r.titulo,
    data: r.data,
    tipo: r.tipo,
    local: r.local,
    ataUrl: typeof r.ata === 'object' && r.ata ? r.ata.url : null,
  }))

  return (
    <section className="band">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <span className="eyebrow">Reuniões abertas ao público</span>
              <h2>Calendário e atas</h2>
              <p>Filtre por ano e tipo. As atas em PDF ficam disponíveis após a aprovação.</p>
            </div>
          </div>
          <ReunioesLista reunioes={reunioes} />
          <div className="participate">
            <h3>As reuniões também são suas.</h3>
            <p>
              Qualquer cidadão pode acompanhar as reuniões do conselho. Consulte a pauta e participe
              presencialmente ou pela transmissão.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
