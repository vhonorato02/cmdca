# Handoff: CMDCA de Pindamonhangaba

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

