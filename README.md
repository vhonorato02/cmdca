# CMDCA Pindamonhangaba — site institucional

Site oficial do **Conselho Municipal dos Direitos da Criança e do Adolescente de Pindamonhangaba**, com painel administrativo (CMS) para a coordenação e o jurídico.

- **Stack:** Next.js 16 (App Router) + TypeScript · Payload CMS 3 (mesmo `/app`) · PostgreSQL no **Neon** · mídia no **Cloudflare R2** · hospedagem no **Render**.
- **Fonte canônica de estilo:** `previa-cmdca-pinda.html` (protótipo aprovado). O CSS, as ilustrações `ill()` e os logos foram **portados verbatim** dela.

---

## 1. Pré-requisitos

- **Node.js** `>=20.9` (testado em 26; produção sugerida: 22 LTS).
- **pnpm** `>=9` (`npm install -g pnpm`).
- Acesso ao `.env.local` já preenchido (Neon, R2, segredos). **Nunca commite este arquivo.**

## 2. Configuração local

```bash
# 1. dependências
pnpm install

# 2. variáveis de ambiente: coloque o .env.local (já preenchido) na raiz
#    (use .env.example como referência da estrutura)

# 3. aplica as migrations no Neon (usa a conexão UNPOOLED/direct)
pnpm migrate

# 4. popula dados iniciais (idempotente — pode rodar de novo sem duplicar)
pnpm seed

# 5. sobe o site + painel
pnpm dev
```

- Site: <http://localhost:3000>
- Painel: <http://localhost:3000/admin>

### Credenciais de exemplo (criadas pelo seed — **trocar em produção**)

| Papel  | E-mail                      | Senha            |
| ------ | --------------------------- | ---------------- |
| Admin  | `admin@cmdca-pinda.local`   | `CmdcaAdmin#2026`  |
| Editor | `editor@cmdca-pinda.local`  | `CmdcaEditor#2026` |

## 3. Scripts

| Script                 | O que faz                                                       |
| ---------------------- | -------------------------------------------------------------- |
| `pnpm dev`             | Sobe o servidor de desenvolvimento.                            |
| `pnpm build`           | Build de produção (type-check + páginas estáticas/ISR).        |
| `pnpm start`           | Sobe o build de produção.                                      |
| `pnpm lint`            | ESLint.                                                        |
| `pnpm typecheck`       | Checagem de tipos (`tsc --noEmit`).                            |
| `pnpm test`            | Testes unitários (Vitest) das funções puras (slug, datas).    |
| `pnpm migrate`         | Aplica migrations no Neon (conexão direct/unpooled).           |
| `pnpm migrate:create`  | Gera uma nova migration a partir de mudanças no schema.        |
| `pnpm migrate:status`  | Lista o status das migrations.                                 |
| `pnpm seed`            | Popula globais/coleções (não duplica conteúdo já existente).   |
| `pnpm generate:types`  | Regenera `src/payload-types.ts` a partir das coleções.         |

## 4. Banco de dados (Neon)

- O **app** usa a string **pooled** (`DATABASE_URI`, com `-pooler`).
- **Migrations e seed** usam a string **direct/unpooled** (`DATABASE_URI_UNPOOLED`), acionada automaticamente pela variável `DATABASE_MIGRATION=true` nos scripts.
- O schema é controlado por **migrations** (`push: false`). Após mudar coleções/campos: `pnpm migrate:create <nome>` e depois `pnpm migrate`.

> Aviso benigno no console: `pg` avisa que `sslmode=require` é tratado como `verify-full`. O Neon tem certificado válido — funciona normalmente.

## 5. Mídia (Cloudflare R2)

- Uploads vão para o bucket **`cmdca-media`** via `@payloadcms/storage-s3` (R2 é compatível com S3). **Nada é gravado no disco** (o disco do Render é efêmero).
- As imagens são servidas pela **URL pública** do bucket (`NEXT_PUBLIC_R2_PUBLIC_URL`), já liberada no R2.
- Cada mídia tem **crédito** e a marcação **“menor identificável com consentimento”** — por padrão **não** publique imagem de criança identificável (ver LGPD abaixo).

