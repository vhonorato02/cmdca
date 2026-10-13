/**
 * Pacote editorial de outubro de 2026.
 *
 * Textos próprios, escritos a partir de publicações públicas datadas. Cada item
 * guarda a fonte e a data de conferência no controle editorial. Não inclui
 * nomes de crianças ou adolescentes, dados bancários nem imagens de terceiros.
 */

export const VERIFIED_AT = '2026-10-12T12:00:00.000Z'
export const PACK_MARKER = '[content-pack:2026-10]'

const TRIBUNA = 'Jornal Tribuna do Norte'
const tribunaSource = (date: string) => `${TRIBUNA}, publicação de ${date}`
const ATA_10434 = `${TRIBUNA}, edição nº 10.434, de 09/04/2026, ata da 5ª reunião extraordinária de 2026`
const ATA_10434_URL = 'https://jornaltribunadonorte.com.br/wp-content/uploads/2026/04/Edital-10434.pdf'
const ECA_URL = 'https://www.planalto.gov.br/ccivil_03/leis/l8069compilado.htm'

type Tema = 'familia' | 'maos' | 'cidade' | 'encontro' | 'escudo' | 'doc'

export type PackNews = {
  slug: string
  title: string
  categoria: 'noticia' | 'conferencia' | 'evento' | 'gestao' | 'fmdca' | 'orientacao'
  tema: Tema
  data: string
  destaque?: boolean
  resumo: string
  paragraphs: string[]
  fonte: string
  fonteURL: string
}

export type PackFaq = {
  pergunta: string
  resposta: string
  contexto: 'ajuda' | 'fmdca' | 'geral'
  ordem: number
  fonte: string
  fonteURL: string
}

export type PackHighlight = {
  kicker: string
  titulo: string
  texto: string
  cta: { label: string; href: string }
  tema: Tema
  ordem: number
}

