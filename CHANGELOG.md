# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/).

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

### Pesquisado e preenchido (fontes em `CONTEUDO.md`)

- **Casa dos Conselhos** — endereço provisório na Secretaria de Assistência Social:
  Rua Dr. Laerte Machado Guimarães, 590 — Vila Borghese (fonte oficial: Prefeitura).
- **2º Conselho Tutelar (Moreira César)** — Av. das Hortências, 168 — Vale das Acácias
  (fonte oficial: Prefeitura; atendimento desde 09/06/2025).

### Mantido como pendência (exige validação oficial — não publicado como fato)

- CNPJ e conta bancária do FMDCA (apenas fonte secundária encontrada).
- Lei municipal de criação do CMDCA/FMDCA (apenas fonte secundária encontrada).
- Percentual dedutível do IR (hoje 6% ilustrativo no simulador).
- Coordenadas (lat/lng) dos pontos da rede de proteção.
- Números reais dos indicadores (hoje ilustrativos).

## [0.1.0] — 2026-05-31

- Site institucional do CMDCA Pindamonhangaba (Next.js 16 + Payload CMS 3).
- 15 rotas públicas, 11 coleções e 3 globais, mídia no Cloudflare R2, banco Neon.
- Correção de HTTP 403 (CSRF/serverURL) ao salvar/publicar no painel.
