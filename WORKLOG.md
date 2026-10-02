# WORKLOG

## Objetivo e aceite
Auditar e corrigir o portal CMDCA de Pindamonhangaba até entrega verificável, mantendo Next.js/Payload, Neon e R2 existentes. Aceite: navegação pública e CMS funcionais, autorização coerente, dados não inventados, testes reais, QA em 1440/1024/768/390, build/deploy pelo GitHub Actions e validação da URL publicada.

## Estado verificado em 2026-09-27
- Pasta inicial tinha 113 arquivos versionados ausentes (src, public e tests), HEAD 236223c. Restaurados de HEAD nesta sessão; git status ficou limpo. Isso recupera a base, não comprova qualidade.
- Repositório: vhonorato02/cmdca, branch main. GitHub CLI autenticado com permissão ADMIN.
- Serviços configurados: Neon/PostgreSQL e R2. Não executar seed nem mutações de teste sobre a base operacional.
- Instalação anterior iniciou reconstrução de node_modules após pnpm recusar falta de TTY. Processo já terminou; scripts lint e test iniciados nesta retomada. Nenhum resultado aprovado ainda.
- Vercel vinculada pelo .vercel/project.json. Não existe workflow próprio de entrega na árvore inicial. Secrets GitHub listados sem entradas.
- Fonte possui publicação liberada a editores, diferente dos manuais antigos. Verificar intenção no histórico e corrigir documentação/defeitos, sem assumir que os manuais têm precedência.

## Escopo da primeira versão
Cidadãos encontram proteção, atos, reuniões, notícias, entidades e orientações do Fundo. Equipe autenticada mantém conteúdo no CMS, sem expor rascunhos/reuniões reservadas/metadados internos. Preservar identidade e conteúdo comprovado. Sem serviços adicionais, dados fictícios ou reescrita arbitrária.

## Trabalho em andamento
- Coordenador: runtime, infraestrutura de entrega, integração e evidências.
- programmer: access/hooks/collections/fields/security e testes, sem mutação remota.
- verifier: auditoria somente leitura de frontend, links, SEO e conteúdo.

## Pendências explícitas
- Lint, tipos, testes e dependências ainda em validação.
- QA renderizado nas quatro larguras ainda não executado.
- Verificar credenciais de entrega GitHub Actions/Vercel, SMTP e domínio real.
- Confirmar acesso autenticado CMS e testar fluxos sem contaminar produção.
- Auditoria de persistência, segurança, conteúdo, falhas de rede e deploy ainda aberta.

## Próxima ação
Concluir baseline dos testes, levantar publicação atual e iniciar servidor de desenvolvimento.

## Marco de implementação e verificação
- Dependências instaladas com lockfile congelado: Next 16.3.6, Payload 3.90.2, Sharp 0.35.5, Vitest 4.1.11. Auditoria pnpm passou de 50 avisos (2 críticos) para zero; evidência test-results/dependency-audit-final.json.
- Após atualização: 55 testes em 11 arquivos passaram; tsc sem erros, ESLint sem erros.
- Corrigidos autorização com papéis desconhecidos, acesso anônimo a usuários, desbloqueio de contas limitado a admin e bypass de validação publicada via draft=true. Revisão independente pendente.
- Reuniões agora exibem horário, modalidade, link e pauta. Removidos filtros de acesso confundidos com tipo.
- Sanitização de links e pendências públicas, rodapé, menu em resize e aviso de falha do tradutor revisados.
- QA inicial: 16 páginas públicas renderizadas em quatro larguras, HTTP 200, sem overflow horizontal ou salto de heading. Alvos pequenos encontrados e CSS corrigido; precisa repetir matriz após correção. Capturas/relatório em test-results/portal-audit. Não confundir medições com inspeção visual concluída de todas as capturas.
- Testes Playwright de acessibilidade e auditoria GET API pública em andamento; sessões atuais devem ser consultadas antes de reiniciar.
- Navegador nativo indisponível por browser-service.mjs ausente; Playwright Chromium instalado foi executado com sucesso.
- Produção existente confirmada pelo conector Vercel: commit 236223c de 23/07/2026, alias cmdca.vercel.app. Não houve novo deploy.
- GitHub sem secrets na última conferência. Foi solicitado cadastrar VERCEL_TOKEN no repositório, sem enviar token no chat. SMTP local ausente; envio real não verificado.
- Especialista designer falhou por quota. Agents antigos ficaram not_found na retomada. Dois novos especialistas: verifier revisão segurança e operations pipeline. Conferir seus resultados/arquivos antes de integrar.

