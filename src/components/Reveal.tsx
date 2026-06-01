'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Animação de entrada ao rolar (classe .reveal -> .in), como na prévia.
 * Sem JS, o CSS (html:not(.js) .reveal) mantém o conteúdo visível.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true)
            io.disconnect()
          }
        })
      },
      { threshold: 0.08 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const cls = ['reveal', shown ? 'in' : '', className].filter(Boolean).join(' ')
  return (
    <div ref={ref} className={cls}>
      {children}
    </div>
  )
}
