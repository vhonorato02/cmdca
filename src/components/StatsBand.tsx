'use client'

import { useEffect, useRef, useState } from 'react'

export type StatItem = { value: number; label: string }

/** Faixa de indicadores com contagem animada (portada da prévia: target/40, 22ms). */
export function StatsBand({
  stats,
  className,
  style,
}: {
  stats: StatItem[]
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [run, setRun] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setRun(true)
            io.disconnect()
          }
        }),
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className={className ? `stats ${className}` : 'stats'} style={style} ref={ref}>
      {stats.map((s, i) => (
        <div className="stat" key={i}>
          <b>
            <Counter target={s.value} run={run} />
          </b>
          <span>{s.label}</span>
        </div>
      ))}
    </div>
  )
}

function Counter({ target, run }: { target: number; run: boolean }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!run) return
    let c = 0
    const inc = target / 40
    const k = setInterval(() => {
      c += inc
      if (c >= target) {
        c = target
        clearInterval(k)
      }
      setVal(Math.floor(c))
    }, 22)
    return () => clearInterval(k)
  }, [run, target])
  return <>{val.toLocaleString('pt-BR')}</>
}
