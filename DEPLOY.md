# Entrega do CMDCA na VPS do Zé com Coolify

Destino definido pelo responsável: aplicação exclusiva do CMDCA no Coolify da VPS do Zé. O workflow legado Vercel está desativado. Neon e R2 permanecem como armazenamento existente; esta mudança não autoriza mover ou apagar dados nem alterar outras aplicações da VPS.

## Fluxo implementado

1. `Qualidade` cria PostgreSQL descartável, aplica migrações, verifica permissões, tipos e testes, gera o build e monta o container standalone. O navegador testa esse container, inclusive CMS autenticado e telas em 1440, 1024, 768 e 390 px.
2. `Producao CMDCA Coolify`, manual na `main`, exige sucesso de Qualidade e referência de backup recuperável. O operador informa identificador e horário após verificar o backup. O campo preenchido não comprova restauração.
3. O pipeline confirma UUID da aplicação, vínculo ao servidor autorizado, nome CMDCA, domínio e imagem. Lê apenas as variáveis necessárias dessa aplicação no Coolify e mascara seus valores no runner.
4. Aplica migrações compatíveis pelo Actions, gera o artefato com a origem e conteúdo reais, procura segredos incorporados, monta a imagem e executa smoke de leitura no container final.
5. Publica `ghcr.io/vhonorato02/cmdca:<commit>-<run>-<attempt>` e altera somente a tag da aplicação CMDCA. Aguarda conclusão no Coolify e valida saúde, APIs, login e `X-Release-Commit` no domínio canônico.

O Dockerfile apenas empacota o build pronto. Não compila nem migra na VPS. Node 24 roda como usuário `node`, porta interna 3000, atrás do proxy HTTPS do Coolify. Conteúdo e uploads não dependem do filesystem do container.

## Cadastro no Coolify

- Identificar ou criar uma aplicação **Docker Image**, exclusiva do CMDCA, no servidor do Zé.
- Configurar imagem `ghcr.io/vhonorato02/cmdca`, porta 3000, domínio HTTPS canônico e healthcheck `GET /api/health`.
- Configurar acesso de leitura ao GHCR se o pacote for privado. Não tornar o pacote público automaticamente: ele pode conter páginas públicas pré-renderizadas e configuração pública de implantação.
- Desativar deploy automático por push e tarefas de build/migração no Coolify. GitHub Actions é o responsável pela entrega.
- Configurar as variáveis da `.env.example` como variáveis literais de runtime, incluindo `ENFORCE_PRODUCTION_ENV=true`. `NEXT_PUBLIC_SERVER_URL` é a origem HTTPS final, sem caminho. Não configurar variáveis de seed.
- Configurar banco, R2 e SMTP reais. O remetente deve ser institucional e validado. Não copiar variáveis de outras aplicações.
- Conferir DNS, certificado, firewall, limites de upload, recursos, logs e backups na VPS. Esses itens exigem inspeção real; o repositório não comprova sua configuração.

## GitHub, environment production

| Tipo | Nome | Conteúdo |
| --- | --- | --- |
| Variable | `COOLIFY_URL` | Origem HTTPS do painel, sem `/api/v1` |
| Variable | `COOLIFY_APP_UUID` | UUID exclusivo da aplicação CMDCA |
| Variable | `COOLIFY_SERVER_UUID` | UUID do servidor do Zé no Coolify |
| Variable | `CMDCA_PUBLIC_URL` | Origem HTTPS canônica do portal |
| Secret | `COOLIFY_TOKEN` | Token da equipe do CMDCA com leitura do ambiente e implantação |

Cadastrar o token diretamente em GitHub Secrets, nunca no chat, repositório ou captura. O GITHUB_TOKEN temporário publica no GHCR com packages: write. As credenciais Neon/R2/SMTP ficam no Coolify. O pipeline lê a configuração validada, sem uma segunda cópia permanente no GitHub. Alteração de ambiente entre build e deploy interrompe a entrega.

## Backup e recuperação

Antes da implantação, registrar backup do banco e política/cópia dos objetos R2. Testar restauração isolada e registrar responsável, horário e resultado. As migrações devem manter a versão anterior funcionando caso uma etapa posterior falhe. Nunca executar rollback down automaticamente.

O artefato `cmdca-release` registra commit, servidor, aplicação, domínio, tag anterior, referência de backup e identificador do deploy, sem credenciais. Em regressão apenas de código, conferir compatibilidade do schema e restaurar a tag anterior pelo Coolify, registrando a operação. Não apagar banco, bucket, volumes ou outras aplicações.

## Estado da retomada

<!-- PENDENCIA: informar URL Coolify, UUID da aplicacao e servidor e dominio CMDCA; liberar acesso de implantacao. -->
<!-- PENDENCIA: configurar SMTP/remetente, confirmar backup recuperavel e executar QA no destino real. -->

SSH para `zewithane-vps` recusou autenticação em 01/10/2026. Nenhuma alteração na VPS ou implantação de produção foi confirmada nesta etapa. Consulte WORKLOG.md para resultados executados e HANDOFF.md para pendências do responsável.\n\n\n