export const NEWS: PackNews[] = [
  {
    slug: '13a-conferencia-municipal-termina-com-18-propostas-e-delegados-eleitos',
    title: '13ª Conferência Municipal termina com 18 propostas e delegados eleitos',
    categoria: 'conferencia',
    tema: 'encontro',
    data: '2026-09-25T12:00:00.000Z',
    destaque: true,
    resumo:
      'Mais de 300 pessoas participaram dos quatro dias de programação. As propostas aprovadas seguem para a Conferência Estadual com delegados adultos e adolescentes.',
    paragraphs: [
      'Pindamonhangaba encerrou em 25 de setembro de 2026 a 13ª Conferência Municipal dos Direitos da Criança e do Adolescente, promovida pelo CMDCA com apoio da Prefeitura, por meio da Secretaria de Assistência Social, e da Casa dos Conselhos. O tema foi "Fortalecendo o Sistema de Garantia de Direitos da Criança e do Adolescente (SGDCA) e a Democracia Participativa".',
      'A programação começou em 22 de setembro, no Hotel Intercity, com a conferência lúdica "Democracia Participativa: Sua voz muda Pinda", dedicada a crianças e adolescentes das redes municipal e estadual. Nos dias 23 e 24, o campus da UniFUNVIC recebeu mais de 150 profissionais da rede de proteção, das áreas de Assistência Social, Saúde e Educação, além de conselheiros tutelares dos dois Conselhos do município. O encerramento aconteceu no Teatro Galpão.',
      'Ao final dos debates, organizados em seis eixos, foram aprovadas 18 propostas municipais que serão levadas à Conferência Estadual. Entre os temas estão a integração entre Conselho Tutelar, escolas e Saúde na busca ativa de estudantes em evasão escolar, a criação de mecanismos permanentes de escuta de adolescentes no CMDCA, a ampliação das políticas de saúde mental para adolescentes na rede pública e a garantia de orçamento específico para as políticas da infância e da adolescência.',
      'A conferência também elegeu os delegados que representarão Pindamonhangaba na etapa estadual. Além de representantes adultos da rede de proteção, do Conselho Tutelar e da educação, adolescentes de escolas estaduais e de entidade social foram eleitos delegados, reforçando a participação de quem é diretamente afetado pelas políticas discutidas.',
    ],
    fonte: tribunaSource('29/09/2026'),
    fonteURL:
      'https://jornaltribunadonorte.com.br/pinda-encerra-13a-conferencia-dos-direitos-da-crianca-e-do-adolescente-com-18-propostas-e-delegados-eleitos/',
  },
  {
    slug: 'iii-forum-interconselhos-debate-a-cidade-que-queremos',
    title: 'III Fórum Interconselhos debate a cidade que queremos',
    categoria: 'evento',
    tema: 'cidade',
    data: '2026-08-29T12:00:00.000Z',
    resumo:
      'Conselhos municipais, gestores e sociedade civil discutiram acessibilidade, combate ao racismo e ao bullying, cuidado e controle social. O CMDCA integrou a comissão organizadora.',
    paragraphs: [
      'Pindamonhangaba realizou em 29 de agosto de 2026 o III Fórum Interconselhos, com representantes de todos os conselhos municipais, gestores e sociedade civil. O encontro, na Secretaria de Saúde, teve como tema "Pindamonhangaba 2030: Os Conselhos planejam a cidade que queremos. Interseccionalidade na prática".',
      'Os participantes discutiram quatro eixos: Cidade Acessível; Cidade Antirracista e sem Bullying; Cidade que Cuida; e Transparência e Controle Social. O fórum foi realizado pelo Conselho Municipal de Assistência Social, com apoio da Prefeitura e dos demais conselhos.',
      'O CMDCA participou da comissão organizadora ao lado de representantes dos outros colegiados e da Casa dos Conselhos. A atuação conjunta reforça que as políticas para crianças e adolescentes dependem também de acessibilidade, saúde, educação e enfrentamento às discriminações.',
    ],
    fonte: tribunaSource('01/09/2026'),
    fonteURL: 'https://jornaltribunadonorte.com.br/iii-forum-interconselhos-debate-politicas-publicas-para-pinda/',
  },
  {
    slug: 'acao-na-praca-monsenhor-marcondes-alerta-para-o-trabalho-infantil',
    title: 'Ação na Praça Monsenhor Marcondes alerta para o trabalho infantil',
    categoria: 'evento',
    tema: 'escudo',
    data: '2026-06-17T12:00:00.000Z',
    resumo:
      'Cerca de 150 pessoas participaram da manhã de conscientização. CMDCA, Conselho Tutelar, CRAS e CREAS apresentaram seus serviços à população.',
    paragraphs: [
      'Em alusão ao Dia Mundial de Combate ao Trabalho Infantil, celebrado em 12 de junho, a Prefeitura de Pindamonhangaba, por meio da Secretaria de Assistência Social e do Programa de Erradicação do Trabalho Infantil (Peti), promoveu uma manhã de conscientização na Praça Monsenhor Marcondes. A ação reuniu cerca de 150 pessoas.',
      'O público conheceu os serviços do Cadastro Único, dos CRAS, dos CREAS, da Vigilância Socioassistencial, do CMDCA e do Conselho Tutelar. A programação incluiu orientação sobre os prejuízos do trabalho infantil e atividades recreativas.',
      'Trabalho infantil é violação de direitos. Quem suspeitar de uma situação pode procurar o Conselho Tutelar ou fazer denúncia anônima e gratuita pelo Disque 100.',
    ],
    fonte: tribunaSource('17/06/2026'),
    fonteURL:
      'https://jornaltribunadonorte.com.br/combate-ao-trabalho-infantil-reune-cerca-de-150-pessoas-em-acao-de-conscientizacao-na-praca-monsenhor-marcondes/',
  },
  {
    slug: 'maio-laranja-caminhada-mobiliza-a-cidade-contra-a-violencia-sexual',
    title: 'Maio Laranja: caminhada mobiliza a cidade contra a violência sexual',
    categoria: 'evento',
    tema: 'maos',
    data: '2026-05-18T12:00:00.000Z',
    resumo:
      'Primeira grande mobilização do município sobre o tema reuniu rede de proteção, estudantes, conselheiros e população. Denúncias podem ser feitas pelo Disque 100.',
    paragraphs: [
      'Em 18 de maio de 2026, Dia Nacional de Combate ao Abuso e à Exploração Sexual de Crianças e Adolescentes, a Prefeitura de Pindamonhangaba, por meio da Secretaria de Assistência Social, realizou uma grande caminhada pelas ruas centrais da cidade dentro da campanha Maio Laranja.',
      'Participaram servidores públicos, profissionais da rede de proteção, estudantes, conselheiros tutelares, representantes do CMDCA, organizações da sociedade civil e moradores. Foi a primeira mobilização de grande porte do município dedicada exclusivamente ao tema.',
      'Durante o percurso, foram distribuídos materiais informativos sobre como identificar sinais de violência e quais canais procurar: Disque 100, Conselhos Tutelares e delegacias. Em perigo imediato, ligue 190.',
    ],
    fonte: tribunaSource('20/05/2026'),
    fonteURL: 'https://jornaltribunadonorte.com.br/pinda-realiza-primeira-grande-caminhada-do-maio-laranja/',
  },
  {
    slug: 'cmdca-aprova-comite-de-adolescentes-e-revisao-da-legislacao',
    title: 'CMDCA aprova comitê de adolescentes e revisão da legislação',
    categoria: 'gestao',
    tema: 'doc',
    data: '2026-04-01T12:00:00.000Z',
    resumo:
      'Na 5ª reunião extraordinária de 2026, o colegiado aprovou resoluções sobre participação de adolescentes, justiça restaurativa, prazos para entidades e revisão das leis municipais.',
    paragraphs: [
      'Em 1º de abril de 2026, o CMDCA realizou sua 5ª reunião extraordinária do ano, de forma online, com conselheiros do poder público e da sociedade civil e participação de integrantes do Conselho Tutelar. A ata foi publicada no jornal oficial do município em 9 de abril de 2026.',
      'Entre as deliberações, o colegiado aprovou a Resolução nº 164, que institui o Comitê de Participação de Adolescentes (CPA). O comitê é consultivo, formado por adolescentes de 12 a 16 anos, e apoia o CMDCA levando a voz desse público às decisões, inclusive na preparação das conferências.',
      'Também foram aprovadas a Resolução nº 163, que fixa prazo de pelo menos 30 dias de antecedência para que as Organizações da Sociedade Civil apresentem ao Conselho os planos de trabalho de programas, serviços e projetos; a Resolução nº 167, que institui o Comitê Gestor Interinstitucional da Justiça Restaurativa no município; e a Resolução nº 168, que cria grupo de trabalho paritário para levantar os planos municipais ligados à infância e à adolescência.',
      'A pauta incluiu ainda a Resolução nº 162, que cria grupo de trabalho para revisar a legislação municipal do CMDCA e dos Conselhos Tutelares, a indicação de representantes para a comissão do Plano Municipal de Enfrentamento ao Trabalho Infantil e a apresentação da proposta de um site institucional que reúna, em um só lugar, os serviços voltados à criança e ao adolescente.',
    ],
    fonte: ATA_10434,
    fonteURL: ATA_10434_URL,
  },
  {
    slug: 'destina-acao-2026-orienta-contribuintes-sobre-o-imposto-de-renda',
    title: 'Destina-Ação 2026 orienta contribuintes sobre o Imposto de Renda',
    categoria: 'fmdca',
    tema: 'familia',
    data: '2026-03-16T12:00:00.000Z',
    resumo:
      'Campanha do CMDCA, lançada na ACIP, explicou como destinar parte do imposto devido ao Fundo Municipal diretamente na declaração, sem custo adicional.',
    paragraphs: [
      'O CMDCA lançou em 16 de março de 2026, no auditório da Associação Comercial e Industrial de Pindamonhangaba (ACIP), mais uma edição da campanha Destina-Ação, com apoio da Prefeitura, do Conselho Regional de Contabilidade do Estado de São Paulo e da Receita Federal. A palestra principal foi de um analista tributário da Receita Federal.',
      'A campanha orienta que a destinação na declaração é feita por quem usa o modelo por deduções legais, a chamada declaração completa. Depois de preencher rendimentos, bens e deduções, o contribuinte acessa "Doações Diretamente na Declaração", escolhe o fundo municipal na aba Criança e Adolescente e informa o valor dentro do limite calculado pelo próprio programa.',
      'Após transmitir a declaração, é preciso emitir e pagar o DARF gerado para cada destinação até o último dia do prazo de entrega. O valor é abatido do imposto a pagar ou somado à restituição, conforme o caso. Em 2026, o prazo da declaração foi de 23 de março a 29 de maio.',
      'As regras, os limites e os prazos mudam a cada exercício. Antes de destinar, confira a orientação vigente da Receita Federal na página do Fundo Municipal.',
    ],
    fonte: `${tribunaSource('06/03/2026')} e de 27/03/2026`,
    fonteURL:
      'https://jornaltribunadonorte.com.br/campanha-destina-acao-orienta-contribuintes-sobre-destinacao-do-imposto-de-renda-a-projetos-sociais/',
  },
  {
    slug: 'conselhos-e-assistencia-social-alinham-agenda-de-2026',
    title: 'Conselhos e Assistência Social alinham agenda de 2026',
    categoria: 'gestao',
    tema: 'encontro',
    data: '2026-01-30T12:00:00.000Z',
    resumo:
      'Presidentes do CMDCA, do Conselho da Pessoa Idosa e do Conselho de Assistência Social planejaram capacitações, campanhas, a Conferência Municipal e o Fórum Interconselhos.',
    paragraphs: [
      'A Secretaria Municipal de Assistência Social reuniu, no fim de janeiro de 2026, os presidentes do CMDCA, do Conselho Municipal da Pessoa Idosa e do Conselho Municipal de Assistência Social para planejar as ações conjuntas do ano. A coordenação da Central dos Conselhos também participou.',
      'A pauta incluiu capacitações para conselheiros, dirigentes e equipes das Organizações da Sociedade Civil cadastradas, a organização da Conferência Municipal dos Direitos da Criança e do Adolescente, o 3º Fórum Interconselhos e campanhas do calendário de direitos.',
      'A Conferência Municipal e o Fórum Interconselhos planejados nesse encontro foram realizados em setembro e agosto de 2026, respectivamente.',
    ],
    fonte: tribunaSource('30/01/2026'),
    fonteURL:
      'https://jornaltribunadonorte.com.br/assistencia-social-realiza-reuniao-de-alinhamento-com-conselhos-municipais/',
  },
  {
    slug: 'o-que-faz-o-cmdca-e-como-falar-com-o-conselho',
    title: 'O que faz o CMDCA e como falar com o conselho',
    categoria: 'orientacao',
    tema: 'doc',
    data: '2026-01-15T12:00:00.000Z',
    resumo:
      'O colegiado formula, acompanha e controla as políticas para a infância e a adolescência. Conselheiros atuam de forma voluntária. Veja os canais de atendimento divulgados.',
    paragraphs: [
      'O Conselho Municipal dos Direitos da Criança e do Adolescente é um órgão colegiado que formula, acompanha e controla as políticas públicas voltadas à garantia dos direitos de crianças e adolescentes em Pindamonhangaba. É composto por representantes do poder público e da sociedade civil, que atuam de forma voluntária.',
      'Entre suas atribuições estão deliberar sobre políticas e sobre a aplicação dos recursos do Fundo Municipal, fiscalizar e monitorar programas e projetos, registrar entidades e conduzir o processo de escolha do Conselho Tutelar.',
      'As reuniões podem ser ordinárias ou extraordinárias. Podem ainda ser públicas, abertas à comunidade, ou reservadas, quando o assunto exige sigilo para proteger direitos.',
      'Em janeiro de 2026, o atendimento estava provisoriamente vinculado à Secretaria de Assistência Social, pelos telefones (12) 3643-1607 e (12) 3643-1609 e pelos e-mails c.conselhos@pindamonhangaba.sp.gov.br e cmdca@pindamonhangaba.sp.gov.br. Confirme o horário antes de se deslocar.',
    ],
    fonte: tribunaSource('15/01/2026'),
    fonteURL:
      'https://jornaltribunadonorte.com.br/cmdca-atua-na-garantia-e-protecao-dos-direitos-da-crianca-e-do-adolescente-em-pinda/',
  },
  {
    slug: 'destinacao-do-ir-aos-fundos-de-pinda-cresce-83-em-2025',
    title: 'Destinação do IR aos fundos de Pinda cresce 83% em 2025',
    categoria: 'fmdca',
    tema: 'cidade',
    data: '2025-12-18T12:00:00.000Z',
    resumo:
      'Segundo estatísticas da Receita Federal divulgadas no município, os DARFs pagos a fundos de Pindamonhangaba somaram R$ 317.820,13 em 2025, contra R$ 173.626,33 em 2024.',
    paragraphs: [
      'A destinação de parte do Imposto de Renda aos fundos municipais de Pindamonhangaba avançou em 2025. De acordo com estatísticas da Receita Federal divulgadas no município, os DARFs pagos para fundos vinculados à cidade somaram R$ 317.820,13, alta de cerca de 83% em relação a 2024, quando o total foi de R$ 173.626,33.',
      'Do total registrado, 55,8% foram destinados ao fundo da criança e do adolescente e 44,2% ao fundo da pessoa idosa.',
      'O mesmo levantamento indica que o potencial de destinação do município em 2025 era de R$ 10.288.648,65 e que o valor efetivamente destinado correspondeu a 3,09% desse total. Ou seja, ainda há espaço para crescer.',
      'A destinação na declaração é possível para quem usa o modelo completo e não gera custo adicional: o valor é abatido do imposto a pagar ou somado à restituição.',
    ],
    fonte: `${tribunaSource('18/12/2025')}, com dados da Receita Federal`,
    fonteURL:
      'https://jornaltribunadonorte.com.br/imposto-solidario-destinacao-cresce-83-em-pinda-e-reforca-projetos-sociais-locais/',
  },
  {
    slug: 'cmdca-reune-empresarios-para-explicar-destinacao-ao-fundo',
    title: 'CMDCA reúne empresários para explicar destinação ao Fundo',
    categoria: 'fmdca',
    tema: 'familia',
    data: '2025-12-05T12:00:00.000Z',
    resumo:
      'Encontro no auditório da Prefeitura apresentou a empresas tributadas pelo lucro real como destinar parte do imposto devido ao Fundo Municipal da Criança e do Adolescente.',
    paragraphs: [
      'O CMDCA realizou em 5 de dezembro de 2025, no auditório da Prefeitura, a campanha de captação de recursos para o Fundo Municipal da Criança e do Adolescente, voltada a empresários e representantes de instituições. A iniciativa teve apoio da Prefeitura, da ACIP e da Receita Federal.',
      'Na apresentação, um analista tributário da Receita Federal explicou o procedimento: empresas tributadas pelo lucro real podem destinar até 1% do imposto devido ao Fundo, que emite o recibo conforme as normas da Receita, permitindo a dedução do valor.',
      'Foi explicado também que os recursos do Fundo são aplicados em projetos de Organizações da Sociedade Civil registradas no CMDCA, selecionados por edital de chamamento público e acompanhados pelo Conselho.',
      'O evento teve apresentações culturais de projetos sociais da cidade e reuniu autoridades e representantes de entidades.',
    ],
    fonte: `${tribunaSource('02/12/2025')} e de 09/12/2025`,
    fonteURL:
      'https://jornaltribunadonorte.com.br/cmdca-realiza-campanha-de-captacao-de-recursos-para-funcad-e-reune-empresarios-no-auditorio-da-prefeitura/',
  },
  {
    slug: 'conselheiros-tutelares-tomam-posse-para-o-mandato-2024-2028',
    title: 'Conselheiros tutelares tomam posse para o mandato 2024–2028',
    categoria: 'gestao',
    tema: 'escudo',
    data: '2024-01-10T12:00:00.000Z',
    resumo:
      'Os dez conselheiros tutelares eleitos assumiram em 10 de janeiro de 2024, no Palacete 10 de Julho, para um mandato que vai até 9 de janeiro de 2028.',
    paragraphs: [
      'Os dez conselheiros tutelares eleitos de Pindamonhangaba tomaram posse em 10 de janeiro de 2024, no Palacete 10 de Julho, para o mandato 2024–2028, que vai até 9 de janeiro de 2028. A cerimônia reuniu representantes da sociedade civil, da Prefeitura, de outros conselhos e autoridades.',
      'O processo de escolha foi conduzido pelo CMDCA, como prevê o Estatuto da Criança e do Adolescente. O Conselho Tutelar é o órgão autônomo encarregado de zelar pelo cumprimento dos direitos de crianças e adolescentes e atende casos de ameaça ou violação.',
      'O município conta com duas unidades: o 1º Conselho Tutelar e o 2º Conselho Tutelar, em Moreira César. Os telefones estão na página Buscar ajuda.',
    ],
    fonte: tribunaSource('12/01/2024'),
    fonteURL: 'https://jornaltribunadonorte.com.br/pinda-empossa-conselheiros-tutelares-para-mandato-2024-2028/',
  },
]

