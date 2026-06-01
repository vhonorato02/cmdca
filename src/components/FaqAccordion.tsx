'use client'

import { useState } from 'react'

export type FaqItemData = { pergunta: string; resposta: string }

export function FaqAccordion({ items }: { items: FaqItemData[] }) {
  if (!items.length) return null
  return (
    <div className="faq">
      {items.map((f, i) => (
        <FaqItem key={i} {...f} />
      ))}
    </div>
  )
}

function FaqItem({ pergunta, resposta }: FaqItemData) {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen((o) => !o)
  return (
    <div className={open ? 'qitem open' : 'qitem'}>
      <div
        className="q"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggle()
          }
        }}
      >
        <h4>{pergunta}</h4>
        <span className="pm">+</span>
      </div>
      <div className="a">
        <div>{resposta}</div>
      </div>
    </div>
  )
}