## 6. Painel / CMS

- **Em português por padrão** (`i18n.fallbackLanguage: 'pt'`), com **identidade do CMDCA**
  (logo na tela de login, ícone na barra lateral, favicon próprio) e um **dashboard de
  boas-vindas** com atalhos para as tarefas mais comuns (criar notícia, cadastrar reunião,
  enviar resolução, publicar edital, rede de proteção, editar indicadores).
- **Papéis:** _Administrador_ (acesso total, inclui Usuários e Configurações) e _Editor_ (CRUD de conteúdo; **não** vê Usuários nem Configurações).
- **Rascunho → publicar:** as coleções de conteúdo têm versões com rascunho. O site público mostra **apenas o que está publicado**; salvar como rascunho não afeta o site. Há **histórico e rollback** por documento.
- **Indicadores e Página inicial** são globais — editar os Indicadores atualiza os contadores e gráficos do site.

## 7. Deploy no Render

1. Faça push para `main` no repositório `github.com/vhonorato02/cmdca`.
2. No Render, crie um **Blueprint** a partir do `render.yaml` versionado (Web Service, Node, free).
3. Em **Environment**, preencha as variáveis marcadas como `sync: false` com os mesmos valores do `.env.local`:
   `PAYLOAD_SECRET`, `PREVIEW_SECRET`, `DATABASE_URI`, `DATABASE_URI_UNPOOLED`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`.
4. Build: `corepack enable && pnpm install --frozen-lockfile && pnpm migrate && pnpm build` · Start: `pnpm start`.
   - O `pnpm migrate` no build aplica migrations pendentes (idempotente).
5. **Cold start:** no plano free o serviço hiberna após inatividade; a 1ª requisição leva alguns segundos. Mitigado com **ISR/`revalidate`** (o site é majoritariamente leitura) e revalidação on-publish.

> Como o Neon e o R2 são os mesmos em dev e produção, o banco já está migrado e a mídia já é pública — o deploy só troca o endereço público.

## 8. Domínio próprio (via Wix)

Quando for a hora de usar o domínio (gerenciado no **Wix**):

1. No Render, em **Settings → Custom Domains**, adicione o domínio (apex e `www`).
2. No painel do **Wix** (Domínios → DNS), aponte:
   - `www` → **CNAME** para o host do Render (ex.: `cmdca.onrender.com`).
   - apex (`@`) → **ALIAS/ANAME** para o host do Render (ou os registros que o Render indicar).
3. Deixe o **SSL automático** do Render emitir o certificado. Force HTTPS e padronize `www` ↔ apex com **301**.
4. Atualize `NEXT_PUBLIC_SERVER_URL` para o domínio final e refaça o deploy (afeta canonical, sitemap e Open Graph).

Nada migra de lugar: Render, Neon e R2 permanecem; só muda o endereço público.

## 9. Acessibilidade, SEO e LGPD

- **Acessibilidade (eMAG / WCAG 2.1 AA):** barra com ajuste de fonte, alto contraste (persistidos no navegador), **VLibras** (script oficial), navegação por teclado, foco visível, _skip-link_ e ilustrações com `aria-hidden`.
- **SEO:** `generateMetadata` por rota, Open Graph/Twitter, `sitemap.xml`, `robots.txt`, JSON-LD `GovernmentOrganization`, ISR e revalidação ao publicar.
- **LGPD / ECA Digital (Lei 15.211/2025):** página de Privacidade; sem cookies de rastreamento; regra de imagem de menor no upload de mídia.
- **E-mail (reset de senha):** adaptador `@payloadcms/email-nodemailer` ativado por SMTP
  (variáveis `SMTP_*` / `EMAIL_FROM_*`). Sem `SMTP_HOST`, o e-mail é registrado no console
  (modo dev). Configure um SMTP real em produção para o "esqueci minha senha" funcionar.

## 10. Decisões e pequenas adaptações em relação à prévia

A casca permanece **idêntica** à prévia. As únicas adaptações (documentadas, sem mudança visual):

- **Fontes** carregadas via `<link>` do Google Fonts (mantém os nomes `Newsreader`/`Public Sans` exatamente como no `:root` portado).
- Removida a barra **“Prévia de design”** (era um aviso da prévia, não conteúdo do site) e o **admin mockado** (o admin real é o Payload em `/admin`).
- **Gráficos** reproduzidos com o **CSS da prévia** (barras + donut `conic-gradient`) lendo do CMS, em vez de Chart.js — para manter o visual aprovado.
- **Mapa** da Ajuda em **Leaflet + OpenStreetMap** (a prévia usava um mapa SVG esquemático). Pontos sem coordenadas aparecem na lista; o mapa centraliza em Pindamonhangaba.
- Animação de entrada `.reveal` com guarda `html.js` (sem JavaScript, o conteúdo continua visível).
- Testes unitários mínimos (Vitest) cobrindo as funções puras de `slug` e formatação de datas (`pnpm test`). O _scaffold_ de e2e (Playwright) do template segue removido — pode ser readicionado se desejado.

---

## 11. Checklist `[A CONFIRMAR]` (antes de publicar oficialmente)

Tudo abaixo está como **placeholder editável no CMS** ou como **valor ilustrativo** — nada foi inventado. Confirme na fonte oficial e atualize no painel. **Detalhes, valores encontrados e fontes em [`CONTEUDO.md`](./CONTEUDO.md).**

- [x] **Endereço da Casa dos Conselhos** → preenchido (Rua Dr. Laerte Machado Guimarães, 590, Vila Borghese — provisório, fonte: Prefeitura). _Falta: CEP e horário._
- [x] **2º Conselho Tutelar (Moreira César): endereço** → preenchido (Av. das Hortências, 168, Vale das Acácias — fonte: Prefeitura).
- [ ] **Lei municipal do CMDCA** (nº/ano) — _fonte secundária encontrada (nº 2.626/1991), pendente de confirmação oficial_ → _Configurações › Base legal_
- [ ] **Lei municipal do FMDCA** (nº/ano) e **Regimento interno** → _Configurações › Base legal_
- [ ] **CNPJ e conta bancária do FMDCA** — _fonte secundária encontrada, **não publicada**; exige validação oficial_ → _Configurações › FMDCA_
- [ ] **Percentual dedutível do IR** (confirmar limite legal com contador; hoje **6% ilustrativo**) → _Configurações › FMDCA_
- [ ] **Composição nominal completa e paritária** (titulares/suplentes por segmento) → texto da página _O Conselho_ (hoje placeholder)
- [ ] **Números reais dos indicadores** (hoje ilustrativos: 2.480 / 34 / 58 / 22 e séries dos gráficos) → _Indicadores_
- [ ] **Calendário oficial de reuniões 2026** (com pautas e atas em PDF) → coleção _Reuniões_ (vazia)
- [ ] **Horário/CEP da Casa dos Conselhos** → _Configurações › Contato_ e coleção _Rede de Proteção_
- [ ] **Coordenadas (lat/lng) e endereços de CRAS, CREAS e dos Conselhos Tutelares** (para fixar os pinos no mapa) → coleção _Rede de Proteção_
- [ ] **Revisar e publicar os 6 rascunhos de notícia** (Apêndice B) → coleção _Notícias_
- [x] **Adaptador de e-mail** para reset de senha → implementado (SMTP via env; ver §9)

---

## 12. Segurança

- `.env.local` e quaisquer `.env*` (exceto `.env.example`) estão no `.gitignore`. **Não** há segredos no repositório.
- Troque `PAYLOAD_SECRET`/`PREVIEW_SECRET` e as **senhas de exemplo** dos usuários antes de ir ao ar.
