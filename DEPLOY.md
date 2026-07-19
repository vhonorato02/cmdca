# Entrega em produção — Vercel

Este projeto usa a integração GitHub → Vercel. A branch `main` é a produção e cada _push_ nela inicia uma nova entrega. Neon e Cloudflare R2 continuam serviços independentes; a Vercel executa a aplicação.

## Variáveis da Vercel

Cadastre valores separados por ambiente quando aplicável. Segredos nunca entram no Git.

| Variável | Produção | Observação |
| --- | --- | --- |
| `NEXT_PUBLIC_SERVER_URL` | obrigatória | URL HTTPS canônica, sem barra final. Atualize ao ligar o domínio próprio. |
| `PAYLOAD_SECRET` | obrigatória | Valor aleatório com pelo menos 32 caracteres. |
| `DATABASE_URI` | obrigatória | Conexão _pooled_ do Neon. |
| `DATABASE_URI_UNPOOLED` | obrigatória | Conexão _direct_; usada pelo comando de migração do build. |
| `S3_BUCKET` | obrigatória | Bucket de mídia do R2. |
| `S3_ENDPOINT` | obrigatória | Endpoint S3 da conta R2. |
| `S3_ACCESS_KEY_ID` | obrigatória | Chave com o menor escopo possível no bucket. |
| `S3_SECRET_ACCESS_KEY` | obrigatória | Segredo correspondente. |
| `S3_REGION` | recomendada | `auto` para R2. |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | obrigatória | Host público HTTPS das mídias. |
| `SMTP_HOST` | obrigatória | Servidor do provedor de e-mail. |
| `SMTP_PORT` / `SMTP_SECURE` | obrigatórias | Normalmente `587/false` ou `465/true`, conforme o provedor. |
| `SMTP_USER` / `SMTP_PASS` | conforme provedor | Credencial SMTP; não é a senha pessoal de uma caixa postal. |
| `EMAIL_FROM_NAME` | recomendada | Nome exibido do remetente. |
| `EMAIL_FROM_ADDRESS` | obrigatória | Endereço em domínio validado no provedor. |

Não configure `SEED_ALLOW_LOCAL` nem credenciais de seed na Vercel. Variáveis `VERCEL_*` são fornecidas pela própria plataforma.

## Domínio e e-mail

Um endereço `*.vercel.app` permite validar a aplicação, mas a entrega institucional requer o domínio definitivo. Adicione o domínio no projeto Vercel, aplique no DNS exatamente os registros indicados pela plataforma, aguarde o certificado e ajuste `NEXT_PUBLIC_SERVER_URL`; então faça novo deploy.

SMTP não está “pronto” apenas porque as variáveis existem. O domínio remetente precisa estar validado no provedor, com os registros DNS exigidos (normalmente SPF e DKIM, e DMARC recomendado), e um envio real de recuperação de senha precisa chegar à caixa de teste. Sem domínio e SMTP válidos, a recuperação de acesso permanece pendente.

## Checklist antes do push

1. Confirme que nenhum outro deploy ou alteração editorial crítica está em andamento.
2. Se houve mudança de schema, gere e revise uma única migração versionada. Ela será aplicada diretamente no Neon de produção.
3. Confira que `git status` contém apenas arquivos esperados e que nenhum `.env` foi incluído.
4. Execute:

   ```powershell
   pnpm install --frozen-lockfile
   git diff --check
   ```

5. Faça um único commit coerente na `main` e envie:

   ```powershell
   git add --all
   git commit -m "release: descreva a entrega"
   git push origin main
   ```

6. Não faça outro push até o deployment atual chegar a **Ready** ou falhar de modo conclusivo.

## O que acontece no deploy

A Vercel instala as dependências com lockfile, aplica as migrações versionadas usando `DATABASE_URI_UNPOOLED` e gera o build Next.js. Por isso:

- migração deve ser idempotente e revisada antes do push;
- duas entregas simultâneas são proibidas operacionalmente;
- mudanças destrutivas de schema não devem acompanhar código que ainda lê o formato antigo;
- o build não executa seed.

## Verificação obrigatória em produção

Depois de **Ready**, valide a URL canônica, não apenas a URL temporária do deployment:

- home, notícias, conselho, reuniões, transparência, ajuda, privacidade e acessibilidade;
- `/admin` mostra a tela de login e autentica com uma conta válida;
- editor salva rascunho, jurídico publica, visitante anônimo vê só o publicado;
- upload e exibição de uma mídia de teste no R2;
- recuperação de senha recebida por e-mail;
- `sitemap.xml` e `robots.txt` usam o domínio final;
- console do navegador, rede, logs de função e logs do deployment sem erros;
- navegação por teclado e larguras móvel e desktop.

O roteiro detalhado está em [`docs/QA.md`](docs/QA.md).

## Falha e rollback

Se o deploy falhar antes de ficar **Ready**, corrija a causa e envie um novo commit; a produção anterior continua servida. Se o deploy ficou **Ready** mas apresenta regressão, promova novamente o último deployment saudável na Vercel e faça uma correção direta na `main`.

Rollback da Vercel restaura código, não desfaz dados nem schema. Se a migração alterou dados, siga o plano de recuperação do Neon em [`docs/OPERACOES.md`](docs/OPERACOES.md). Nunca restaure a base por tentativa: preserve evidências, confirme o ponto de recuperação e registre a janela de perda de dados antes da ação.
