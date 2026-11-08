# Matriz de conformidade

Situação em **08/11/2026**. Legenda: **Atende** (implementado e com evidência), **Parcial** (implementado, falta algo
que não é técnico ou não é verificável por código), **Pendente** (depende de terceiros).

Evidências automáticas rodam a cada push: unitários (`pnpm test`), integração do CMS no banco isolado
(`scripts/ci-test-cms.ts`), E2E no navegador (`tests/e2e/`) e Lighthouse em produção.

## Proteção de crianças e adolescentes (ECA, Lei nº 8.069/1990)

| Obrigação | Onde está | Evidência | Situação |
| --- | --- | --- | --- |
| Preservar imagem, identidade e valores (arts. 17 e 18) | `/uso-de-imagem`; `POLITICA-EDITORIAL.md`; campos de consentimento na Mídia | `publication.test.ts` ("travas do ECA") | Atende |
| Não divulgar ato infracional atribuído a criança ou adolescente, nem nome, foto ou referência que identifique (arts. 143 e 247) | Trava `situacaoProtegida` na Mídia (bloqueia mesmo com autorização); declaração obrigatória em Notícias | `ci-test-cms.ts` recusa as duas publicações | Atende |
| Não submeter a vexame ou constrangimento (art. 232) | `/uso-de-imagem`; checklist editorial | Revisão humana | Parcial: depende de quem publica |
| Proteção de vítimas e testemunhas (Lei nº 13.431/2017) | Mesma trava de situação protegida; portal não recebe relatos | Termos e privacidade dizem que o portal não recebe denúncias | Atende |
| Encaminhar emergências e denúncias aos canais certos | Faixa de proteção em todas as páginas; `/ajuda` | E2E `public-interactions.spec.ts` | Atende |

## Proteção de dados (LGPD, Lei nº 13.709/2018)

| Obrigação | Onde está | Evidência | Situação |
| --- | --- | --- | --- |
| Informação clara ao titular (arts. 6º, VI, e 9º) | `/privacidade` | Página publicada; axe sem violações | Atende |
| Base legal para cada tratamento (arts. 7º, 11 e 23) | `/privacidade`; `LGPD-INVENTARIO.md` | — | Atende (validar com a Procuradoria) |
| Dados de crianças e adolescentes no melhor interesse (art. 14) | Travas da Mídia e das Notícias; `/uso-de-imagem` | Testes acima | Atende |
| Minimização (art. 6º, III) | Sem formulário público, sem cadastro, sem cookie público, sem estatística; mapa e VLibras só sob demanda | `curl` em produção sem `Set-Cookie`; decisão 0006 | Atende |
| Identidade e contato do encarregado (art. 41, § 1º) | Quadro no fim de `/privacidade`, vindo de Configurações | Migration `20261108_220000_paginas_juridicas` | Atende |
| Direitos do titular e prazo de 15 dias (arts. 18 e 19) | `/privacidade`; `ATENDIMENTO-TITULAR-E-LAI.md` | — | Atende |
| Segurança (art. 46) | HTTPS + HSTS preload, CSP, `X-Frame-Options`, `Permissions-Policy`, senhas com hash, bloqueio por tentativas e limite por IP, papéis, backups cifrados testados | Cabeçalhos conferidos em produção; testes de autorização no CI | Atende |
| Metadados pessoais em arquivos (art. 46) | EXIF/GPS removidos das imagens no envio | `ci-test-cms.ts` envia JPEG com EXIF e confere o arquivo gravado | Atende (PDFs: ver Parcial abaixo) |
| Metadados em PDF (autor, software) | Orientação na Mídia e em `POLITICA-EDITORIAL.md` | — | Parcial: não há limpeza automática de PDF |
| Registro das operações (art. 37) | `LGPD-INVENTARIO.md` | — | Parcial: falta entrar no inventário municipal |
| Relatório de impacto (art. 38) | `LGPD-RIPD.md` | — | Parcial: rascunho para o encarregado |
| Comunicação de incidente (art. 48; Resolução CD/ANPD nº 15/2024, 3 dias úteis) | `INCIDENTES.md` | — | Atende (procedimento) |
| Transferência internacional (art. 33) | Cópias externas já cifradas antes do envio; mapa e VLibras só por ação do visitante, informados no aviso | `/privacidade` | Atende (ver pendência 6 do README) |

## Acesso à informação (LAI, Lei nº 12.527/2011, e Decreto Municipal nº 5.099/2014)

