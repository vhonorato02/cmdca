# Portal CMDCA Pindamonhangaba

Portal institucional do Conselho Municipal dos Direitos da Criança e do Adolescente de Pindamonhangaba, com site público e painel de conteúdo no mesmo projeto.

## Plataforma

- Next.js 16, React 19 e TypeScript;
- Payload CMS 3 em `/admin`;
- PostgreSQL 17 (banco `cmdca` no Postgres compartilhado da VPS);
- arquivos e imagens em disco persistente (`/srv/sites/cmdca/data/media`), servidos por `/api/media/file/`;
- entrega pelo GitHub Actions, em container, na VPS `zewithane` (plataforma `vps-platform`: Caddy + Docker);
- Node.js 24 e pnpm 11 fixados em `package.json`.

O navegador acessa o Caddy (HTTPS automático) e o container Next.js/Payload. As migrations rodam quando o container sobe. Os dados ficam no Postgres da plataforma e a mídia num volume. Os dois entram no backup restic diário, que tem teste semanal de restauração e cópia fora da VPS (ver `docs/OPERACOES.md`). Produção: <https://www.cmdcapinda.org>. Detalhes em [`DEPLOY.md`](DEPLOY.md).


### Fronteira de hospedagem e comportamento

A aplicação **não é PWA**: não publica web manifest de instalação, service worker, modo standalone nem notificações push. O objetivo é uma experiência responsiva e acessível em navegadores móveis e desktop.

O runtime do portal, Payload, PostgreSQL e biblioteca de mídia são locais à VPS. O build é criado no GitHub Actions e a imagem é publicada no GitHub Container Registry para o deploy. Integrações de navegador opcionais (como VLibras e mosaicos do OpenStreetMap) não hospedam banco ou CMS. A única nova dependência externa prevista para dados operacionais é um destino de **backup off-site criptografado**, fora do caminho das requisições.

## Rodar localmente

Pré-requisitos: Node.js 24, pnpm 11 e um PostgreSQL 17 local descartável (no notebook do Zé: binários portáteis em `Z:\Dev\sandbox\offsite-restore-tools`, sem Docker). O `.env.local` deve apontar só para `127.0.0.1`; nunca para o banco de produção.

```powershell
corepack enable
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
# preencha .env.local somente para desenvolvimento e diagnóstico autorizados
pnpm devsafe
```

- Site: <http://localhost:3000>
- Painel: <http://localhost:3000/admin>

`pnpm devsafe` remove apenas caches gerados (`.next` e `tsconfig.tsbuildinfo`) antes de iniciar o servidor. `pnpm migrate` e `pnpm seed` só em banco local descartável. Em produção as migrations rodam quando o container sobe. O teste de integração do CMS (`scripts/ci-test-cms.ts`) também roda localmente contra esse banco, com `GITHUB_ACTIONS=true`, `GITHUB_ENV` apontando para um arquivo temporário e `MEDIA_DIR` numa pasta descartável.

## Comandos

| Comando | Finalidade |
| --- | --- |
| `pnpm dev` | Inicia o servidor de desenvolvimento. |
| `pnpm devsafe` | Limpa caches gerados e inicia o desenvolvimento. |
| `pnpm clean` | Remove `.next` e `tsconfig.tsbuildinfo`. |
| `pnpm check` | Executa lint, verificação de tipos e testes unitários. |
| `pnpm build` | Gera o build de produção, executado exclusivamente pelo GitHub Actions. |
| `pnpm migrate:status` | Exibe o estado das migrações, para diagnóstico autorizado. |
| `pnpm migrate:create` | Gera uma migração depois de uma alteração intencional no schema. |
| `pnpm migrate` | Aplica migrações com `DATABASE_URI_UNPOOLED`, exclusivo do workflow de produção. |
| `pnpm generate:types` | Atualiza os tipos gerados do Payload. |
| `pnpm generate:importmap` | Atualiza o mapa de componentes do painel. |
| `pnpm seed` | Cria dados apenas em banco isolado e descartável, nunca na produção. |

Antes de qualquer entrega, envie o código para o repositório e acompanhe as verificações, a migração e o deploy no GitHub Actions. O build de produção não é executado localmente. O checklist completo, inclusive navegador, responsividade, acessibilidade e produção, está em [`docs/QA.md`](docs/QA.md).

## Conteúdo e CMS

O painel foi desenhado para separar preparação, revisão jurídica e administração:

- **Editor:** prepara, salva rascunhos, publica e despublica conteúdo; não exclui;
- **Jurídico:** revisa fontes e documentos quando aplicável, publica e despublica; não administra usuários nem exclui;
- **Administrador:** possui todas as permissões, gerencia usuários e executa exclusões.

O site público recebe somente documentos publicados e, no caso de reuniões, somente os de acesso público. Campos de fonte, data de verificação e observações internas mantêm a trilha editorial. Consulte o guia sem jargão em [`docs/CMS.md`](docs/CMS.md).

## Entrega

Todo push na `main` passa pela bateria de qualidade (migrations, lint, tipos, unitários e E2E no container de produção). Depois publica a imagem no GHCR e faz o deploy na VPS sem downtime, por uma chave SSH que só executa o comando de deploy. Se a versão nova não ficar saudável, a anterior continua no ar. Rollback: `site rollback cmdca` na VPS. Não execute build, migrate, seed ou deploy local contra produção. Veja [`DEPLOY.md`](DEPLOY.md).

## Segredos e recuperação de acesso

- `.env.local` e `.env` não são versionados;
- nunca envie URI do banco, senha, chave de deploy ou `PAYLOAD_SECRET` em commit, chat, captura de tela ou log;
- `PAYLOAD_SECRET` deve ter no mínimo 32 caracteres aleatórios e sua rotação encerra sessões existentes;
- não há SMTP (ADR 0009): o “Esqueci minha senha” responde indisponível e não registra tokens; um administrador redefine a senha e a pessoa troca no primeiro acesso;
- mantenha dois administradores ativos. O CMS impede autoexclusão e remoção do último administrador.

Em suspeita de exposição, siga a ordem em [`docs/OPERACOES.md`](docs/OPERACOES.md): conter o acesso, rotacionar o segredo, rotacionar a credencial do banco, revogar sessões e validar logs.

## Documentação

- [`HANDOFF.md`](HANDOFF.md): estado atual verificado e pendências;
- [`DEPLOY.md`](DEPLOY.md): deploy na VPS, variáveis e domínios;
- [`docs/decisions/`](docs/decisions/): decisões de arquitetura (ADRs);
- [`docs/CMS.md`](docs/CMS.md): manual de conteúdo para editor, jurídico e administrador;
- [`docs/OPERACOES.md`](docs/OPERACOES.md): migrações, backup, rollback e incidentes;
- [`docs/QA.md`](docs/QA.md): critérios objetivos para liberar produção;
- [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md): serviços, dados e limites de responsabilidade;
- [`CONTEUDO.md`](CONTEUDO.md): fontes oficiais, fatos confirmados e pendências;
- [`docs/audit/RELATORIO-FINAL.md`](docs/audit/RELATORIO-FINAL.md): auditorias de 04 e 06/11/2026;
- [`CHANGELOG.md`](CHANGELOG.md): histórico das versões;
- [`docs/historico/`](docs/historico/): documentos antigos (Vercel/Neon/R2/Coolify, PWA), só como registro.
