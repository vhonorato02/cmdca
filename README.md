# CMDCA Pindamonhangaba

Portal institucional do Conselho Municipal dos Direitos da Criança e do Adolescente de Pindamonhangaba, com site público e painel de conteúdo no mesmo projeto.

## Plataforma

- Next.js 16, React 19 e TypeScript;
- Payload CMS 3 em `/admin`;
- PostgreSQL no Neon;
- arquivos e imagens no Cloudflare R2;
- produção na Vercel, ligada ao repositório GitHub;
- Node.js 24 e pnpm 11 fixados em `package.json`.

O navegador acessa a aplicação na Vercel. A aplicação usa a conexão _pooled_ do Neon durante a navegação, a conexão _direct_ somente para migrações, e grava uploads no R2. O disco da função Vercel não guarda conteúdo permanente.

## Rodar localmente

Pré-requisitos: Node.js 24, Corepack e acesso às variáveis do projeto. Por decisão operacional deste projeto, o ambiente local usa os mesmos serviços de produção; não publique conteúdo de teste.

```powershell
corepack enable
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
# preencha .env.local com as credenciais operacionais fornecidas pela Vercel
pnpm migrate
pnpm devsafe
```

- Site: <http://localhost:3000>
- Painel: <http://localhost:3000/admin>

`pnpm devsafe` remove apenas caches gerados (`.next` e `tsconfig.tsbuildinfo`) antes de iniciar o servidor. Para criar dados locais mínimos, configure `SEED_ALLOW_LOCAL=true`, `SEED_ADMIN_EMAIL` e uma senha aleatória de pelo menos 14 caracteres; depois execute `pnpm seed`. O seed recusa produção e não contém credenciais públicas.

## Comandos

| Comando | Finalidade |
| --- | --- |
| `pnpm dev` | Inicia o servidor de desenvolvimento. |
| `pnpm devsafe` | Limpa caches gerados e inicia o desenvolvimento. |
| `pnpm clean` | Remove `.next` e `tsconfig.tsbuildinfo`. |
| `pnpm check` | Executa lint, verificação de tipos e testes unitários. |
| `pnpm build` | Gera e valida o build de produção. |
| `pnpm migrate:status` | Exibe o estado das migrações. |
| `pnpm migrate:create` | Gera uma migração depois de uma alteração intencional no schema. |
| `pnpm migrate` | Aplica migrações com `DATABASE_URI_UNPOOLED`. |
| `pnpm generate:types` | Atualiza os tipos gerados do Payload. |
| `pnpm generate:importmap` | Atualiza o mapa de componentes do painel. |
| `pnpm seed` | Cria o baseline mínimo somente em ambiente local autorizado. |

Antes de qualquer entrega:

```powershell
pnpm check
pnpm build
```

O checklist completo, inclusive navegador, responsividade, acessibilidade e produção, está em [`docs/QA.md`](docs/QA.md).

## Conteúdo e CMS

O painel foi desenhado para separar preparação, revisão jurídica e administração:

- **Editor:** prepara e salva rascunhos; não publica nem exclui;
- **Jurídico:** revisa fontes e documentos, aprova e publica; não administra usuários nem exclui;
- **Administrador:** possui todas as permissões, gerencia usuários e executa exclusões.

O site público recebe somente documentos publicados e, no caso de reuniões, somente os de acesso público. Campos de fonte, data de verificação e observações internas mantêm a trilha editorial. Consulte o guia sem jargão em [`docs/CMS.md`](docs/CMS.md).

## Entrega

O fluxo deliberadamente adotado é direto na `main`: um `git push origin main` inicia a produção pela integração Git da Vercel. Não abra _branch_, _pull request_ ou ambiente paralelo para o fluxo normal deste projeto. Migrações são aplicadas diretamente pelo deploy, uma entrega por vez. Veja [`DEPLOY.md`](DEPLOY.md).

## Segredos e recuperação de acesso

- `.env.local`, `.env` e `.vercel` não são versionados;
- nunca envie URI do banco, chaves R2, senha ou `PAYLOAD_SECRET` em commit, chat, captura de tela ou log;
- `PAYLOAD_SECRET` deve ter no mínimo 32 caracteres aleatórios e sua rotação encerra sessões existentes;
- o “Esqueci minha senha” exige SMTP funcional e domínio remetente validado. Sem isso, desenvolvimento apenas registra a mensagem no console e a produção é considerada incompleta;
- mantenha dois administradores ativos. O CMS impede autoexclusão e remoção do último administrador.

Em suspeita de exposição, siga a ordem em [`docs/OPERACOES.md`](docs/OPERACOES.md): conter o acesso, rotacionar o segredo, rotacionar credenciais Neon/R2/SMTP, revogar sessões e validar logs.

## Documentação

- [`DEPLOY.md`](DEPLOY.md): configuração Vercel e entrega direta da `main`;
- [`docs/CMS.md`](docs/CMS.md): manual de conteúdo para editor, jurídico e administrador;
- [`docs/OPERACOES.md`](docs/OPERACOES.md): migrações, backup, rollback e incidentes;
- [`docs/QA.md`](docs/QA.md): critérios objetivos para liberar produção;
- [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md): serviços, dados e limites de responsabilidade;
- [`CONTEUDO.md`](CONTEUDO.md): fontes oficiais, fatos confirmados e pendências;
- [`CHANGELOG.md`](CHANGELOG.md): histórico das versões.
