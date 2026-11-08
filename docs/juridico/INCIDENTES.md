# Plano de resposta a incidente de segurança com dados pessoais

Base: LGPD, arts. 46 a 49; **Resolução CD/ANPD nº 15/2024** (Regulamento de Comunicação de Incidente de Segurança).
Procedimentos técnicos do servidor: `docs/OPERACOES.md` e o runbook do `vps-platform`.

## Prazos que não podem ser perdidos

| O quê | Prazo | Quem |
| --- | --- | --- |
| Comunicar a ANPD, quando o incidente puder causar risco ou dano relevante aos titulares | **3 dias úteis** a partir do conhecimento de que o incidente envolveu dados pessoais | Controlador (Município), pelo encarregado |
| Comunicar os titulares afetados | No mesmo prazo, em linguagem simples | Controlador |
| Complementar as informações à ANPD | 20 dias úteis, quando a comunicação inicial for incompleta | Controlador |
| Registrar o incidente, mesmo quando não comunicado | Guarda por pelo menos **5 anos** | Controlador |

Dados de crianças e adolescentes, dados sensíveis e dados que permitam localizar alguém pesam para "risco relevante".

## O que é incidente aqui

- Conteúdo publicado que identifica criança ou adolescente em situação protegida.
- Arquivo com dados pessoais publicado por engano (termo de autorização, lista com CPF, ata reservada).
- Acesso indevido ao painel ou ao servidor; senha vazada; conta usada por outra pessoa.
- Rascunho, campo interno ou reunião reservada visível para o público.
- Perda ou corrupção de dados, ou cópia de segurança exposta.

## Passo a passo

1. **Conter (minutos).** Despublicar o conteúdo no painel (ou mandar para a lixeira). Se for o servidor ou uma conta,
   trocar senhas e encerrar sessões; em último caso, `site manutencao cmdca liga` (na VPS). Mídia despublicada para de ser
   servida na hora: o download exige publicação e sai com `Cache-Control: private, no-store`.
2. **Avisar (até 24 h).** Responsável técnico → presidência do CMDCA → encarregado do Município. Registrar a hora em
   que soube.
3. **Apurar (até 2 dias úteis).** O quê, quando, quantos titulares, quais dados, se houve acesso por terceiros. Fontes:
   histórico de versões do item, logs do proxy (lembrar que rotacionam rápido: copiar logo), `journalctl`.
4. **Decidir e comunicar (até o 3º dia útil).** O encarregado avalia o risco e comunica a ANPD pelo formulário oficial
   e os titulares, quando cabível.
5. **Remover cópias.** Pedir remoção em buscadores (Google: ferramenta de remoção de conteúdo desatualizado) e, se
   houver, em redes sociais. Conteúdo que exponha criança: denunciar também à SaferNet.
6. **Corrigir a causa** e registrar a lição aprendida neste repositório (CHANGELOG e, se for regra, nova trava ou
   teste).

## Modelo de comunicação ao titular

> Assunto: Comunicado sobre seus dados pessoais no portal do CMDCA de Pindamonhangaba
>
> Em [data], identificamos que [o que aconteceu, em uma frase]. Os dados envolvidos foram [quais]. Assim que soubemos,
> [o que foi feito: retiramos o conteúdo do ar, trocamos as senhas…]. O risco para você é [avaliação simples] e
> recomendamos [o que a pessoa pode fazer]. Para dúvidas, fale com o encarregado de dados do Município: [contato].
> Você também pode procurar a Autoridade Nacional de Proteção de Dados (ANPD).

## Registro

| Data e hora do conhecimento | Descrição | Dados e titulares | Medidas | Comunicado à ANPD? | Comunicado aos titulares? | Responsável |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |
