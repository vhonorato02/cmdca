# PROMPT MESTRE — Site institucional do CMDCA de Pindamonhangaba
> Cole este arquivo inteiro como a primeira mensagem no Claude Code. Deixe `previa-cmdca-pinda.html` na raiz do projeto. Tudo aqui está decidido; onde houver dúvida, pergunte antes de inventar.

---

## 0. TL;DR operacional
Construa o site oficial do **Conselho Municipal dos Direitos da Criança e do Adolescente de Pindamonhangaba (CMDCA Pinda)** em **Next.js (App Router) + TypeScript + Payload CMS 3**, banco **PostgreSQL no Neon**, mídia no **Cloudflare R2**, hospedagem no **Render (plano free, Web Service)** — provisório em **https://cmdca.onrender.com**, com domínio próprio depois via DNS no **Wix**. **A infraestrutura já está provisionada e as credenciais já estão preenchidas no `.env.local` que acompanha este prompt** (ver §4.1). O **painel administrativo é o coração do projeto**. A **prévia HTML aprovada é a fonte canônica de estilo** — não reinterprete o visual, **reaproveite o código dela**. Trabalhe local primeiro, teste a cada etapa, **não faça deploy sem aval**.

---

## 1. Regra de ouro nº 1 — Fidelidade: a prévia é a FONTE CANÔNICA DE ESTILO
`previa-cmdca-pinda.html` (na raiz) é um protótipo **aprovado, testado e definitivo**. Ele **não é uma referência para se inspirar** — é o código de origem do visual. Antes de escrever qualquer linha, abra-o e:

1. **Porte o bloco `<style>` inteiro** como base do CSS global (tokens, variáveis de cor, tipografia, componentes). Não “recrie parecido”: reutilize as mesmas variáveis e classes.
2. **Porte a função `ill(theme)` e o filtro de grão** para um componente React (`<Illustration theme="…"/>`) **sem alterar uma linha do SVG**. As ilustrações são autorais e fazem parte da identidade (motivo da órbita do logo).
3. **Reutilize o markup e as classes** de cada componente: cabeçalho, slider, cards de notícia, blocos da home, rota de Ajuda, Transparência (gráficos + simulador), Reuniões, FAQ, rodapé.
4. **Logo oficial real**: extraia os data-URIs já embutidos na prévia (emblema e lockup) e use-os como assets reais. **Não recrie a marca.**

Qualquer divergência visual em relação à prévia é **bug**, não liberdade criativa. O que muda de verdade é só o miolo: o conteúdo passa a vir do CMS (não fixo no JS) e o admin vira Payload de verdade. **A casca permanece idêntica.**

> Ao final, faça uma **conferência lado a lado** (prévia × site) das telas públicas e corrija o que destoar (espaçamento, peso de fonte, hover, tom do dourado `#C9A227`, grão). Liste no relatório final qualquer diferença remanescente e o porquê.

## 2. Regra de ouro nº 2 — NUNCA invente dado
Use somente os dados do Apêndice A. O que não estiver confirmado entra como **placeholder explícito** `[A CONFIRMAR]`, **editável no CMS**, e é listado num checklist no `README`. Nada de telefone, nome, número, lei, CNPJ ou estatística “preenchido de memória”. Em dúvida, pergunte.

---

