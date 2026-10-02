# CMDCA Pindamonhangaba

Portal institucional do Conselho Municipal dos Direitos da Criança e do Adolescente de Pindamonhangaba, com site público e painel de conteúdo no mesmo projeto.

## Plataforma

- Next.js 16, React 19 e TypeScript;
- Payload CMS 3 em `/admin`;
- PostgreSQL no Neon;
- arquivos e imagens no Cloudflare R2;
- entrega pelo GitHub Actions em container na VPS do Zé com Coolify;
- Node.js 24 e pnpm 11 fixados em `package.json`.

O navegador acessa o proxy HTTPS do Coolify e o container Next.js/Payload. A aplicação usa a conexão pooled do Neon durante a navegação, a conexão direct somente para migrações, e grava uploads no R2. O container não guarda conteúdo permanente. A infraestrutura real ainda depende da confirmação de acesso e destino descrita em DEPLOY.md.

## Rodar localmente

Pré-requisitos: Node.js 24, pnpm 11 e variáveis do projeto. Desenvolva em uma cópia no C: para manter caches fora do disco sincronizado Z:. O arquivo local existente aponta para serviços operacionais; use-o somente em diagnóstico de leitura. Testes com escrita usam o banco descartável do GitHub Actions.

```powershell
corepack enable
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
# preencha .env.local somente para desenvolvimento e diagnóstico autorizados
pnpm devsafe
```

- Site: <http://localhost:3000>
- Painel: <http://localhost:3000/admin>

`pnpm devsafe` remove apenas caches gerados (`.next` e `tsconfig.tsbuildinfo`) antes de iniciar o servidor. Este ambiente local aponta para os serviços operacionais por decisão do projeto: não execute `pnpm migrate`, `pnpm seed` nem `pnpm apply:confirmados` como rotina local. Migrações de produção são executadas uma única vez pelo workflow do GitHub Actions. Seeds só podem ser usados em banco isolado e descartável, com autorização explícita.

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

O fluxo de entrega usa exclusivamente GitHub Actions. O workflow de produção instala dependências pelo lockfile, executa verificações, aplica migrações compatíveis e publica a imagem standalone no GHCR para o Coolify. Não execute build, migrate, seed ou deploy local contra produção. O workflow legado da Vercel está desativado. Veja [`DEPLOY.md`](DEPLOY.md).

## Segredos e recuperação de acesso

- `.env.local`, `.env` e `.vercel` não são versionados;
- nunca envie URI do banco, chaves R2, senha ou `PAYLOAD_SECRET` em commit, chat, captura de tela ou log;
- `PAYLOAD_SECRET` deve ter no mínimo 32 caracteres aleatórios e sua rotação encerra sessões existentes;
- o “Esqueci minha senha” exige SMTP funcional e remetente validado. Sem isso, a recuperação retorna indisponibilidade e não registra tokens no console;
- mantenha dois administradores ativos. O CMS impede autoexclusão e remoção do último administrador.

Em suspeita de exposição, siga a ordem em [`docs/OPERACOES.md`](docs/OPERACOES.md): conter o acesso, rotacionar o segredo, rotacionar credenciais Neon/R2/SMTP, revogar sessões e validar logs.

## Documentação

- [`DEPLOY.md`](DEPLOY.md): configuração Coolify e entrega pelo GitHub Actions;
- [`docs/CMS.md`](docs/CMS.md): manual de conteúdo para editor, jurídico e administrador;
- [`docs/OPERACOES.md`](docs/OPERACOES.md): migrações, backup, rollback e incidentes;
- [`docs/QA.md`](docs/QA.md): critérios objetivos para liberar produção;
- [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md): serviços, dados e limites de responsabilidade;
- [`CONTEUDO.md`](CONTEUDO.md): fontes oficiais, fatos confirmados e pendências;
- [`CHANGELOG.md`](CHANGELOG.md): histórico das versões.
