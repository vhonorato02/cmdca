# 0009 — Sem envio de e-mail pelo site

Data: 26/10/2026 · Situação: aceita

## Contexto
O domínio `cmdcapinda.org` não terá caixas de e-mail: o conselho usa os endereços
da prefeitura. Um SMTP gratuito (Brevo) exigiria um remetente verificado e
registros SPF/DKIM num domínio sem e-mail, e a mensagem sairia com cara de spam.

## Decisão
- O site não envia e-mail. `SMTP_HOST` fica vazio em produção.
- "Esqueci minha senha" responde que a recuperação está indisponível e orienta a
  pedir ajuda à administração (hook em `Users`). O administrador define a nova
  senha pelo painel (`docs/CMS.md`).
- O suporte a SMTP continua no código: basta preencher `SMTP_*` e
  `EMAIL_FROM_ADDRESS` com `site config cmdca` se um dia houver remetente.

## Consequências
Nenhum serviço externo nem registro DNS extra. Toda troca de senha depende de um
administrador, por isso há sempre dois administradores ativos.
