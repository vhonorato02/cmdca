'use client'

import { useId, useState } from 'react'

export type FaqItemData = { pergunta: string; resposta: string }

export function FaqAccordion({ items }: { items: FaqItemData[] }) {
  if (!items.length) return null
  return (
    <div className="faq">
      {items.map((f) => (
        <FaqItem key={f.pergunta} {...f} />
      ))}
    </div>
  )
}

function FaqItem({ pergunta, resposta }: FaqItemData) {
  const [open, setOpen] = useState(false)
  const buttonId = useId()
  const panelId = useId()

  return (
    <div className={open ? 'qitem open' : 'qitem'}>
      <h3 className="faq-heading">
        <button
          type="button"
          className="q"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span>{pergunta}</span>
          <span className="pm" aria-hidden="true">
            +
          </span>
        </button>
      </h3>
      <div className="a" id={panelId} role="region" aria-labelledby={buttonId} hidden={!open}>
        <div>{resposta}</div>
      </div>
    </div>
  )
}
