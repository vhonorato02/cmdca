# Entrega em produção, Vercel

Deploys de produção são executados exclusivamente pelo workflow **Qualidade e deploy Vercel** no GitHub Actions. O deploy automático pela integração Git da Vercel está desabilitado em `vercel.json` com `git.deploymentEnabled: false`.

O workflow **Qualidade** é independente da Vercel e não usa segredos. Ele sobe PostgreSQL 16 efêmero no runner, injeta variáveis fictícias somente no job, aplica as migrations, testa autenticação e permissões do CMS, executa `pnpm check` e gera o build. Em seguida inicia o artefato e executa smoke HTTP e Playwright desktop/mobile. Não lê nem cria `.env.local`. R2 e envio SMTP real não são exercitados nesse fluxo.

O workflow só aceita execução manual na branch `main`, usa Node 24, pnpm 11.15.0 e Vercel CLI 60.1.3. Ele executa, nesta ordem:

1. exige sucesso do workflow reutilizável Qualidade e valida versões, destino e segredos obrigatórios;
2. instala dependências pelo lockfile e executa `pnpm check`;
3. busca as variáveis de produção na Vercel;
4. executa as migrações com o ambiente de produção, antes do build;
5. executa `vercel build --prod` e publica o artefato com `vercel deploy --prebuilt --prod`;
6. confirma páginas, formulário de login e APIs públicas na URL canônica `https://cmdca.vercel.app/`.

## Segredos do repositório

Cadastre os três segredos no repositório `vhonorato02/cmdca`. Os valores de organização e projeto devem coincidir com o destino confirmado em `scripts/ci-validate-vercel.mjs`. O runner não depende de `.vercel/project.json` local.

| Segredo | Finalidade |
| --- | --- |
| `VERCEL_TOKEN` | Token da Vercel com acesso ao time e projeto. |
| `VERCEL_ORG_ID` | Identificador da organização Vercel. |
| `VERCEL_PROJECT_ID` | Identificador do projeto Vercel. |

Os segredos nunca devem ser adicionados a arquivos, logs, comandos locais ou commits. Enquanto estiverem ausentes, a execução manual falha antes de qualquer acesso à Vercel, migração ou deploy.

## Executar a entrega

1. Envie para `main` somente uma revisão já aprovada.
2. No GitHub, abra **Actions**, escolha **Qualidade e deploy Vercel** e clique em **Run workflow** na branch `main`.
3. Aguarde o job terminar. A concorrência de produção é serializada e uma execução em andamento nunca é cancelada por outra.

## Migrações e rollback

As migrações usam as variáveis de produção puxadas pela Vercel e ocorrem antes do build e da publicação. Revise cada mudança de schema antes de disparar o workflow. O rollback da Vercel restaura código, mas não reverte dados ou schema. Para recuperação de dados, siga o procedimento do Neon em [`docs/OPERACOES.md`](docs/OPERACOES.md).

## Verificação após Ready

O workflow confirma páginas, formulário de login, leitura de mídia e isolamento público básico. Depois disso, valide os fluxos institucionais e administrativos descritos em [`docs/QA.md`](docs/QA.md), incluindo autenticação real, publicação, upload e recuperação de senha. HTTP 200 sozinho não comprova funcionamento do CMS.
