# 0001 — Manter Next.js 16 + Payload CMS 3 (refatorar, não reescrever)

**Status:** aceita · 2026-10-26

**Contexto.** O projeto não era um mockup. Já tinha:
- Payload 3 com papéis (editor, jurídico, admin);
- rascunho e publicação, com prévia autenticada;
- upload de mídia com variantes;
- testes unitários e E2E no CI;
- regras editoriais (fonte, revisão jurídica).

Faltavam hospedagem própria, design, conteúdo completo e eliminação de texto fixo.

**Decisão.** Manter a stack e refatorar por partes:
- infraestrutura (VPS, banco, mídia);
- design system e páginas;
- textos institucionais migrados para o CMS.

**Alternativas.**
- Reescrever em outro CMS (Strapi, Directus, WordPress): jogaria fora o fluxo editorial testado.
- Site estático com CMS headless externo: custo mensal e dependência de terceiros.

**Consequências.** O painel continua familiar para quem já usa. O esforço vai para o que o visitante vê e para a operação.