## 3. Stack (não negociável)
- **Next.js (App Router) + TypeScript**, **Payload CMS 3** instalado no mesmo `/app` (Next-native).
- **Banco: PostgreSQL no Neon** via `@payloadcms/db-postgres`. App usa string **pooled** (`-pooler`, `sslmode=require`); migrations usam a **direct/unpooled**. `DATABASE_URI` em env.
- **Mídia: Cloudflare R2** via `@payloadcms/storage-s3` (R2 é S3-compatible). **Uploads nunca no filesystem** (o disco do Render é efêmero). Env: `S3_BUCKET`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION=auto`.
- **Front:** porte o CSS da prévia (CSS global/Modules). Tailwind é aceitável **somente** se reproduzir os mesmos tokens; não troque o visual por defaults de Tailwind.
- **Mapa:** Leaflet + OpenStreetMap. **Gráficos:** Chart.js ou Recharts, lendo da coleção `indicadores`. **Imagens:** `next/image`.
- **Proibido:** WordPress, page-builder, tema/template pronto genérico, qualquer dependência que altere o visual aprovado.

## 4. Hospedagem (decidida) e domínio próprio
- **App: Render — Web Service (free).** Build `pnpm install && pnpm build`; start `pnpm start`. Versione um `render.yaml` (blueprint) reproduzível. Env vars no painel.
- **Banco:** Neon (free). **Mídia:** Cloudflare R2 (free).
- **Domínio próprio (já existe):** adicionar como *custom domain* no Render, apontar DNS no registrador (CNAME para o host do Render; apex via ALIAS/ANAME conforme instrução), deixar o **SSL automático** emitir o certificado. Forçar HTTPS e padronizar `www`↔apex (301).
- **Trade-off ciente:** o free do Render hiberna após inatividade → 1ª requisição com cold start de alguns segundos. Mitigue com **ISR/`revalidate` e cache** agressivos no Next (o site é majoritariamente leitura). **Não** introduza serviço pago sem aval.

## 4.1 Infraestrutura JÁ PROVISIONADA (pronta — não recriar contas)
Tudo abaixo já existe. As credenciais reais estão no **`.env.local`** entregue junto (coloque-o na raiz; ele já está no `.gitignore`; **NUNCA commitar**). Use exatamente esses valores.

- **Repositório:** `github.com/vhonorato02/cmdca` (pode estar vazio — inicialize e dê push). Branch principal: `main`.
- **App — Render (Web Service, free):** Language **Node**; Build `pnpm install && pnpm build`; Start `pnpm start`; URL pública provisória **https://cmdca.onrender.com** (já é o `NEXT_PUBLIC_SERVER_URL`). Hiberna no free (cold start aceitável). Crie/versione `render.yaml`. As env vars do `.env.local` devem ser replicadas no painel do Render no deploy.
- **Banco — Neon (região sa-east-1):** strings já no `.env.local` (`DATABASE_URI` pooled p/ app; `DATABASE_URI_UNPOOLED` direct p/ migrations).
- **Mídia — Cloudflare R2:** bucket **`cmdca-media`**, S3-compatible, `S3_REGION=auto`, endpoint e chaves no `.env.local`. URL pública das imagens já ativa: **https://pub-11b5ed14186d414aa34b58a035bb6504.r2.dev** (`NEXT_PUBLIC_R2_PUBLIC_URL`). Configure o storage adapter para servir a partir dessa URL pública.
- **Segredos:** `PAYLOAD_SECRET` e `PREVIEW_SECRET` já gerados e no `.env.local`.
- **Domínio próprio (depois):** registrado/gerenciado no **Wix**. Quando for a hora, adicionar Custom Domain no Render e apontar o DNS no painel do Wix (Domínios → DNS). **Nada migra de lugar** — Render, Neon e R2 permanecem; só troca o endereço público.

## 5. Repositório e fluxo
Você tem acesso irrestrito ao GitHub. O repo é **`github.com/vhonorato02/cmdca`** (§4.1).
1. Inicialize o projeto nesse repo; commits incrementais e descritivos (`feat:`, `fix:`, `chore:`). Garanta `.gitignore` cobrindo `.env*` (exceto `.env.example`).
2. Coloque o **`.env.local` já preenchido** (entregue junto) na raiz. Gere também um `.env.example` sem segredos.
3. **Local primeiro:** `pnpm dev` conectado ao Neon, migrations aplicadas (use a string `_UNPOOLED`), **seed rodado**, e **validação no browser a cada etapa**.
4. **Deploy só sob aval.** No deploy, replicar as variáveis no painel do Render.

---

## 6. Arquitetura de informação (mapa do site)
`/` Início · `/conselho` O Conselho (o que é, composição, atribuições, base legal, regimento) · `/reunioes` Reuniões (calendário + atas, filtro ano/tipo) · `/resolucoes` Resoluções · `/editais` Editais · `/fmdca` Fundo/FMDCA (+ simulador de IR + como destinar) · `/entidades` Registro de Entidades · `/conferencias` Conferências e Fóruns · `/noticias` + `/noticias/[slug]` Blog · `/transparencia` Transparência · `/ajuda` **Preciso de Ajuda / Rede de Proteção** · `/participe` Participe/Contato · `/acessibilidade` · páginas legais `/privacidade`, `/creditos`. Rodapé e menu conforme a prévia.

## 7. Especificação por página (conteúdo e comportamento — espelhar a prévia)
- **Início:** slider de destaques (CMS), bloco “O Conselho” com a diretoria, acesso rápido (4 atalhos), faixa de indicadores (contadores animados lendo `indicadores`), vozes/depoimentos (carrossel), notícias recentes (1 destaque + 3). Tudo editável.
- **Ajuda (registro emocional calmo, sóbrio, claro):** cartões emergência **190**, denúncia **Disque 100** (anônimo, 24h), “sou criança/adolescente” (a culpa nunca é sua), **Conselho Tutelar** (dados do Apêndice A); aviso de segurança; **mapa da rede** filtrável + **lista acessível** ao lado (mesma fonte de dados); FAQ.
- **Transparência:** indicadores + 2 gráficos (por ano / por área) lidos do CMS; **simulador de destinação de IR** (percentual ilustrativo, rótulo “confirme com seu contador”); blocos para prestação de contas/planos de aplicação (arquivos).
- **Reuniões:** lista filtrável por ano e tipo (ordinária/extraordinária/pública/reservada), com pauta e **ata em PDF**.
- **Editais/Resoluções:** lista com número, data, status e PDF; observar que os atos oficiais também são publicados na **Tribuna do Norte** (link externo configurável).
- **FMDCA:** o que é, como destinar parte do IR, simulador, transparência dos recursos. **Conta bancária/CNPJ ficam `[A CONFIRMAR]`** até a coordenação fornecer.
- **O Conselho:** definição (órgão paritário, deliberativo, consultivo e fiscalizador — art. 88 do ECA), atribuições (gerir FMDCA; registrar/acompanhar entidades — arts. 90/91; fiscalizar a escolha dos conselheiros tutelares), composição (diretoria atual + `[A CONFIRMAR]` para a lista nominal paritária), base legal e regimento, logo oficial completo.

## 8. Modelagem no Payload (coleções, campos e regras)
**Auth/roles:** coleção `users` com campo `role` ∈ {`admin`,`editor`}.
- **admin** (Administrador): acesso total, inclusive `users` e globals de configuração.
- **editor** (Editor): CRUD de conteúdo; **sem** acesso a `users` e `configuracoes` (esconder no admin via `access` e `admin.hidden`).
- Todas as coleções de conteúdo: **`versions: { drafts: true }`** (rascunho/publicado, histórico e rollback). Slugs com hook de geração automática a partir do título.

Coleções:
- `noticias`: `title`, `slug`(auto), `categoria`(select), `resumo`, `corpo`(richText/Lexical), `capa`(→media), `destaque`(bool), `data`(date), `_status`. Admin com **busca** e **filtro por status** (Todas/Publicadas/Rascunhos).
- `reunioes`: `data`, `tipo`(ordinaria|extraordinaria|publica|reservada), `local`, `pauta`(richText), `ata`(→media/upload PDF), `_status`.
- `resolucoes`: `numero`, `titulo`, `data`, `arquivo`(→media PDF), `linkTribuna`(url opcional), `_status`.
- `editais`: `numero`, `titulo`, `tipo`(chamamento|conselho_tutelar|fmdca|outro), `data`, `prazo`, `arquivo`(→media), `linkTribuna`(url), `_status`.
- `entidades`: `nome`, `area`, `registro`, `validade`, `documentos`(→media[]), `_status` (arts. 90/91 ECA).
- `indicadores` (global ou singleton): `alcancados`, `projetos`, `entidades`, `reunioesNoAno`, `serieAnual`(array {ano, valor}), `aplicacaoPorArea`(array {area, percentual}). **Editar aqui atualiza contadores e gráficos no site.**
- `redeProtecao`: `nome`, `tipo`(ct|cras|creas|casa|outro), `endereco`, `telefone`, `lat`, `lng`, `horario`, `obs`.
- `depoimentos`: `frase`, `autor`, `papel`.
- `destaques` (slider): `kicker`, `titulo`, `texto`, `cta`{label,href}, `tema`(familia|maos|cidade|encontro|escudo|doc), `ordem`.
- `faq`: `pergunta`, `resposta`, `ordem`.
- `media`: upload no R2 + **`credito`(text)** + **`consentimentoMenor`(bool)** + `alt`. Regra: por padrão **não** publicar imagem de menor identificável; se `consentimentoMenor` marcado, exigir referência ao termo. Default seguro = ilustração `ill()`.
- Globals: `configuracoes` (nome, contatos, e-mail, Instagram, fundo, links Tribuna do Norte) e `paginaInicial` (ordenação de blocos).

## 9. SEO, performance, acessibilidade, LGPD
- **SEO:** metadata por rota (`generateMetadata`), Open Graph/Twitter, `sitemap.xml`, `robots.txt`, JSON-LD `GovernmentOrganization`. Slugs limpos.
- **Performance:** ISR/`revalidate` nas páginas de leitura; `next/image`; on-demand revalidation quando publicar no CMS; minimizar JS no público.
- **Acessibilidade (eMAG/WCAG 2.1 AA):** teclado em tudo interativo (já há base na prévia), foco visível, `aria` correto, arte com `aria-hidden`, contraste, ajuste de fonte, alto contraste, **VLibras** (script oficial). Skip-link.
- **LGPD/ECA Digital (Lei 15.211/2025):** página de privacidade, banner de cookies só se houver tracking, e a regra de imagem de menor (acima). Tema é criança → cautela máxima.

## 10. Seed inicial (deixar o site “pronto pra ver”)
Popule com os dados do Apêndice A + os **rascunhos de notícia** do Apêndice B (status `draft`, prontos para a coordenação revisar e publicar). Crie 1 usuário admin e 1 editor de exemplo. Semeie `indicadores` com números **ilustrativos claramente marcados** (a coordenação substitui). Semeie `redeProtecao`, `faq`, `depoimentos`, `destaques` conforme a prévia.

## 11. Definition of Done (validar local antes de chamar)
1. `pnpm dev` sobe limpo; admin acessível; Neon conectado; migrations aplicadas; seed rodado; **uploads indo ao R2**.
2. Todas as rotas navegáveis; **visual fiel à prévia** (conferência lado a lado feita); responsivo mobile/desktop; alto contraste e ajuste de fonte funcionando.
3. Admin: login; papéis (Editor não vê Usuários/Configurações); CRUD com **rascunho→publicar refletindo no site**; versões/rollback; busca e filtros; mídia com crédito+consentimento.
4. `indicadores` editável atualizando contadores/gráficos; simulador, mapa+lista, slider, vozes e FAQ funcionando.
5. SEO (sitemap/robots/OG/JSON-LD), ISR e revalidação on-publish ativos.
6. `pnpm build` e `pnpm lint` sem erro; `render.yaml` versionado; **sem segredos no repo**.
7. Entregar `README.md` (setup, env, seed, deploy Render, R2, apontamento de domínio, SSL) **e o checklist de `[A CONFIRMAR]`**.

## 12. Tom de voz
Institucional, sóbrio, humano, claro — **sem cara de IA, sem floreio vazio**. Na Ajuda: acolhedor e direto, pensado para quem está em crise. Bilíngue não é requisito; tudo em PT-BR. Linguagem que conecta escola, família e cidade.

---

# APÊNDICE A — Dados reais coletados (revalidar na fonte oficial antes de publicar)

**Município**
- Pindamonhangaba/SP, “Princesa do Norte”, Vale do Paraíba. População: 165.428 (Censo 2022) / 172.681 (estimativa 2025). Fundada em 10/07/1705. DDD 12. CEP geral 12400-000. Coordenadas −22.92389, −45.46167.
- Instagram do conselho: **@cmdca_pindamonhangaba**. Prefeitura: @prefpinda · pindamonhangaba.sp.gov.br.

**Natureza e funcionamento (ECA, Lei 8.069/1990)**
- Órgão **paritário, deliberativo, consultivo e fiscalizador** (art. 88). Conselheiros voluntários, mandato de 2 anos. Reuniões: ordinárias, extraordinárias, públicas, reservadas.
- Atribuições: gerir o orçamento do **FMDCA**; registrar/acompanhar organizações (arts. 90 e 91); regulamentar e fiscalizar o processo de escolha dos conselheiros tutelares.

**Gestão 2025–2027**
- Presidente: **Dr. Rodolfo Brockhof** (advogado). Vice: **Andrea Campos Sales Martins**. Posse em junho/2025.
- **Adriano Augusto Zanotti** — representante da **OAB** / ex-presidente do conselho.

**Contatos oficiais**
- **CMDCA (oficial):** Tel/Fax **(12) 3642-1249** · **cmdca@pindamonhangaba.sp.gov.br** · CEP 12420-070.
- **Casa dos Conselhos** (Secretaria de Assistência Social): **(12) 3643-1607 / 3643-1609**. Assessora: **Simone Braça**.
- Atos oficiais do conselho publicados na **Tribuna do Norte** (jornaltribunadonorte.com.br) — ex.: convocação de conselheiro tutelar suplente.

**Rede de proteção**
- **1º Conselho Tutelar:** R. Aníbal de Jesus Pinto Monteiro, 237, Alto do Cardoso, CEP 12420-210 — **(12) 3550-0513 / 3550-0514**, seg–sex 7h30–17h30, `conselhotutelar1@pindamonhangaba.sp.gov.br`.
- **2º Conselho Tutelar (Moreira César):** **(12) 3641-1688**, `conselhotutelar2@pindamonhangaba.sp.gov.br`. Plantão fora do horário pela escala da Prefeitura.
- **Disque 100** (denúncia anônima, 24h). **190** (emergência).
- CRAS/CREAS: endereços/coords **[A CONFIRMAR]**.

**Eventos reais (para blog e calendário)**
- **Conferência Municipal dos Direitos da Criança e do Adolescente** agendada para **2026**.
- **Semana Municipal dos Direitos da Criança e do Adolescente** (22–26/09/2025), no **Centro Social Salesiano** (R. São João Bôsco, 727), com a **Camerata Jovem do Projeto Jataí**; marcou os **35 anos do ECA**.
- **Posse da gestão 2025–2027** (junho/2025). **Maio Laranja** (enfrentamento ao abuso/exploração). **FMDCA / destinação de IR**.

**[A CONFIRMAR] (não inventar):**
- Lei municipal que institui o CMDCA Pinda e o FMDCA (número/ano) e regimento interno.
- **CNPJ e conta bancária do FMDCA de Pinda** (vi um CNPJ em busca, mas era de OUTRA cidade — não usar).
- Composição nominal completa e paritária (titulares/suplentes por segmento, governamental e sociedade civil).
- Números reais dos indicadores; percentual exato dedutível do IR; calendário oficial de reuniões 2026; endereço/horário exatos da Casa dos Conselhos; coordenadas precisas da rede.

# APÊNDICE B — Rascunhos de notícia (status: draft, revisar antes de publicar)
Escrever no tom institucional do conselho, ~3–5 parágrafos cada, sem inventar números ou falas que não constem aqui. Sugeridos:
1. **“Conferência Municipal dos Direitos da Criança e do Adolescente é agendada para 2026”** — continuidade do processo de mobilização; espaço de escuta e construção coletiva da política da infância. Citação atribuível ao conselho: a defesa desses direitos não pode ter intervalo.
2. **“Semana Municipal reúne entidades, estudantes e a Camerata Jovem do Projeto Jataí”** — programação gratuita no Centro Social Salesiano; marco dos 35 anos do ECA; apoio da Secretaria de Assistência Social/Casa dos Conselhos.
3. **“Nova gestão do CMDCA toma posse para o biênio 2025–2027”** — Dr. Rodolfo Brockhof (presidente) e Andrea Campos Sales Martins (vice); composição paritária; compromisso com as políticas da infância.
4. **“FMDCA: como destinar parte do seu Imposto de Renda à infância de Pinda”** — explicativo; recursos ficam na cidade; dados bancários `[A CONFIRMAR]`; “confirme limites com seu contador”.
5. **“Conselho Tutelar: como e quando acionar em Pindamonhangaba”** — duas unidades, contatos, Disque 100, 190; tom de orientação.
6. **(draft jurídico)** **“Nota técnica sobre uso de imagem de crianças (LGPD e ECA Digital)”** — orientação para publicação responsável.

---

**Primeiro passo seu:** confirme o plano em 6–10 linhas (stack, hospedagem, como vai portar o CSS/ill() da prévia, ordem de construção, o que vai semear vs. `[A CONFIRMAR]`). Depois construa testando local a cada etapa. **Sem deploy sem aval.**
