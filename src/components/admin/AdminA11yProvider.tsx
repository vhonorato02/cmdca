'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/**
 * Acrescenta o landmark principal que o shell do Payload não fornece.
 * A tela de login também precisa de um h1; nas demais rotas, cada view
 * administrativa continua responsável pelo próprio título.
 */
export default function AdminA11yProvider({ children }: { children?: ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname.endsWith('/login')

  return (
    <main className="cmdca-admin-main">
      {isLogin ? <h1 className="cmdca-admin-sr-only">Painel administrativo do CMDCA</h1> : null}
      {children}
    </main>
  )
}
