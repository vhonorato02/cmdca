# Guia de deploy no Render — passo a passo

Guia didático para colocar o site no ar. Você só precisa de um navegador e do seu
arquivo `.env.local` (o que já roda o projeto na sua máquina).

## O que JÁ está pronto (não precisa fazer nada)

- ✅ Código no GitHub (`github.com/vhonorato02/cmdca`, branch `main`).
- ✅ Banco **Neon** migrado e com os dados (é o mesmo de dev e produção).
- ✅ Mídia no **Cloudflare R2** (pública).
- ✅ `render.yaml` pronto (define o serviço, build e variáveis).

> Como Neon e R2 são os mesmos em dev e produção, o deploy só **liga o site num
> endereço público**. Nada de dado/imagem “muda de lugar”.

---

## Parte 1 — Conta no Render + GitHub (≈ 5 min)

1. Abra <https://render.com> e clique em **Get Started** / **Sign in**.
2. Escolha **GitHub** e entre com a conta **vhonorato02**.
3. Autorize o Render. Pode restringir o acesso só ao repositório **cmdca**.

## Parte 2 — Criar o serviço pelo `render.yaml` (Blueprint)

1. No painel do Render, clique em **New +** (canto superior direito) → **Blueprint**.
2. Selecione o repositório **vhonorato02/cmdca**.
3. O Render lê o `render.yaml` sozinho e mostra um serviço chamado **cmdca**.
4. Ele vai pedir os valores das **variáveis secretas** (Parte 3). **Preencha antes
   de mandar o deploy.**

## Parte 3 — Preencher os segredos (copie do seu `.env.local`)

Abra o arquivo **`.env.local`** (na raiz do projeto) e copie cada valor para o
campo de mesmo nome no Render:

| Variável (no Render) | De onde copiar | Obrigatória |
| --- | --- | --- |
| `PAYLOAD_SECRET` | `.env.local` | ✅ |
| `PREVIEW_SECRET` | `.env.local` | ✅ |
| `DATABASE_URI` | `.env.local` | ✅ |
| `DATABASE_URI_UNPOOLED` | `.env.local` | ✅ |
| `S3_ENDPOINT` | `.env.local` | ✅ |
| `S3_ACCESS_KEY_ID` | `.env.local` | ✅ |
| `S3_SECRET_ACCESS_KEY` | `.env.local` | ✅ |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM_NAME`, `EMAIL_FROM_ADDRESS` | só se quiser e-mail de “esqueci a senha” | ⬜ opcional |

As variáveis **não secretas** (`NEXT_PUBLIC_SERVER_URL`, `NEXT_PUBLIC_R2_PUBLIC_URL`,
`S3_BUCKET`, `S3_REGION`, `NODE_VERSION`) **já vêm preenchidas** pelo `render.yaml`.

> ⚠️ Nunca cole esses valores em e-mail, chat ou print. Só no painel do Render.

## Parte 4 — Primeiro deploy

1. Com os segredos preenchidos, clique em **Apply** / **Create**.
2. O Render executa automaticamente:
   `corepack enable && pnpm install --frozen-lockfile && pnpm migrate && pnpm build`
   e depois `pnpm start`.
3. Acompanhe em **Logs**. O primeiro build leva ~3–6 minutos.
4. Quando o status ficar **Live** (verde), abra **https://cmdca.onrender.com**.
5. Teste rápido: **home**, **/ajuda** (deve listar os 10 pontos da rede), **/admin** (login).

## Parte 5 — IMPORTANTE depois do 1º deploy

- **Trocar as senhas de exemplo:** entre em `/admin` (admin@cmdca-pinda.local),
  vá em **Usuários** e troque a senha do **admin** e do **editor**.
- **(Opcional) E-mail de reset de senha:** preencha as variáveis `SMTP_*` no Render
  (**Environment → Save**, que dispara um redeploy). Sem SMTP, o reset só aparece no log.

## Parte 6 — Domínio próprio no Wix (quando quiser)

1. No Render: serviço **cmdca → Settings → Custom Domains → Add Custom Domain**.
   Adicione o apex (ex.: `cmdca.org.br`) e o `www` (ex.: `www.cmdca.org.br`).
2. O Render mostra o destino. No **Wix** (Domínios → Gerenciar DNS):
   - `www` → registro **CNAME** → valor: `cmdca.onrender.com`
   - apex `@` → registro **A** ou **ALIAS/ANAME** conforme o Render indicar.
3. Aguarde a propagação (minutos a horas). O **SSL (HTTPS)** é emitido automaticamente
   pelo Render. Force HTTPS e padronize `www` ↔ apex (301) nas opções do domínio.

## Parte 7 — Atualizar o endereço público

Quando o domínio estiver funcionando:

1. Render → serviço **cmdca → Environment** → edite **`NEXT_PUBLIC_SERVER_URL`** para
   `https://seudominio` → **Save** (dispara redeploy).
2. Isso atualiza canonical, `sitemap.xml` e Open Graph (prévia de links compartilhados).

## Parte 8 — Cold start (plano free)

No plano **free**, o serviço hiberna após ~15 min sem acesso; a primeira visita depois
disso leva alguns segundos para “acordar”. Já está mitigado com ISR/cache. Para eliminar,
faça upgrade para um plano pago no Render mais tarde.

---

## ✅ Checklist final

- [ ] Conta Render criada e GitHub conectado
- [ ] Blueprint criado a partir do `render.yaml`
- [ ] 7 segredos preenchidos (do `.env.local`)
- [ ] Deploy com status **Live**
- [ ] `/admin` abre e `/ajuda` lista os pontos
- [ ] Senhas de exemplo trocadas
- [ ] (depois) Domínio + SSL + `NEXT_PUBLIC_SERVER_URL` atualizado
