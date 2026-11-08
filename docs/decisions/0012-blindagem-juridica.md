# 0012 — Travas jurídicas no CMS e dossiê de conformidade

Data: 08/11/2026 · Situação: aceita

## Contexto
O portal é de um órgão de defesa de direitos de crianças e adolescentes. O maior risco jurídico não é técnico: é uma
publicação que identifique criança vítima, acolhida, em risco ou com ato infracional atribuído (ECA, arts. 143 e 247),
o que a autorização dos pais não legitima. Além disso, a imagem original enviada ao CMS era guardada e servida com
EXIF (inclusive GPS), e o portal não tinha a ferramenta de pesquisa que a LAI exige de sites oficiais (art. 8º, § 3º, I).

## Decisão
- Mídia: campo `situacaoProtegida` que bloqueia a publicação sempre; original reprocessado no envio
  (`resizeOptions`) para descartar metadados.
- Notícias: declaração de proteção obrigatória para publicar, exigida só de pessoa autenticada (scripts de sistema
  não atestam nada em nome de ninguém).
- Páginas públicas `/acesso-a-informacao` e `/uso-de-imagem`; privacidade e termos reescritos com bases legais,
  retenção real (conferida na VPS) e terceiros; encarregado do Município publicado.
- `/pesquisa` com a API local em `overrideAccess: false`, sem usuário: as mesmas regras do visitante anônimo.
- Dossiê em `docs/juridico/` (matriz, inventário, RIPD, incidentes, atendimento, política editorial, termos).

## Consequências
- Editar uma notícia já publicada exige marcar a declaração na próxima publicação.
- PDFs continuam com os metadados do arquivo original (sem limpeza automática segura); a política editorial orienta.
- Textos editados no painel não são sobrescritos: a migration compara o hash do texto original.
- Validação jurídica formal continua com a Procuradoria-Geral do Município.
