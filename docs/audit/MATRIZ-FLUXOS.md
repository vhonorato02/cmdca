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
