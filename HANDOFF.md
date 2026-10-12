# HANDOFF
Atualizado: 2026-10-12 15:45

## Estado atual

Retomada em main a partir de c715800. SSH funciona com parametros explicitos;
VPS usa Traefik e ja hospeda quarau/teste, nao Coolify. Dependencias locais
reparadas pelo lockfile. Implementados preview autenticado de noticias, menu
administravel, capa editavel e entrega de arquivos via autorizacao Payload.
Lint/tipos/111 unitarios passaram. Migration nova gerada sem conectar no Neon.
CI 38122123588 passou migration, integracao, build/imagem e 124 E2E, mas falhou
em 4 cenarios novos: origem interna do container no preview e imagem da capa
tratada como URL remota. Correcoes com regressao local: 114 unitarios, lint/tipos
aprovados. Novo CI ainda necessario. Nao houve deploy ou mutacao do banco fonte.
Backup Neon e restore isolado confirmados: 46 tabelas, 6 noticias, 297 KiB.
CI 38291796075 confirmou correcoes de origem e imagem. Seletores novos ajustados
para texto exato de previa e abrir menu antes de consultá-lo. Next 16.3.8 e
patches transitivos reduziram auditoria prod para 1 high (braces, sem release
corrigida no npm consultado). Novo CI necessario.

## Como rodar

`pnpm dev` em http://localhost:3000. Servidor iniciado nesta sessao.
`pnpm check` para lint/tipos/unitarios. Escritas CMS somente no Postgres efemero do Actions.
Nao executar seed/migrate sobre .env.local.

## Feito nesta sessao

Diagnostico real em docs/ESTADO_REAL.md, decisao de CI em docs/CI_CD_DECISOES.md
e plataforma em docs/OPERACAO.md. Novos E2E cobrem preview/revogacao, menu/capa
CMS->publico, PDF publicado e privado com comparacao SHA256.

## Pendencias

CI remoto e capturas, privacidade direta R2, SMTP institucional, backup dos uploads
CMDCA, conteudo atual/fonte publica, DNS Wix exato e implantacao HTTPS.
Pendencias editoriais detalhadas no historico abaixo continuam abertas.

## Proxima acao unica

Executar e corrigir o CI da fatia editorial antes de qualquer promocao.

## Historico anterior, nao usar como inventario atual

Projeto: portal publico e CMS do CMDCA de Pindamonhangaba.
Repositorio: vhonorato02/cmdca, branch main.
Stack: Next.js 16.3.6, Payload 3.90.2, Postgres (Neon), Cloudflare R2, Node 24, pnpm 11.

## Estado atual

- Entrega pela VPS com Coolify. A imagem Docker e montada no GitHub Actions a partir do build
  standalone, publicada no GHCR com tag unica e digest registrado, e o Coolify so troca a tag.
  A VPS nunca compila o projeto.
- Workflow Vercel desativado. Workflow de producao: .github/workflows/coolify-production.yml
  (manual, exige referencia de backup).
- Workflow Qualidade: migrations em Postgres efemero, integracao CMS com permissoes, lint, tipos,
  testes unitarios, build, imagem Docker, smoke, Playwright, auditoria visual do portal em 1440,
  1024, 768 e 390 px e auditoria do CMS. As auditorias sao gates, nao relatorios.
- O banco Neon e o R2 operacionais nunca sao alterados por testes.
- Detalhes do resultado de cada execucao ficam no WORKLOG.md.

## Pendencias para entrar no ar

PENDENCIA (dev): URL do painel Coolify, UUID da aplicacao Docker Image do CMDCA e UUID do servidor.
PENDENCIA (dev): secret COOLIFY_TOKEN no environment production do GitHub; variaveis COOLIFY_URL,
COOLIFY_APP_UUID, COOLIFY_SERVER_UUID e CMDCA_PUBLIC_URL.
PENDENCIA (dev): credencial de pull do GHCR no Coolify (o pacote deve continuar privado).
PENDENCIA (dev): variaveis de runtime no Coolify, conforme .env.example, com ENFORCE_PRODUCTION_ENV=true.
PENDENCIA (dev): dominio canonico em HTTPS e DNS apontando para a VPS.
PENDENCIA (dev): acesso SSH funcional (a chave atual e recusada) ou confirmacao de que tudo sera via Coolify.
PENDENCIA (dev): backup do Neon com teste de restauracao antes da primeira migracao em producao.
PENDENCIA (conselho): remetente oficial e SMTP para recuperacao de senha.
PENDENCIA (conselho): conteudo oficial: composicao e mandato, contatos, endereco da Casa dos
Conselhos, dados bancarios do FMDCA, calendario de reunioes, atas, resolucoes, editais, entidades
registradas, rede de protecao e indicadores com fonte.
PENDENCIA (conselho): confirmar as 2 noticias marcadas [A CONFIRMAR], hoje ocultas com 404.
PENDENCIA (decisao): midia em rascunho fica com URL publica no R2; decidir bucket privado ou URL assinada.

## Comandos

- Qualidade: push na main ou workflow_dispatch de Qualidade.
- Producao: Actions > Producao Coolify > Run workflow, informando a referencia do backup.
- Verificacao do R2: node scripts/verify-storage.mjs (cria, le e apaga uma chave unica de teste).

