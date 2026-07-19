import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/Reveal'
import { formatDate } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { publicText } from '@/lib/site'
import type { Entidade } from '@/payload-types'

export const revalidate = 300

export const metadata: Metadata = createMetadata({
  title: 'Entidades Registradas no CMDCA de Pindamonhangaba',
  description:
    'Consulte organizações, números de registro e validade do cadastro no CMDCA de Pindamonhangaba, quando informados.',
  path: '/entidades',
})

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
  const docs = (res.docs as Entidade[]).filter((item) => publicText(item.nome))

  return (
    <section className="band">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <span className="eyebrow">Sociedade civil</span>
              <h1>Entidades registradas</h1>
              <p>
                Relação pública de organizações cadastradas no CMDCA. O número e a validade aparecem
                somente quando informados no registro publicado. Consulte o conselho para confirmar
                a situação vigente antes de usar esta lista em procedimento formal.
              </p>
            </div>
          </div>
          {docs.length ? (
            <div style={{ display: 'grid', gap: 12 }}>
              {docs.map((e) => (
                <div className="lead-box" key={e.id}>
                  <div className="nm">{publicText(e.nome)}</div>
                  <div className="ro">
                    {AREA_LABEL[e.area || 'outro'] || 'Área não informada'}
                    {publicText(e.registro) ? ` · registro ${publicText(e.registro)}` : ''}
                    {e.validade ? ` · validade ${formatDate(e.validade)}` : ''}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--ink-2)' }}>
              Nenhuma entidade registrada listada até o momento.
            </p>
          )}
          <div className="participate" style={{ marginTop: 28 }}>
            <h2>Precisa de orientação sobre registro ou renovação?</h2>
            <p>
              Os requisitos dependem do programa e dos atos vigentes. Consulte os{' '}
              <Link href="/editais">editais</Link>, as <Link href="/resolucoes">resoluções</Link> e
              os canais da página <Link href="/participe">Participe</Link> antes de protocolar
              documentos.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