export const FAQ: PackFaq[] = [
  {
    pergunta: 'Quem pode destinar o Imposto de Renda ao Fundo na declaração?',
    resposta:
      'A pessoa física que usa o modelo por deduções legais (declaração completa). O limite na declaração é de até 3% do imposto devido, calculado pelo próprio programa. Depois de transmitir, é preciso pagar o DARF gerado até o prazo final de entrega.',
    contexto: 'fmdca',
    ordem: 10,
    fonte: 'Receita Federal, manual Meu Imposto de Renda: destinação na declaração',
    fonteURL:
      'https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/preenchimento/manual-mir/destinacao-na-declaracao',
  },
  {
    pergunta: 'Empresas também podem destinar ao Fundo?',
    resposta:
      'Sim. Pessoas jurídicas tributadas pelo lucro real podem destinar até 1% do imposto devido, conforme o art. 260 do ECA. Confirme enquadramento, prazo e recibo com a contabilidade da empresa antes de destinar.',
    contexto: 'fmdca',
    ordem: 11,
    fonte: 'Estatuto da Criança e do Adolescente, art. 260, texto compilado no Planalto',
    fonteURL: ECA_URL,
  },
  {
    pergunta: 'Qual a diferença entre o CMDCA e o Conselho Tutelar?',
    resposta:
      'O Conselho Tutelar atende casos concretos de ameaça ou violação de direitos de crianças e adolescentes. O CMDCA não atende casos: ele delibera e acompanha a política municipal, decide sobre o Fundo, registra entidades e conduz a escolha dos conselheiros tutelares.',
    contexto: 'geral',
    ordem: 12,
    fonte: 'Estatuto da Criança e do Adolescente, arts. 88, 131 e 139',
    fonteURL: ECA_URL,
  },
  {
    pergunta: 'Até quando vai o mandato atual dos conselheiros tutelares?',
    resposta:
      'Os dez conselheiros tutelares eleitos tomaram posse em 10 de janeiro de 2024 para o mandato 2024–2028, que termina em 9 de janeiro de 2028.',
    contexto: 'ajuda',
    ordem: 13,
    fonte: tribunaSource('12/01/2024'),
    fonteURL: 'https://jornaltribunadonorte.com.br/pinda-empossa-conselheiros-tutelares-para-mandato-2024-2028/',
  },
  {
    pergunta: 'O que é o Comitê de Participação de Adolescentes?',
    resposta:
      'É um comitê consultivo vinculado ao CMDCA, instituído pela Resolução nº 164, de 1º de abril de 2026. É formado por adolescentes de 12 a 16 anos e leva a voz desse público às decisões do Conselho, inclusive na preparação das conferências.',
    contexto: 'geral',
    ordem: 14,
    fonte: ATA_10434,
    fonteURL: ATA_10434_URL,
  },
  {
    pergunta: 'Onde são publicadas as resoluções e atas do CMDCA?',
    resposta:
      'Os atos do Conselho são publicados no jornal Tribuna do Norte, órgão de imprensa oficial do município. Quando os documentos são incluídos neste portal, eles aparecem nas páginas Resoluções, Editais e Reuniões.',
    contexto: 'geral',
    ordem: 15,
    fonte: `${TRIBUNA}, edição nº 10.434, de 09/04/2026`,
    fonteURL: ATA_10434_URL,
  },
]

export const HIGHLIGHTS: PackHighlight[] = [
  {
    kicker: 'Conferência 2026',
    titulo: '18 propostas para a infância de Pinda.',
    texto:
      'A 13ª Conferência Municipal reuniu mais de 300 pessoas e elegeu delegados adultos e adolescentes para a etapa estadual.',
    cta: {
      label: 'Ler a notícia',
      href: '/noticias/13a-conferencia-municipal-termina-com-18-propostas-e-delegados-eleitos',
    },
    tema: 'encontro',
    ordem: 0,
  },
  {
    kicker: 'Fundo Municipal',
    titulo: 'Parte do seu imposto pode ficar na cidade.',
    texto:
      'Veja o passo a passo para destinar ao Fundo Municipal dos Direitos da Criança e do Adolescente na declaração.',
    cta: { label: 'Como destinar', href: '/fmdca' },
    tema: 'familia',
    ordem: 2,
  },
]

/** Slides publicados anteriormente que ficaram desatualizados. */
export const RETIRED_HIGHLIGHT_TITLES = [
  'A cidade vai construir, junta, a política da infância.',
  'As reuniões do conselho são abertas.',
]
