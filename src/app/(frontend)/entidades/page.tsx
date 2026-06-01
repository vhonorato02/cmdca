import type { Metadata } from 'next'

import { Reveal } from '@/components/Reveal'
import { formatDate } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import type { Entidade } from '@/payload-types'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Registro de Entidades',
  description:
    'Organizações registradas e acompanhadas pelo CMDCA (arts. 90 e 91 do ECA) em Pindamonhangaba.',
}

const AREA_LABEL: Record<string, string> = {
  educacao: 'Educação',
  saude: 'Saúde',
  cultura_esporte: 'Cultura / Esporte',
  assistencia: 'Assistência social',
  acolhimento: 'Acolhimento',
  outro: 'Outra',
}

export default async function EntidadesPage() {
  const payload = await getPayloadClient()
  const res = await payload
    .find({
      collection: 'entidades',
      where: { _status: { equals: 'published' } },
      sort: 'nome',
      limit: 200,
      depth: 0,
    })
    .catch(() => ({ docs: [] as Entidade[] }))
  const docs = res.docs as Entidade[]

  return (
    <section className="band">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <span className="eyebrow">Sociedade civil</span>
              <h1>Registro de Entidades</h1>
              <p>
                Organizações da área da infância e da adolescência registradas e acompanhadas pelo
                conselho, conforme os arts. 90 e 91 do ECA.
              </p>
            </div>
          </div>
          {docs.length ? (
            <div style={{ display: 'grid', gap: 12 }}>
              {docs.map((e) => (
                <div className="lead-box" key={e.id}>
                  <div className="nm">{e.nome}</div>
                  <div className="ro">
                    {AREA_LABEL[e.area || 'outro'] || 'Área não informada'}
                    {e.registro ? ` · ${e.registro}` : ''}
                    {e.validade ? ` · validade ${formatDate(e.validade)}` : ''}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--ink-2)' }}>Nenhuma entidade registrada listada até o momento.</p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
