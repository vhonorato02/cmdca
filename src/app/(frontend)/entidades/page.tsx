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
  title: 'Entidades Registradas no CMDCA | Pindamonhangaba',
  description:
    'Consulte as entidades registradas no CMDCA, com número de registro e validade quando essas informações estiverem publicadas.',
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
                Esta é a relação pública de organizações registradas no CMDCA. Número e validade só
                aparecem quando constam no registro publicado. Antes de usar a lista em um
                procedimento formal, confirme a situação vigente com o conselho.
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
              Não há entidades registradas listadas nesta página no momento.
            </p>
          )}
          <div className="participate" style={{ marginTop: 28 }}>
            <h2>Precisa de orientação sobre registro ou renovação?</h2>
            <p>
              Os requisitos variam conforme o programa e os atos vigentes. Antes de protocolar
              documentos, consulte os{' '}
              <Link href="/editais">editais</Link>, as <Link href="/resolucoes">resoluções</Link> e
              os canais da página <Link href="/participe">Participe</Link>.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