## Próxima ação atual
Concluir Playwright/API e corrigir achados, repetir capturas finais e preparar CI remoto. Objetivo permanece ativo.

## Marco de 29/09/2026: schema, autorização e CI
- Revalidados HEAD local/remoto 236223c e ausência de novo deploy. Servidor anterior ausente; pnpm dev iniciado (sessão 88096).
- Gerada pela CLI Payload, sem conexão/aplicação ao banco, a migração 20260929_150216_payload_upgrade_compatibility e snapshot completo. Acrescenta três colunas nullable de autenticação/S3 e remove defaults editoriais que não existem mais na configuração. Sem remoção de registros ou backfill.
- readVersions explícito em todas as coleções/globals versionadas; campos bancários e indicadores validam papel conhecido.
- pnpm check concluído: lint e TypeScript aprovados, 58 testes em 12 arquivos aprovados.
- Pipeline Qualidade usa Postgres efêmero e fixtures com trava para GitHub Actions/localhost/cmdca_test. Inclui integração CMS, build remoto e Playwright. Produção depende desse job reutilizável. Execução remota ainda pendente.
- Smoke passou a exigir formulário de login e APIs funcionais, além de HTTP 200. Corrigida dependência do arquivo ignorado .vercel/project.json no runner.
- README/manuais corrigidos para editor publicar e build/deploy/migrações de produção via Actions.
- VERCEL_ORG_ID e VERCEL_PROJECT_ID cadastrados e listados no GitHub. VERCEL_TOKEN continua ausente. SMTP real e upload R2 não verificados.
- QA visual continua com verifier; não considerar CMS local aprovado enquanto schema operacional estiver sem migração.

Próxima ação: integrar a revisão dos especialistas e executar Qualidade no GitHub Actions; resolver falhas com evidência do runner.

## CI remoto e interações verificadas
- Commits 4a5da01 e f0e4c03 publicados na main. Git HTTPS rejeitou workflows por falta de escopo OAuth workflow; o conector GitHub da mesma conta publicou os commits por atualização fast-forward, confirmada por API e fetch. Nenhum force-push.
- Actions 36588206664 aplicou todas as migrações e aprovou integração CMS (log 15:11:48 UTC). O processo não encerrou após as asserções; run cancelado automaticamente pela revisão seguinte. Identificado lifecycle persistente do Payload, correção encerra pool e processo somente após sucesso.
- Actions 36589062772 iniciou para f0e4c03. Build/deploy ainda não aprovados.
- Novos testes de interação: 4 desktop + 4 mobile aprovados, cobrindo simulador vazio/negativo/extremo, falha de rede VLibras, menu resize e recuperação 404.
- Playwright mudou default para localhost, origem aceita pelo servidor de desenvolvimento. Catch-all público agora usa a página 404 institucional; antes retornava fallback em inglês.
- CSS dos contatos de Participe corrigido; verifier revalida quatro larguras e capturas da 404.
- Risco de rollback da migração: down remove colunas adicionadas; não executar rollback de schema sobre produção sem backup/revisão. Up e snapshot revisados independentemente e executados com sucesso no PostgreSQL efêmero.

Próxima ação: publicar encerramento correto do teste CMS, acompanhar Actions até build e navegador, corrigir os achados remanescentes. Token Vercel, SMTP e upload real continuam pendentes.

