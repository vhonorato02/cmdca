'use client'

import Link from 'next/link'

/**
 * Último recurso quando o próprio layout falha. Não carrega o CSS do site,
 * então traz estilos mínimos embutidos com as cores da marca.
 */
const CSS = `
body{margin:0;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#fff;color:#25242b;line-height:1.6}
.bar{background:#1a1140;color:#fff;padding:12px 24px;font-weight:700}
.bar a{color:#f6ec27;margin-left:12px}
main{max-width:40rem;margin:0 auto;padding:64px 24px}
.code{font-size:6rem;font-weight:900;color:#271a58;line-height:1;margin:0}
h1{color:#271a58;font-size:2rem;line-height:1.1;margin:16px 0}
button,a.btn{display:inline-flex;align-items:center;min-height:48px;padding:0 20px;border-radius:8px;font:inherit;font-weight:700;margin:8px 8px 0 0}
button{background:#271a58;color:#fff;border:0;cursor:pointer}
a.btn{border:2px solid #271a58;color:#271a58;text-decoration:none}
:focus-visible{outline:3px solid #271a58;box-shadow:0 0 0 7px #f6ec27}
`

export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="pt-BR">
      <body>
        <title>Erro no portal | CMDCA de Pindamonhangaba</title>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="bar">
          Em perigo? <a href="tel:190">Ligue 190</a>
          <a href="tel:100">Disque 100</a>
        </div>
        <main>
          <p className="code" aria-hidden="true">
            500
          </p>
          <h1>O portal não carregou</h1>
          <p>O servidor não respondeu como esperado. Tente de novo em alguns segundos.</p>
          <button type="button" onClick={() => retry()}>
            Tentar de novo
          </button>
          <Link className="btn" href="/">
            Ir para o início
          </Link>
        </main>
      </body>
    </html>
  )
}
