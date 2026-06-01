# Conteúdo: dados pesquisados, fontes e pendências

Este documento registra, de forma honesta, **o que foi confirmado e preenchido**,
**o que foi encontrado apenas em fonte secundária** e **o que continua pendente** —
incluindo onde se pesquisou. Regra seguida: _dado não confirmado em fonte confiável
não é publicado como fato_ (especialmente dados financeiros e legais).

> **Aplicado na produção** em 2026-06-01 via `pnpm apply:confirmados` (script
> idempotente e reversível — `configuracoes` tem versionamento): endereços da
> rede de proteção (10 pontos), endereço/telefone da Casa dos Conselhos e a lei
> do CMDCA. Os dados **pendentes** (CNPJ/conta do FMDCA) **não** foram tocados.
> Os mesmos valores também são default no seed (`src/seed/index.ts`) para bases novas.

---

## 1. Confirmado em fonte oficial e preenchido

### Endereços e contatos

| Dado | Valor | Fonte |
| --- | --- | --- |
| Casa dos Conselhos (provisório) | Rua Dr. Laerte Machado Guimarães, 590 — Vila Borghese (na Secretaria de Assistência Social) · (12) 3643-1607 ramal 6037 / (12) 3643-1609 | Prefeitura — notícia "Casa dos Conselhos passa a funcionar provisoriamente…" |
| 2º Conselho Tutelar (Moreira César) | Av. das Hortências, 168 — Vale das Acácias · (12) 3641-1688 | Prefeitura — notícia do novo endereço (atendimento desde 09/06/2025) |
| CRAS Araretama | Rua José Alves Pereira Sobrinho, 36 — Araretama, CEP 12426-320 · (12) 3643-4209 (r. 9026/9027) | Prefeitura — página oficial de CRAS |
| CRAS Castolira | Rua Regina Célia Pestana César, 276 — Castolira, CEP 12405-490 · (12) 3645-3672 (r. 8850) | idem |
| CRAS Centro | Rua Dr. Laerte de Assunção Júnior, 51 — Campo Alegre, CEP 12412-040 · (12) 3642-1302 (r. 8804/8805) | idem |
| CRAS Cidade Nova | Av. Rio de Janeiro, 475 — Cidade Nova, CEP 12414-080 · (12) 3645-6949 (r. 8964/8965) | idem |
| CRAS Moreira César | Rua Carlos Augusto Machado, 63 — Moreira César, CEP 12441-020 · (12) 3637-5386 (r. 9132/9133) | idem |
| CREAS Centro | Av. Fortunato Moreira, 341 — Centro · (12) 3642-6856 / (12) 3642-6403 (r. 7090/7091) · seg–sex 8h–17h | Prefeitura — página oficial de CREAS |
| CREAS Moreira César | Rua Joaquim Santana Salvador, 105 — Moreira César · (12) 3550-3608 / (12) 3550-3609 (r. 9198/9199) | idem |

### Base legal

| Dado | Valor | Fonte |
| --- | --- | --- |
| Lei de criação do CMDCA | **Lei Municipal nº 2.626, de 19/12/1991** | Documento oficial da Prefeitura ("Criado pela Lei Municipal nº 2.626 de 19/12/1991"); corroborado pela Câmara de Vereadores (sp.leg.br) |

Fontes (URLs):

- https://pindamonhangaba.sp.gov.br/noticias/assistencia-social/casa-dos-conselhos-passa-a-funcionar-provisoriamente-na-secretaria-de-assistencia-social
- https://pindamonhangaba.sp.gov.br/cras-centro-de-referencia-da-assistencia-social
- https://pindamonhangaba.sp.gov.br/creas-enderecos-e-telefones
- https://www.pindamonhangaba.sp.gov.br/site/wp-content/uploads/2019/10/Publica%C3%A7%C3%A3o-Local-e-Hor%C3%A1rio-de-Prova_01Ago19-FINAL.pdf (cita a Lei nº 2.626 de 19/12/1991)
- https://www.pindamonhangaba.sp.leg.br/proposicoes/Leis-Ordinarias (Câmara — texto oficial das leis)

> A confirmar ainda: **CEP/horário exatos** da Casa dos Conselhos e **coordenadas
> (lat/lng)** dos pontos para fixar os pinos do mapa (ver §3).

---

## 2. Encontrado em fonte secundária — PENDENTE de confirmação oficial

Não publicar como fato sem validar em fonte oficial (Receita Federal, Prefeitura,
Diário Oficial). Mantidos como `[A CONFIRMAR]` nos campos do CMS.

| Dado | Valor encontrado | Onde apareceu | Falta |
| --- | --- | --- | --- |
| FMDCA — CNPJ | 19.140.909/0001-73 | Página do IA3 | Comprovante de inscrição (Receita Federal) / material oficial do município |
| FMDCA — conta bancária | Banco do Brasil, ag. 0574-6, c/c 53.078-6 | Página do IA3 | Publicação oficial da Prefeitura/CMDCA (ex.: campanha de destinação) |

> **Dados financeiros não foram inseridos no site.** Risco institucional, contábil
> e jurídico exige fonte oficial. Quando confirmados, preencher em _Configurações › FMDCA_.

---

## 3. Pendente — não localizado com segurança

Pesquisado em fontes oficiais (Prefeitura) sem confirmação suficiente:

- **Lei municipal do FMDCA** (nº/ano) e **regimento interno** do CMDCA.
- **Percentual dedutível do IR** — hoje **6% ilustrativo** no simulador. A regra real
  difere entre pessoa física (limite no modelo completo) e pessoa jurídica (lucro real);
  o texto do simulador já orienta a confirmar com contador. Confirmar limite vigente na
  Receita Federal antes de afirmar percentuais.
- **Composição nominal completa e paritária** (titulares/suplentes por segmento).
- **Coordenadas (lat/lng)** dos Conselhos Tutelares, CRAS e CREAS para os pinos do mapa
  (endereços já confirmados acima; coordenadas não publicadas para evitar erro — podem
  ser geocodificadas e conferidas uma a uma antes de publicar).
- **Calendário oficial de reuniões 2026**, pautas e atas em PDF.
- **Números reais dos indicadores** (hoje ilustrativos).

---

## 4. As 6 notícias (rascunho)

Estão como **rascunho** no CMS (Apêndice B), coerentes com fatos públicos
(posse 2025–2027, Semana Municipal/35 anos do ECA, FMDCA, Conselho Tutelar, nota de
imagem). **Revisar e publicar manualmente** após conferência editorial. A notícia do
FMDCA mantém `[A CONFIRMAR]` no trecho de dados bancários — não publicar esse trecho
sem os dados oficiais.
