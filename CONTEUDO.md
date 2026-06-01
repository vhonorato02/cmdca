# Conteúdo: dados pesquisados, fontes e pendências

Este documento registra, de forma honesta, **o que foi confirmado e preenchido**,
**o que foi encontrado apenas em fonte secundária** e **o que continua pendente** —
incluindo onde se pesquisou. Regra seguida: _dado não confirmado em fonte confiável
não é publicado como fato_ (especialmente dados financeiros e legais).

> Onde "preenchido": valor colocado como **default no seed** (`src/seed/index.ts`),
> que alimenta bases novas. A base de produção (Neon) já tem conteúdo editado e
> **não** foi sobrescrita — os valores abaixo devem ser conferidos e aplicados no
> painel (`/admin`) pela coordenação.

---

## 1. Confirmado em fonte oficial e preenchido

| Dado | Valor | Fonte |
| --- | --- | --- |
| Casa dos Conselhos — endereço (provisório) | Rua Dr. Laerte Machado Guimarães, 590 — Vila Borghese, na Secretaria de Assistência Social | Prefeitura de Pindamonhangaba — notícia "Casa dos Conselhos passa a funcionar provisoriamente na Secretaria de Assistência Social" |
| Casa dos Conselhos — telefones | (12) 3643-1607 (ramal 6037) · (12) 3643-1609 | idem |
| 2º Conselho Tutelar (Moreira César) — endereço | Av. das Hortências, 168 — Vale das Acácias | Prefeitura de Pindamonhangaba — notícia sobre novo endereço do 2º CT (atendimento desde 09/06/2025) |

Fontes (URLs):

- https://pindamonhangaba.sp.gov.br/noticias/assistencia-social/casa-dos-conselhos-passa-a-funcionar-provisoriamente-na-secretaria-de-assistencia-social

> A confirmar ainda nesses itens: **CEP exato** e **horário de atendimento** da Casa
> dos Conselhos (não localizados com segurança).

---

## 2. Encontrado em fonte secundária — PENDENTE de confirmação oficial

Não publicar como fato sem validar em fonte oficial (Prefeitura, Câmara, Diário
Oficial, Receita Federal). Mantidos como `[A CONFIRMAR]` nos campos do CMS.

| Dado | Valor encontrado | Onde apareceu | Falta |
| --- | --- | --- | --- |
| Lei de criação do CMDCA | Lei Municipal nº 2.626/1991 | Edital citado no jornal Tribuna do Norte | Texto da lei na Câmara/Prefeitura ou Diário Oficial |
| FMDCA — CNPJ | 19.140.909/0001-73 | Página do IA3 | Comprovante de inscrição (Receita Federal) / material oficial do município |
| FMDCA — conta bancária | Banco do Brasil, ag. 0574-6, c/c 53.078-6 | Página do IA3 | Publicação oficial da Prefeitura/CMDCA (ex.: campanha de destinação) |

> **Dados financeiros e legais não foram inseridos no site.** Risco institucional,
> contábil e jurídico exige fonte oficial. Quando confirmados, preencher em
> _Configurações › FMDCA_ e _Configurações › Base legal_.

---

## 3. Pendente — não localizado com segurança

Pesquisado em fontes oficiais (Prefeitura de Pindamonhangaba) sem confirmação suficiente:

- **Lei municipal do FMDCA** (nº/ano) e **regimento interno** do CMDCA.
- **Percentual dedutível do IR** — hoje **6% ilustrativo** no simulador. A regra real
  difere entre pessoa física (limite no modelo completo) e pessoa jurídica (lucro real);
  o texto do simulador já orienta a confirmar com contador. Confirmar limite vigente na
  Receita Federal / Instrução Normativa antes de afirmar percentuais.
- **Composição nominal completa e paritária** (titulares/suplentes por segmento).
- **Coordenadas (lat/lng)** de Conselhos Tutelares, CRAS e CREAS para os pinos do mapa
  (não geocodificadas para evitar coordenadas erradas).
- **Endereços/telefones dos CRAS e do CREAS.**
- **Calendário oficial de reuniões 2026**, pautas e atas em PDF.
- **Números reais dos indicadores** (hoje ilustrativos).

---

## 4. Bloqueio de pesquisa nesta rodada

O serviço de busca/extração web atingiu **limite de sessão** durante o trabalho,
impedindo a corroboração adicional de alguns itens da seção 2/3. Os dados da seção 1
foram confirmados antes do limite. Recomenda-se nova rodada de pesquisa para:
Lei do CMDCA (oficial), dados do FMDCA (Receita/Prefeitura) e endereços de CRAS/CREAS.

---

## 5. As 6 notícias (rascunho)

Estão como **rascunho** no CMS (Apêndice B), coerentes com fatos públicos
(posse 2025–2027, Semana Municipal/35 anos do ECA, FMDCA, Conselho Tutelar, nota de
imagem). **Revisar e publicar manualmente** após conferência editorial. A notícia do
FMDCA mantém `[A CONFIRMAR]` no trecho de dados bancários — não publicar esse trecho
sem os dados oficiais.
