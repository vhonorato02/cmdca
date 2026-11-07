> Fotografia de 04/11/2026. Estado atual: [RELATORIO-FINAL.md](RELATORIO-FINAL.md) e [RISCOS.md](RISCOS.md).

# SEO, transparência e conteúdo verificado

**Provas atuais de rede:** home e ajuda HTTP 200 com metadata social/canônica aparente; `robots.txt` 200 com sitemap e exclusão de `/admin`/`/api`; `sitemap.xml` 200 com URLs públicas; `/admin/login` exibe `robots=noindex,nofollow`.

**Achado:** o HTML do login ainda traz `og:site_name=Payload App`, descrição e OG card genéricos do Payload. É débito de identidade/SEO de baixa prioridade, não razão para retirar o login do ar.

**Inspeção de código:** `src/app/sitemap.ts` consulta Payload e aplica `revalidate=3600`; notícias e páginas publicadas entram condicionadas a campos válidos. `next.config.ts` aplica `X-Robots-Tag` para API/Admin. O portal tem OG próprio. Não foram testadas todas as URLs internas nem PDFs e nenhum índice Search Console foi acessado.

**Governança editorial:** conferir com fonte oficial os cargos da diretoria, telefones, leis municipais, decisões, datas, editais, indicadores, atos, instruções para destinar IR e dados bancários do Fundo. Regra já prevista no código: `XXXX` fica como pendência interna, não entra em HTML público. Não preencher faltas usando texto genérico ou resultado de busca sem confirmação documental. Não replicar dados de menores.

**Próximas provas:** sitemap vs SSR e 404/despublicação, metadata em notícia/PDF, robots de ambientes antigos, HTML inicial sem JS, links WhatsApp com OG, registros de fonte/data/retificação, e aprovação jurídica das instruções fiscais.

## Confronto adicional com fontes oficiais

A pesquisa de 04/11/2026 encontra suporte documental para os limites de IR publicados (`3% / 6% / 1%`), os nomes/mandato da diretoria e os contatos principais dos Conselhos Tutelares. As referências, datas e ressalvas estão em [FONTES-OFICIAIS.md](FONTES-OFICIAIS.md). Essa checagem documental não confirma horários, plantão telefônico, existência de nova decisão de diretoria nem autoriza publicar dados financeiros.
