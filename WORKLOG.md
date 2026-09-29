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