| Obrigação | Onde está | Evidência | Situação |
| --- | --- | --- | --- |
| Transparência ativa em sítio oficial (art. 8º, caput e § 2º) | `/conselho`, `/reunioes`, `/resolucoes`, `/editais`, `/entidades`, `/fmdca`, `/transparencia` | Páginas publicadas | Parcial: calendário, plano de aplicação e prestação de contas dependem do conselho |
| Ferramenta de pesquisa de conteúdo (art. 8º, § 3º, I) | `/pesquisa` (busca em páginas, notícias, resoluções, editais, reuniões e entidades, só o público) | E2E `visual-audit.spec.ts` ("a pesquisa do portal…") | Atende |
| Formatos abertos e acesso automatizado (art. 8º, § 3º, II e III) | API pública JSON somente-leitura do conteúdo publicado (`/api/noticias`, `/api/resolucoes`, `/api/editais`, `/api/reunioes`, `/api/entidades`, `/api/paginas`); `sitemap.xml`; documentos em PDF | Auditoria de API anônima (`scripts/audit-public-api.mjs`) | Atende |
| Atualização e data da informação (art. 8º, § 3º, VI) | Data de atualização em cada página e `verificadoEm` no controle editorial | — | Atende |
| Contato com o órgão (art. 8º, § 3º, VII) | Rodapé e quadros de contato | — | Atende |
| Acessibilidade (art. 8º, § 3º, VIII) | Ver bloco LBI | — | Atende |
| Indicar como pedir informação, prazos e recursos (arts. 9º a 15) | `/acesso-a-informacao`; atalho em `/transparencia` | Fontes da Prefeitura conferidas em 08/11/2026 | Atende |
| Proteger informação pessoal (art. 31) | Reuniões reservadas, campos internos invisíveis, travas do ECA | `ci-test-cms.ts` | Atende |

## Usuário de serviço público (Lei nº 13.460/2017)

| Obrigação | Onde está | Situação |
| --- | --- | --- |
| Canal de manifestação (ouvidoria) | `/acesso-a-informacao` aponta a Ouvidoria municipal (e-Ouve) | Atende |
| Carta de serviços (art. 7º) | Carta do Município; o portal descreve os serviços do conselho em `/participe`, `/fmdca` e `/entidades` | Parcial: incluir o CMDCA na carta municipal |

## Acessibilidade (LBI, Lei nº 13.146/2015, art. 63; Decreto nº 5.296/2004; eMAG; WCAG 2.2 AA)

| Obrigação | Onde está | Evidência | Situação |
| --- | --- | --- | --- |
| Sítio acessível | Todo o portal | axe WCAG 2.2 AA sem violações em todas as rotas, desktop e celular; reflow a 400%; Lighthouse acessibilidade 100 | Atende |
| Recursos de acessibilidade | Barra A-/A+, contraste, VLibras, pular para o conteúdo | E2E `accessibility.spec.ts` | Atende |
| Declaração e canal de barreiras | `/acessibilidade` | — | Atende |
| Testes com leitor de tela e aparelho físico | `docs/QA.md` | — | Pendente (manual) |

## Publicidade institucional e período eleitoral

| Obrigação | Onde está | Situação |
| --- | --- | --- |
| Caráter educativo, informativo ou de orientação social, sem promoção pessoal (CF, art. 37, § 1º) | `/uso-de-imagem`; `POLITICA-EDITORIAL.md`; nomes só como parte de atos | Atende (revisão humana) |
| Vedação de publicidade institucional nos 3 meses antes da eleição (Lei nº 9.504/1997, art. 73, VI, "b") | `/termos`; procedimento em `POLITICA-EDITORIAL.md` | Atende (procedimento); próxima eleição municipal: outubro de 2028 |

## Parcerias com organizações da sociedade civil (MROSC, Lei nº 13.019/2014)

| Obrigação | Onde está | Situação |
| --- | --- | --- |
| Divulgar edital de chamamento público no sítio oficial com antecedência (art. 26) | `/editais` com prazo, anexos e retificações | Atende quando o conselho publica |
| Manter relação das parcerias celebradas (art. 10) | Portal da Transparência municipal; `/transparencia` | Parcial: depende de publicação |

## Direitos autorais (Lei nº 9.610/1998)

| Obrigação | Onde está | Situação |
| --- | --- | --- |
| Créditos e licenças de fotos, fontes, mapas e ícones | `/creditos`; crédito na legenda da capa | Atende |
| Termos de reprodução do conteúdo do portal | `/termos` | Atende |

## Segurança e uso indevido

| Item | Onde está | Situação |
| --- | --- | --- |
| Canal de relato de vulnerabilidade | `/.well-known/security.txt` | Atende |
| Aviso de que invasão é crime (CP, art. 154-A) | `/termos` | Atende |
| Registros de acesso | Logs do proxy com rotação por tamanho; journal do sistema até 30 dias | Atende (o art. 15 do Marco Civil não se aplica a órgão sem fins econômicos; guarda curta favorece a minimização) |