## Verificação adicional em 29/09/2026
- Commits 6981dba e d69ade8 publicados. Actions 36590251825 passou migrations, integração CMS, lint/tipos/testes e build de produção. Etapa HTTP/Playwright ainda em execução, não afirmar pipeline completo aprovado.
- Auditoria corrente encontrou 4 avisos novos no lock anterior; corrigidos fast-uri 3.1.7, undici 7.29.1 e nodemailer 10.0.2. pnpm install --frozen-lockfile e pnpm audit concluídos, zero vulnerabilidades reportadas em test-results/dependency-audit-current.json.
- Nodemailer 10 integrado por createTransport tipado. Adaptador Payload validado com JSON transport em memória, sem envio SMTP. pnpm check novamente aprovado com 58 testes.
- Playwright público mobile: 39/39 aprovados, incluindo axe nas 16 páginas públicas. CMS local excluído explicitamente por depender da migração operacional ainda não aplicada.
- Interações desktop/mobile: 4+4 aprovadas. 404 novamente aprovada após título específico, HTTP404 e robots noindex/nofollow.
- Verifier concluiu revalidação Participe e 404 em 1440/1024/768/390: zero alvos menores que44 e sem overflow. Evidências current-audit-summary.json e capturas portal-audit. Relatório antigo não comprova inspeção visual de todas as páginas/notícias individuais; cobertura adicional ainda precisa concluir.
- Todos os especialistas desta rodada encerrados. Produção ainda não recebeu deploy nem migração. VERCEL_TOKEN continua ausente; IDs já cadastrados.

Próxima ação: obter resultado do Actions36590251825 e corrigir o que falhar antes de publicar produção; concluir cobertura visual e integrações reais.

## CI e revisão visual confirmados em 29/09/2026
- Actions36597567106 (0fd8852) aprovado: migrações PostgreSQL16 efêmero, integração CMS, lint/tipos,58 testes unitários, build remoto, smoke e90 testes Playwright.
- Actions36598320988 (f0ddba1) confirmou as mesmas etapas até build e90 testes de navegador, mas4 testes novos falharam. Diagnóstico: requisições Node do teste de sessão não incluíam Origin/Sec-Fetch-Site exigidos pelo Payload; login pelo formulário chegou ao painel. Filtro Ano tem nome acessível composto pelo label e opções, incompatível com seletor exato do teste. Correções mantêm asserções de autorização e usam fetch do navegador.
- Verifier inspecionou88 capturas,22 rotas em1440/1024/768/390. Encontrou breadcrumbs de3 notícias abaixo de44px; CSS corrigido e revalidação em curso. Duas notícias publicadas no banco contêm [A CONFIRMAR] e o frontend as oculta com404. Pendência editorial real, conteúdo operacional preservado.
- Regex de pendência corrigida para não rejeitar a palavra independência; regressão incluída.
- Auditoria visual autenticada do CMS será executada no banco isolado do Actions. Capturas não devem ser confundidas com inspeção visual concluída.
- Nenhum deploy ou migração operacional executado. GitHub ainda sem VERCEL_TOKEN; SMTP e R2 reais em verificação independente.

Próxima ação: aprovar a revisão final no CI, inspecionar capturas CMS e concluir publicação quando a credencial Vercel estiver disponível.

## Integrações e rastreabilidade de entrega
- R2 real aprovado com objeto temporário único: PUT condicional, GET com comparação byte a byte e SHA256, DELETE e confirmação404. Script revisado reexecutado em29/09/2026 às16:47UTC, relatório storage-verification.json com cleanup completed. Nenhum registro CMS alterado.
- Credencial Vercel ausente no ambiente, nos arquivos padrão da CLI e nos secrets do repositório/ambiente production. Conector get_project apresenta incompatibilidade de schema projectId/idOrName; não comprova prontidão de publicação.
- SMTP não configurado localmente. Removido remetente fictício de fallback e bloqueado adaptador de console na produção hospedada. Ambiente Vercel ainda precisa ser conferido quando houver credencial.
- Revalidação independente de breadcrumbs concluída:3 notícias em4 larguras, zero alvos pequenos. As2 notícias pendentes não estão na home/listagem/mapa/sitemap.
- Commit057cdf5 publicado; CI36600019920 em andamento. Dashboard agora tem h1 e grade de3 etapas. Capturas autenticadas em16 combinações serão revisadas após baixar artefatos.
- Em implementação: cabeçalho X-Release-Commit gerado no build remoto e validação no smoke, para impedir que uma versão antiga no domínio canônico seja aceita como entrega nova.

Próxima ação: revisar o resultado do CI e as capturas CMS; publicação continua condicionada a VERCEL_TOKEN e SMTP real.

