import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/Reveal'
import {
  ENTIDADE_SITUACAO,
  isPastDate,
  publicDocuments,
  statusInfo,
} from '@/components/officialActs'
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
  cultura_esporte: 'Cultura e esporte',
  assistencia: 'Assistência social',
  acolhimento: 'Acolhimento',
  outro: 'Outra área',
}

export default async function EntidadesPage() {
  const payload = await getPayloadClient()
  const res = await payload
    .find({
      collection: 'entidades',
      where: { _status: { equals: 'published' } },
      sort: 'nome',
      limit: 200,
      depth: 1,
    })
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
                Esta é a relação pública de organizações registradas no CMDCA, com a situação de
                cada registro informada pelo conselho: ativo, vencido, suspenso ou cancelado.
                Antes de usar a lista em um procedimento formal, confirme a situação vigente com o
                conselho.
              </p>
            </div>
          </div>
          {docs.length ? (
            <ul className="meeting-list" style={{ display: 'grid', gap: 12 }}>
              {docs.map((e) => {
                const situacao = statusInfo(ENTIDADE_SITUACAO, e.situacaoRegistro)
                const registro = publicText(e.registro)
                const documentos = publicDocuments(e.documentos)
                const validadePassou = e.situacaoRegistro === 'ativo' && isPastDate(e.validade)
                return (
                  <li className="lead-box entity" key={e.id}>
                    <h2 className="nm">
                      {publicText(e.nome)}{' '}
                      <span className={`pill status-${situacao.tone}`}>
                        <span className="sr-only">Situação: </span>
                        {situacao.label}
                      </span>
                    </h2>
                    <p className="ro">
                      {e.area ? AREA_LABEL[e.area] || 'Outra área' : 'Área não informada'}
                      {registro
                        ? ` · ${/^registro\b/i.test(registro) ? registro : `registro ${registro}`}`
                        : ''}
                      {e.validade ? (
                        <>
                          {' · validade até '}
                          <time dateTime={e.validade}>{formatDate(e.validade)}</time>
                        </>
                      ) : null}
                    </p>
                    {validadePassou ? (
                      <p className="ro entity-warning">
                        A data de validade publicada já passou. Confirme a situação atual com o
                        conselho.
                      </p>
                    ) : null}
                    {documentos.length ? (
                      <ul className="entity-docs">
                        {documentos.map((doc) => (
                          <li key={doc.key}>
                            <a
                              className="mini"
                              href={doc.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${doc.label}, de ${publicText(e.nome)} (PDF, abre em nova aba)`}
                            >
                              {doc.label} <span aria-hidden="true">↗</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                )
              })}
            </ul>
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
