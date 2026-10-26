'use client'

import { AppLink as Link } from '@/components/ui/AppLink'

/**
 * Falha ao montar uma página. O texto fica no código de propósito: este
 * componente roda quando o servidor ou o banco não respondem, inclusive o CMS.
 */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <section className="not-found" aria-labelledby="erro-titulo">
      <div className="wrap not-found__inner">
        <p className="not-found__code" aria-hidden="true">
          500
        </p>
        <h1 id="erro-titulo">Esta página não carregou</h1>
        <p className="lead">
          O servidor não conseguiu montar o conteúdo agora. Tente de novo em alguns segundos. Se
          precisar de ajuda urgente, os telefones de proteção continuam no topo e na barra
          inferior.
        </p>
        <div className="actions">
          <button type="button" className="btn btn--primary" onClick={() => retry()}>
            Tentar de novo
          </button>
          <Link className="btn btn--secondary" href="/">
            Ir para o início
          </Link>
          <Link className="btn btn--signal" href="/ajuda">
            Buscar ajuda
          </Link>
        </div>
        {error.digest ? (
          <p className="not-found__digest">
            Código para o suporte: {error.digest}
          </p>
        ) : null}
      </div>
    </section>
  )
}
