# Dossiê jurídico do portal do CMDCA

Atualizado em **08/11/2026**. Reúne, num lugar só, o que o portal faz para cumprir a lei, onde isso está no código e
no conteúdo, como provar e o que ainda depende do conselho ou da Prefeitura.

> **Aviso.** Este dossiê é documentação técnica de conformidade, preparada a partir da legislação e das fontes
> oficiais citadas. Ele **não substitui parecer da Procuradoria-Geral do Município** nem a decisão do conselho. Leve
> as pendências marcadas como "Conselho" ou "Prefeitura" a quem tem competência para decidir.

## Papéis

| Papel | Quem | Base |
| --- | --- | --- |
| Controlador dos dados | Município de Pindamonhangaba (CNPJ 45.226.214/0001-19), por meio do CMDCA | LGPD, art. 5º, VI; Lei Municipal nº 2.626/1991 |
| Encarregado (DPO) | Encarregado de dados do Município, publicado pela Prefeitura ([página oficial](https://pindamonhangaba.sp.gov.br/lei-geral-de-protecao-de-dados-lei-federal-n-137092018), conferida em 08/11/2026) | LGPD, art. 41; Resolução CD/ANPD nº 18/2024 |
| Operador da infraestrutura | Responsável técnico do portal (VPS `zewithane`, no Brasil) | LGPD, art. 5º, VII, e art. 39 |
| Quem publica | Contas do painel (administrador, editor, jurídico), cada ação registrada | LGPD, art. 37; ECA |
| Serviço de Informação ao Cidadão | SIC da Prefeitura (Decreto Municipal nº 5.099/2014) | LAI, art. 9º |

## Documentos

| Arquivo | Para quem | O que tem |
| --- | --- | --- |
| [MATRIZ-CONFORMIDADE.md](MATRIZ-CONFORMIDADE.md) | Técnico e jurídico | Cada obrigação legal, onde está atendida, evidência e situação |
| [LGPD-INVENTARIO.md](LGPD-INVENTARIO.md) | Encarregado, Procuradoria | Registro das operações de tratamento (art. 37) e tabela de retenção |
| [LGPD-RIPD.md](LGPD-RIPD.md) | Encarregado, Procuradoria | Relatório de impacto à proteção de dados (art. 38), riscos e medidas |
| [INCIDENTES.md](INCIDENTES.md) | Técnico e conselho | Plano de resposta a incidente, prazos da ANPD, modelos de comunicação |
| [ATENDIMENTO-TITULAR-E-LAI.md](ATENDIMENTO-TITULAR-E-LAI.md) | Secretaria do conselho | Como responder a pedido de titular (LGPD) e de acesso à informação (LAI), com prazos |
| [POLITICA-EDITORIAL.md](POLITICA-EDITORIAL.md) | Quem publica no painel | Checklist antes de publicar: ECA, LGPD, período eleitoral, direitos autorais, atos oficiais |
| [MODELO-AUTORIZACAO-IMAGEM.md](MODELO-AUTORIZACAO-IMAGEM.md) | Secretaria do conselho | Termo de autorização de uso de imagem de criança ou adolescente, e de adulto |

## Páginas públicas (o que o cidadão vê)

| Endereço | Conteúdo | Base |
| --- | --- | --- |
| `/privacidade` | Aviso de privacidade completo: controlador, encarregado, dados, finalidades, bases legais, retenção, terceiros, direitos, ANPD | LGPD, arts. 6º, 9º, 14, 18, 23 e 41 |
| `/termos` | Termos de uso: valor das informações, reprodução, uso proibido, período eleitoral | ECA, Lei 9.504/1997, CP art. 154-A |
| `/acesso-a-informacao` | Transparência ativa, como pedir informação, prazos e recursos, restrições | LAI e Decreto Municipal nº 5.099/2014 |
| `/uso-de-imagem` | O que nunca é publicado, quando uma imagem pode ser publicada, retirada de conteúdo | ECA, arts. 17, 18, 143, 232 e 247; CF, art. 37, § 1º |
| `/acessibilidade` | Declaração de acessibilidade, referências, limitações, canal de barreiras | LBI, art. 63; eMAG; WCAG 2.2 AA |
| `/pesquisa` | Ferramenta de pesquisa de conteúdo | LAI, art. 8º, § 3º, I |
| `/.well-known/security.txt` | Canal para relato responsável de falhas de segurança | RFC 9116; LGPD, art. 46 |

## Travas no sistema (o que o código impede)

- Imagem marcada como **situação protegida pelo ECA** (vítima, acolhimento, risco, ato infracional) **não publica**,
  nem com autorização (`src/fields/protecao.ts`, `Media`).
- Imagem com criança ou adolescente identificável só publica com **termo conferido e referência interna**
  (`Media`, campos `envolveMenorIdentificavel`, `consentimentoMenor`, `referenciaConsentimento`).
- **Notícia** só publica com a **declaração de proteção** de quem publica (`Noticias`, campo `declaracaoProtecao`).
- Depoimento perde a autorização quando o texto, o autor ou a origem mudam (`Depoimentos`).
- **Metadados EXIF/GPS** das fotos são removidos no envio (`Media.upload.resizeOptions`).
- Reunião reservada não aceita ata da biblioteca pública e não aparece para visitantes (`Reunioes`).
- Conteúdo com marcador de pendência (`XXXX`, `[A CONFIRMAR]`) não aparece no site (`publicText`).
- Cada campo interno (consentimento, fonte, observações) é invisível para visitantes (acesso por campo).

Todas essas travas têm teste automático: `src/collections/publication.test.ts` (unitário) e `scripts/ci-test-cms.ts`
(integração no banco isolado da CI, a cada push).

## Pendências que não são técnicas

| # | O quê | Quem | Base |
| --- | --- | --- | --- |
| 1 | Validar este dossiê, o aviso de privacidade e os termos | Procuradoria-Geral do Município | — |
| 2 | Aprovar a política de publicação e uso de imagem e o modelo de termo em reunião (resolução) | Plenário do CMDCA | Lei Municipal nº 2.626/1991 |
| 3 | Incluir os tratamentos do portal no inventário (ROPA) municipal | Encarregado do Município | LGPD, art. 37 |
| 4 | Definir o prazo de guarda das mensagens e dos termos de autorização na tabela de temporalidade | Arquivo municipal | Lei nº 8.159/1991 |
| 5 | Publicar calendário de reuniões, plano de aplicação e prestação de contas do Fundo | Conselho | LAI, art. 8º; Resolução CONANDA nº 137/2010 |
| 6 | Confirmar se a conta Google usada nas cópias de segurança externas é institucional | Responsável técnico e Prefeitura | LGPD, arts. 33 e 46 |