## Resultado CI36600019920 e ajustes CMS
- Os94 testes de navegador passaram, incluindo login com cookie no browser, consulta somente da própria conta, criação de administrador bloqueada, logout e reunião reservada isolada.
- A auditoria capturou16 telas, mas classificou4 como falha porque a rota create do Payload salva um rascunho inicial e redireciona ao ID. Isso ocorreu somente no banco efêmero. O script agora verifica que o documento criado continua draft antes de aceitar o redirecionamento.
- Medições CMS encontraram alvos abaixo de44px em login/menu/botões e salto h1→h3 no estado vazio da lista. Correção de dimensões implementada, revisão da extensão para o estado vazio em andamento. Nenhum overflow ou erro de console nas12 capturas com relatório completo.
- Cabeçalho de revisão e validação de ambiente antes da migração preparados. Não executar produção sem credencial e configuração de e-mail real.

Próxima ação: integrar correção de hierarquia, publicar revisão e repetir o CI com16 capturas completas do CMS.

## Retomada em 01/10/2026: CMDCA e Coolify
- Escopo confirmado pelo usuário: CMDCA somente; implantação na VPS do Zé com Coolify. Vercel deixa de ser o destino de entrega.
- Preservadas 11 alterações rastreadas e 3 arquivos novos anteriores. HANDOFF antigo declarava ausência de pendências em conflito com este log, será corrigido.
- Agentes ativos: interface (frontend), codigo (CMS/backend), rapido (baseline), revisor (auditoria independente). Coordenador: entrega, QA, integração e commits.
- SSH para zewithane-vps recusado com as chaves disponíveis; nenhum serviço remoto alterado. URL Coolify, domínio e acesso solicitados sem pedir segredos no chat.
- Banco Neon e armazenamento R2 operacionais preservados. Mutações de QA somente PostgreSQL efêmero no Actions.
- Cache .next movido parcialmente ao C:; diretórios vazios readonly ficaram no Z:. Revisão automática bloqueou remoção residual. Preservados; diagnóstico usa cópia em C:\Users\Ze\.codex\tmp\cmdca-qa\runtime. Nenhum build de produção local.
- Próxima ação: implementar artefato standalone e pipeline Coolify, executar QA remoto, integrar correções, revisar e registrar bloqueios reais.

## Integração Coolify e correções visuais em 02/10/2026
- 4fe3c9f: build standalone, Dockerfile nonroot Node 24, /api/health e Qualidade sobre o container. CI 36947460827 aprovado (94 Playwright, 68 capturas do portal sem falhas, 16 do CMS).
- 8bd808a: privacidade editorial (ata em reunião reservada, consentimento de depoimento, marcador de pendência), CMS em português, situação de resoluções, editais e entidades, auditorias viraram gates. CI 36949074812 falhou só no typecheck de ci-test-cms.ts, corrigido.
- 7993234: workflow manual Producao Coolify (GHCR com tag única e digest, fingerprint de env, smoke canônico), Vercel desativado, nodemailer 10.0.9, fast-uri 3.1.8, brace-expansion 1.1.21 e 5.0.12, GITHUB_ACTIONS repassado ao container de CI (revisor P1), fixtures CMS publicadas e PDF por stub S3 local.
- Achados visuais corrigidos: grade .links estilizava links dentro dos cartões (FMDCA) e deixava colunas vazias com 2 ou 3 itens (Conselho); links dentro de frases quebravam o ritmo por altura mínima de 44 px (exceção inline WCAG 2.5.8, auditoria ajustada); botão flutuante do VLibras cobria conteúdo em 390 px (oculto até 600 px, a barra de acessibilidade abre o mesmo tradutor); travessões visíveis removidos; Participe sem contato mostra aviso em vez de bloco vazio.
- "CI draft question" no FAQ era fixture publicada de propósito no banco efêmero, não vazamento. Renomeada para CI fixture question.
- c521488: corrigido literal de quebra de linha acrescentado por engano ao fim de package.json e de três arquivos, que quebrou o pnpm/action-setup no CI 36950531833.
- HANDOFF.md reescrito com pendências reais.
- Bloqueios: SSH da VPS recusado; URL do Coolify, UUIDs, token e domínio não informados; SMTP real ausente. Nenhum deploy e nenhuma migração em produção.
