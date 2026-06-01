# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/).

## [0.2.1] — 2026-06-01

Auditoria profunda página por página (site público + painel) e correções.

### Corrigido

- **🔴 Crítico: contatos de emergência invisíveis na página Ajuda.** O bloco de
  emergência (190, Disque 100, card da criança, Conselho Tutelar) usava `.reveal`
  sem o componente `<Reveal>` — ficava `opacity:0` para 100% dos visitantes com
  JavaScript. Corrigido (verificado: visível).
- **`<h1>` único por página:** home com um `<h1>` (nome do conselho); títulos do
  slider viram `<h2>` (antes 1 `<h1>` por slide); páginas de listagem (Notícias,
  Reuniões, Resoluções, Editais, Entidades, Transparência) ganham `<h1>` real.
- **Barra de acessibilidade:** `aria-pressed` do alto contraste reflete o estado
  real (antes fixo em `false`).
- **`prefers-reduced-motion`:** desativa animações/transições e não autoavança o
  slider para quem pede menos movimento (WCAG 2.2.2 / 2.3.3).
- **Slider:** slides inativos com `inert` (fora do tab order e de leitores de tela).
- **Manchete da home:** mostra o rótulo amigável da categoria (não o código cru).

### Adicionado

- **Páginas 404 e de erro com identidade do CMDCA** (em PT-BR, com caminhos úteis),
  no lugar do 404 padrão do Next.

### Dados (produção)

- Endereços da **rede de proteção** (2º CT, Casa, 5 CRAS, 2 CREAS) e a **lei do
  CMDCA** (nº 2.626/1991) aplicados na base via `pnpm apply:confirmados`
  (idempotente; FMDCA financeiro permanece pendente).

## [0.2.0] — 2026-06-01

Primeira rodada de auditoria e estabilização após a v1. Build, lint e typecheck
permanecem limpos; nenhuma funcionalidade existente foi removida.

### Adicionado

- **Painel em português por padrão** (`i18n.fallbackLanguage: 'pt'`) — a interface
  do Payload abre em PT-BR mesmo sem preferência salva.
- **Identidade visual do CMDCA no painel**: logo institucional na tela de login,
  ícone próprio na barra lateral e favicon do admin (substituindo a marca genérica
  do Payload).
- **Dashboard de boas-vindas** com atalhos rápidos (criar notícia, cadastrar
  reunião, enviar resolução, publicar edital, rede de proteção, editar indicadores),
  todos acessíveis a Administrador e Editor.
- **Adaptador de e-mail real** (`@payloadcms/email-nodemailer`) para reset de senha,
  ativado por SMTP via variáveis de ambiente. Sem `SMTP_HOST`, mantém o comportamento
  anterior (registro no console).
- **Script `pnpm typecheck`** (`tsc --noEmit`).
- **`CONTEUDO.md`**: dados pesquisados, fontes e pendências reais; **`CHANGELOG.md`**.

### Corrigido

- **Aviso de SSL do driver `pg`** no build/console eliminado de forma correta
  (sem flag de supressão): a string de conexão passa a usar `sslmode=verify-full`
  explicitamente — mesmo comportamento, já que o Neon usa certificado público válido.

### Pesquisado e preenchido (fontes oficiais — detalhes em `CONTEUDO.md`)

- **Casa dos Conselhos** — endereço provisório na Secretaria de Assistência Social:
  Rua Dr. Laerte Machado Guimarães, 590 — Vila Borghese.
- **2º Conselho Tutelar (Moreira César)** — Av. das Hortências, 168 — Vale das Acácias
  (atendimento desde 09/06/2025).
- **5 unidades de CRAS** (Araretama, Castolira, Centro, Cidade Nova, Moreira César) —
  endereços, CEPs e telefones (página oficial de CRAS da Prefeitura).
- **CREAS Centro e CREAS Moreira César** — endereços e telefones (página oficial de CREAS).
- **Lei de criação do CMDCA** — **Lei Municipal nº 2.626, de 19/12/1991** (documento
  oficial da Prefeitura; corroborado pela Câmara de Vereadores).

### Mantido como pendência (exige validação oficial — não publicado como fato)

- CNPJ e conta bancária do FMDCA (apenas fonte secundária encontrada).
- Lei municipal do FMDCA e regimento interno (não localizados em fonte oficial).
- Percentual dedutível do IR (hoje 6% ilustrativo no simulador).
- Coordenadas (lat/lng) dos pontos da rede de proteção (endereços já confirmados).
- Números reais dos indicadores (hoje ilustrativos).

## [0.1.0] — 2026-05-31

- Site institucional do CMDCA Pindamonhangaba (Next.js 16 + Payload CMS 3).
- 15 rotas públicas, 11 coleções e 3 globais, mídia no Cloudflare R2, banco Neon.
- Correção de HTTP 403 (CSRF/serverURL) ao salvar/publicar no painel.
