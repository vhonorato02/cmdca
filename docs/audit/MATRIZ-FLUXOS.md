> Fotografia de 04/11/2026. Estado atual: [RELATORIO-FINAL.md](RELATORIO-FINAL.md) e [RISCOS.md](RISCOS.md).

# Matriz de fluxos com evidência real
Legenda: **Leitura HTTP** = fetch anônimo da página; **Histórico CI** = execução anterior, não repetida agora; **Não verificado** = requer navegador, credencial ou banco isolado.

| Jornada/fluxo | Usuário e entrada | Resultado esperado | Situação nesta rodada | Próxima evidência |
|---|---|---|---|---|
| Home → ajuda | Anônimo, `/` → `/ajuda` | Conteúdo carregado, telefones acionáveis | Leitura HTTP: ambas 200; links `tel:190` e `tel:100` no HTML | Playwright toque, teclado, TalkBack e sem JS |
| Rede de proteção | Anônimo, `/ajuda` | Lista antes do mapa; contatos atualizados | HTML contém Conselho Tutelar/CRAS/CREAS; fonte e atualidade ainda não reverificadas em órgão oficial | Conferência documental e mapa em celular |
| Login CMS | Editor/jurídico/admin, `/admin/login` | Autenticação e troca de senha segura | Login carrega 200; **não autenticado** | Fixture Payload, senha provisória, expiração, 403 por API |
| Notícia draft → preview → publicar → retirar | Editor, `/admin` | Não publicar rascunho; publicar e despublicar com cache correto | Não verificado; código tem hooks e rotas | E2E + Postgres descartável + acesso anônimo após revogação |
| Reunião pública/reservada | Editor/anônimo | Acesso anônimo somente a públicas e PDFs permitidos | Código contém ACL e impedimento de ata reservada; não verificado em runtime | Criar fixtures e tentar download direto |
| Resoluções/editais | Anônimo, listas e PDF | Documento íntegro, filtros e estados | Rotas presentes e sitemap público; downloads não exercitados nesta rodada | Playwright + SHA de PDF público |
| Configurações/textos/menu | Editor | Publicação sem redeploy e versão anterior recuperável | Não verificado | E2E de global + verificação SSR |
| Robôs/sitemap/manifest | Anônimo | Canonical e conteúdo indexável sem CMS | HTTP 200 em `robots.txt`, `sitemap.xml`, `manifest.webmanifest` | Validação URL a URL + noindex de previews e PDFs reservados |
| App instalado/offline/push | Android/Desktop | Comportamento documentado e confiável | Manifest tem `display=browser`; SW e push não encontrados | Teste Chrome e Samsung Internet em dispositivo, se implementado |
| Health | Monitor, `/api/health` | Status sem expor segredos | HTTP 200 com `{"status":"ok"}` | Health no exato SHA novo pós-deploy |
| CI → GHCR → VPS → rollback | Operador | Gates antes da promoção, retorno seguro | Deploy anterior `cc437d7` aprovado segundo Actions; nova mudança `f630bda` foi disparada | Resultado da run `41955135317`, SHA live, rollback isolado |
| Restore de banco + mídia | Operador | Mesmo ponto lógico e checksum | Não verificado; acesso VPS ausente | Restore isolado e registro RPO/RTO |
| Portal Vercel legado | Anônimo, `cmdca.vercel.app/admin` | Legado descomissionado com dados protegidos | Login antigo 200; deployment antigo READY | Export, bloqueio de edição, pausa autorizada |

Matriz de dispositivos pendente: 320, 360, 390, 430, 768, 1024, 1280, 1440, 1920 px; Android Samsung Internet/Chrome, desktop Chrome/Edge/Firefox, zoom 200/400%, leitor de tela e rede lenta. Não converter os testes listados em “aprovados” sem executar.

## Varredura HTTP ampliada em 04/11/2026
Consulta pública sem autenticação, apenas leitura, sem navegador interativo:
`/conselho`, `/fmdca`, `/reunioes`, `/resolucoes`, `/editais`, `/transparencia`, `/noticias`, `/conferencias`, `/entidades`, `/participe` e `/mapa-do-site`: **11/11 responderam 200**. Nenhum corpo em Markdown retornado apresentou `XXXX`. `/nao-existe-auditoria-2026` respondeu **404**, como esperado.

`/reunioes` explica que o calendário ainda não foi publicado e `/entidades` indica relação não publicada; estes são estados vazios explícitos, não falhas 500. `/resolucoes` exibiu um ato e `/editais` um edital, ambos com links para PDF e publicação oficial. **Não foram abertos/analisados os bytes dos PDFs** nem verificados todos os links, PDFs, filtros, status legais ou atualidade dos registros. Essas respostas HTTP não identificam SHA de produção, disponibilidade de back-end sob carga ou conformidade WCAG.

## APIs públicas: leitura e limites
| Entrada GET anônima | Estado observado | Limite |
|---|---|---|
| `/api/users?limit=1` | 403 | Listagem negada, não prova de todas as rotas de conta |
| `/api/preferences?limit=1` | 404 | Endpoint ausente, sem evidência de bypass |
| `/api/media?limit=2&depth=0` | 200; total 3; amostra sem campos internos | Inspecionados apenas 2 registros |
| `/api/noticias?limit=1&depth=0` | 200; total 16; amostra sem controle editorial | Inspecionado 1 registro |
| `/api/reunioes?limit=1&depth=0` | 200; total 0 | Não exercitado documento reservado sintético |
| `/api/graphql` | 405 para GET | Sem POST e sem teste de introspection |

## Manifesto após deploy
`/manifest.webmanifest` 200, `display:standalone`, atalho inicial `/ajuda` e quatro PNGs disponíveis. Quality/build/deploy do commit `22d2146` aprovados em `41956344743`. Falta teste interativo de instalação, navegação standalone, back e safe areas no Android; offline/push não implementados.
