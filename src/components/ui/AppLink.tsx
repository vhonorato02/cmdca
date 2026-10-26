import Link from 'next/link'
import type { ComponentProps } from 'react'

/**
 * Link interno do site público, sem pré-busca automática. Em celulares com
 * rede lenta, pré-buscar cada rota visível gastava dados e processamento no
 * carregamento (medido no Lighthouse). A navegação continua sem recarregar a
 * página; a rota só é buscada no clique.
 */
export function AppLink(props: ComponentProps<typeof Link>) {
  return <Link prefetch={false} {...props} />
}
