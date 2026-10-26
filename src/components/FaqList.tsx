import { Plus } from '@/components/ui/icons'
import { serializeJsonLd } from '@/lib/seo'
import { containsUnverifiedMarker, publicText } from '@/lib/site'
import type { Faq } from '@/payload-types'

export type FaqItem = { pergunta: string; resposta: string }

export function publicFaq(docs: Faq[]): FaqItem[] {
  return docs.flatMap((f) => {
    const pergunta = publicText(f.pergunta)
    const resposta = publicText(f.resposta)
    return pergunta && resposta && !containsUnverifiedMarker([pergunta, resposta])
      ? [{ pergunta, resposta }]
      : []
  })
}

/**
 * Perguntas frequentes com <details> nativo: abre e fecha sem JavaScript, por
 * teclado e leitor de tela. Inclui os dados estruturados FAQPage.
 */
export function FaqList({ items }: { items: FaqItem[] }) {
  if (!items.length) return null
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: item.resposta },
    })),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(ld) }} />
      <div className="faq">
        {items.map((item) => (
          <details key={item.pergunta}>
            <summary>
              <span>{item.pergunta}</span>
              <Plus />
            </summary>
            <p className="faq__answer">{item.resposta}</p>
          </details>
        ))}
      </div>
    </>
  )
}
