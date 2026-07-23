'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Animação progressiva que nunca oculta o conteúdo quando o JavaScript falha.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!('IntersectionObserver' in window) || typeof el.animate !== 'function') return

    let animation: Animation | null = null
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animation = el.animate(
              [
                { transform: 'translateY(12px)' },
                { transform: 'translateY(0)' },
              ],
              { duration: 460, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'both' },
            )
            el.classList.add('in')
            io.disconnect()
          }
        })
      },
      { threshold: 0.08 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      animation?.cancel()
    }
  }, [])

  const cls = ['reveal', className].filter(Boolean).join(' ')
  return (
    <div ref={ref} className={cls}>
      {children}
    </div>
  )
}
