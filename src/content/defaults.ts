/**
 * Textos institucionais padrão do portal.
 *
 * Esta é a única fonte desses textos no código: alimenta o `defaultValue` dos
 * campos do CMS, a migration que publica os valores iniciais e o fallback do
 * site quando o banco estiver indisponível. Para mudar um texto publicado, use
 * o painel; editar este arquivo só altera instalações novas.
 *
 * Dados que ainda não foram confirmados ficam como `PENDENTE` (XXXX): o site
 * não os exibe e o painel os lista como pendência.
 */

export const PENDENTE = 'XXXX'

const SOURCES = {
  disque100: 'https://www.gov.br/pt-br/servicos/denunciar-violacao-de-direitos-humanos',
  telefonesUteis: 'https://pindamonhangaba.sp.gov.br/servicos-ao-cidadao/telefones-uteis',
  segundoConselho:
    'https://pindamonhangaba.sp.gov.br/conselho-tutelar-de-moreira-cesar-passa-a-atuar-em-nova-sede-a-partir-do-dia-9-de-junho',
  receitaDeclaracao:
    'https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/preenchimento/manual-mir/destinacao-na-declaracao',
  eca: 'https://www.planalto.gov.br/ccivil_03/leis/l8069compilado.htm',
  destinaAcao:
    'https://www.pindamonhangaba.sp.gov.br/noticias/assistencia-social/destina-acao-orienta-contribuintes-sobre-destinacao-do-imposto-de-renda-em-pindamonhangaba',
  posse: 'https://pindamonhangaba.sp.gov.br/prefeitura-recebe-cerimonia-de-posse-do-cmdca',
  leiFundo:
    'https://sapl.pindamonhangaba.sp.leg.br/pysc/download_materia_pysc?cod_materia=MzI0MDE%3D&texto_original=1',
  semana2025:
    'https://pindamonhangaba.sp.gov.br/semana-municipal-destaca-desafios-e-avancos-na-defesa-dos-direitos-da-crianca-e-do-adolescente',
} as const

export type CanalTipo = 'emergencia' | 'denuncia' | 'tutelar' | 'outro'

export const TEXTOS_PADRAO = {
  protecao: {
    chamada: 'Criança ou adolescente em perigo?',
    avisoTitulo: 'Você não precisa ter certeza para pedir ajuda',
    aviso:
      'A suspeita basta. O Disque 100 é gratuito, funciona 24 horas e aceita denúncia anônima. Quem recebe a ligação orienta o próximo passo.',
    canais: [
      {
        tipo: 'emergencia' as CanalTipo,
        rotulo: 'Emergência',
        numero: '190',
        discagem: '190',
        situacao: 'Há perigo agora',
        descricao: 'Alguém está sendo agredido, ameaçado ou corre risco neste momento.',
        observacao: 'Polícia Militar, 24 horas.',
        naFaixa: true,
      },
      {
        tipo: 'denuncia' as CanalTipo,
        rotulo: 'Denúncia',
        numero: 'Disque 100',
        discagem: '100',
        situacao: 'Quero denunciar uma violação de direitos',
        descricao:
          'Violência, negligência, abuso, exploração ou a suspeita de qualquer uma delas.',
        observacao: 'Gratuito, 24 horas. Você não precisa se identificar.',
        naFaixa: true,
      },
      {
        tipo: 'tutelar' as CanalTipo,
        rotulo: 'Conselho Tutelar',
        numero: '(12) 3550-0513',
        discagem: '1235500513',
        situacao: 'Preciso do Conselho Tutelar',
        descricao:
          'Para casos de ameaça ou violação de direitos que precisam de acompanhamento na cidade.',
        observacao: '1º Conselho Tutelar. Confirme o plantão antes de ir.',
        naFaixa: true,
      },
      {
        tipo: 'outro' as CanalTipo,
        rotulo: 'Para crianças',
        numero: 'Disque 100',
        discagem: '100',
        situacao: 'Sou criança ou adolescente e preciso falar com alguém',
        descricao:
          'Se algo está machucando, assustando ou ameaçando você, peça ajuda. A culpa não é sua.',
        observacao: 'A ligação é gratuita e você não precisa dizer seu nome.',
        naFaixa: false,
      },
    ],
  },
  ajuda: {
    titulo: 'Uma criança ou adolescente precisa de ajuda?',
    introducao:
      'Escolha a situação mais parecida com a sua e ligue. Se houver perigo agora, ligue 190 antes de qualquer outra coisa.',
    conselhosTitulo: 'Conselhos Tutelares',
    conselhosTexto:
      'Pindamonhangaba tem dois Conselhos Tutelares. Eles recebem casos de ameaça ou violação de direitos e encaminham cada situação à rede de proteção.',
    redeTitulo: 'Outros serviços da rede de proteção',
    redeTexto:
      'CRAS e CREAS atendem famílias e acompanham situações de risco. Confirme endereço e horário antes de sair de casa.',
    fontes: [
      { rotulo: 'Disque 100, Governo Federal', url: SOURCES.disque100 },
      { rotulo: 'Telefones úteis da Prefeitura', url: SOURCES.telefonesUteis },
      { rotulo: 'Nova sede do Conselho Tutelar de Moreira César', url: SOURCES.segundoConselho },
    ],
  },
  fmdca: {
    titulo: 'Destine parte do seu Imposto de Renda à infância de Pinda',
    introducao:
      'O Fundo Municipal dos Direitos da Criança e do Adolescente recebe parte do imposto devido e financia projetos aprovados pelo CMDCA. Você não paga nada a mais: só escolhe onde parte do imposto será aplicada.',
    oQueETitulo: 'O que é o Fundo',
    oQueE:
      'O FMDCA reúne recursos para programas e projetos de promoção, proteção e defesa dos direitos de crianças e adolescentes de Pindamonhangaba. O CMDCA define as prioridades, aprova os projetos e acompanha a aplicação do dinheiro, com prestação de contas pública.',
    passosTitulo: 'Como destinar na declaração',
    passos: [
      {
        titulo: 'Faça a declaração completa',
        texto:
          'Preencha rendimentos, bens e deduções. A destinação só aparece no modelo por deduções legais.',
      },
      {
        titulo: 'Abra “Doações Diretamente na Declaração”',
        texto:
          'Na ficha Criança e Adolescente, escolha o fundo municipal de Pindamonhangaba (SP) e informe o valor. O programa mostra o limite disponível.',
      },
      {
        titulo: 'Pague o DARF no prazo',
        texto:
          'Depois de transmitir, emita e pague o DARF da doação até o vencimento da declaração. Sem esse pagamento, a destinação não vale.',
      },
    ],
    modalidadesTitulo: 'Quanto você pode destinar',
    modalidades: [
      {
        limite: '3%',
        titulo: 'Na declaração, pessoa física',
        texto:
          'No modelo por deduções legais, até 3% do imposto devido, dentro do prazo de entrega da declaração.',
      },
      {
        limite: '6%',
        titulo: 'Ao longo do ano, pessoa física',
        texto:
          'Doações feitas até 31 de dezembro podem chegar a 6% do imposto devido, somadas a outros incentivos, conforme o art. 260 do ECA.',
      },
      {
        limite: '1%',
        titulo: 'Empresas no lucro real',
        texto:
          'Pessoas jurídicas tributadas pelo lucro real podem destinar até 1% do imposto devido, com regras próprias.',
      },
    ],
    aviso:
      'São regras gerais. Antes de destinar, confirme prazos e limites com a Receita Federal ou com quem cuida da sua contabilidade.',
    simuladorTitulo: 'Faça uma estimativa',
    simuladorTexto:
      'Digite o imposto devido para ver quanto pode ir ao Fundo pela declaração. O valor final é calculado pelo programa da Receita Federal.',
    simuladorPercentual: 3,
    bancarioTitulo: 'Doação fora da declaração',
    bancarioAviso:
      'Os dados bancários do Fundo estão sendo conferidos e serão publicados nesta página. Não faça depósitos com base em mensagens, ligações ou dados que não estejam aqui ou em ato oficial.',
    fontes: [
      { rotulo: 'Manual da Receita Federal sobre a destinação', url: SOURCES.receitaDeclaracao },
      { rotulo: 'Estatuto da Criança e do Adolescente, art. 260', url: SOURCES.eca },
      { rotulo: 'Campanha Destina Ação, Prefeitura de Pindamonhangaba', url: SOURCES.destinaAcao },
    ],
  },
  conselho: {
    titulo: 'O que é o CMDCA',
    introducao:
      'O Conselho Municipal dos Direitos da Criança e do Adolescente decide e fiscaliza a política para a infância em Pindamonhangaba. Metade das cadeiras é da Prefeitura, metade da sociedade civil.',
    composicaoTitulo: 'Composição paritária',
    composicaoTexto:
      'Poder público e sociedade civil têm o mesmo número de conselheiros. O colegiado se reúne em sessões ordinárias e extraordinárias e decide por resolução, publicada na imprensa oficial.',
    composicaoLinkRotulo: 'Ver a posse da gestão atual',
    composicaoLinkUrl: SOURCES.posse,
    atribuicoesTitulo: 'O que o conselho faz',
    atribuicoes: [
      {
        titulo: 'Define a política municipal',
        texto:
          'Delibera diretrizes e prioridades para o atendimento de crianças e adolescentes, com base nas conferências municipais (art. 88 do ECA).',
      },
      {
        titulo: 'Decide sobre o Fundo Municipal',
        texto: 'Escolhe prioridades, aprova projetos e acompanha a aplicação dos recursos do FMDCA.',
      },
      {
        titulo: 'Registra entidades e programas',
        texto:
          'Registra e fiscaliza organizações e programas de atendimento, conforme os arts. 90 e 91 do ECA.',
      },
      {
        titulo: 'Conduz a escolha do Conselho Tutelar',
        texto:
          'Organiza o processo de escolha dos conselheiros tutelares, sob fiscalização do Ministério Público (art. 139 do ECA).',
      },
    ],
    fontes: [
      { rotulo: 'Estatuto da Criança e do Adolescente (Lei Federal nº 8.069/1990)', url: SOURCES.eca },
      { rotulo: 'Texto da lei municipal do Fundo', url: SOURCES.leiFundo },
    ],
  },
  participe: {
    titulo: 'Participe das decisões',
    introducao:
      'As reuniões do CMDCA são abertas, salvo quando a pauta exige sigilo. Veja como acompanhar, opinar e colaborar.',
    caminhos: [
      {
        titulo: 'Assista a uma reunião',
        texto: 'Confira data, horário e local no calendário. A pauta sai antes de cada sessão.',
        href: '/reunioes',
      },
      {
        titulo: 'Acompanhe as decisões',
        texto: 'Resoluções e editais mostram o que foi aprovado, com documento e publicação oficial.',
        href: '/resolucoes',
      },
      {
        titulo: 'Registre sua entidade',
        texto:
          'Organizações que atendem crianças e adolescentes precisam de registro no CMDCA. Veja quem já está registrado e fale com o conselho.',
        href: '/entidades',
      },
      {
        titulo: 'Destine seu Imposto de Renda',
        texto: 'Parte do imposto que você já paga pode financiar projetos na cidade.',
        href: '/fmdca',
      },
      {
        titulo: 'Vá a uma conferência',
        texto: 'A cada edição, a cidade avalia a política da infância e vota prioridades.',
        href: '/conferencias',
      },
    ],
    contatoTitulo: 'Fale com o conselho',
  },
  transparencia: {
    titulo: 'Transparência',
    introducao:
      'O que o CMDCA decide e como o Fundo Municipal é aplicado, com documento, data e fonte.',
    documentosTitulo: 'Plano de aplicação e prestação de contas do Fundo',
    documentosTexto:
      'Planos de aplicação, receitas, projetos financiados e prestações de contas entram nesta página assim que forem oficializados.',
    vazio: 'Ainda não há plano de aplicação ou prestação de contas publicados neste portal.',
  },
  atos: {
    reunioesTitulo: 'Reuniões',
    reunioesIntro:
      'Calendário, pautas e atas das reuniões do colegiado. As atas entram depois de aprovadas.',
    reunioesComoAcompanhar:
      'Reuniões públicas podem ser acompanhadas por qualquer pessoa. Algumas sessões são reservadas quando a pauta envolve dados protegidos de crianças, adolescentes ou famílias. Se houver transmissão, o link aparece no registro da reunião.',
    resolucoesTitulo: 'Resoluções',
    resolucoesIntro:
      'Decisões do colegiado com número, data e situação. Abra o documento ou, quando houver, a publicação oficial.',
    editaisTitulo: 'Editais',
    editaisIntro:
      'Chamamentos, processos de escolha e seleções, com prazo, situação, anexos e retificações.',
    entidadesTitulo: 'Entidades registradas',
    entidadesIntro:
      'Organizações e programas com registro no CMDCA, com número e validade quando informados.',
    entidadesOrientacaoTitulo: 'Registro ou renovação',
    entidadesOrientacao:
      'Organizações que atendem crianças e adolescentes precisam de registro no CMDCA. Os requisitos dependem do programa e dos atos em vigor: antes de protocolar documentos, consulte editais e resoluções e fale com o conselho.',
  },
  publicacoes: {
    noticiasTitulo: 'Notícias',
    noticiasIntro:
      'Comunicados, campanhas e o que acontece no conselho. Atos oficiais ficam em Resoluções e Editais.',
    conferenciasTitulo: 'Conferências e fóruns',
    conferenciasIntro:
      'Encontros abertos em que a cidade avalia a política para a infância e vota prioridades.',
    conferenciasTexto:
      'A conferência municipal reúne poder público, entidades, famílias e adolescentes. As propostas aprovadas orientam o plano de ação do CMDCA e seguem para as etapas estadual e nacional. Convocações e regulamentos aparecem em Editais.',
    registroTitulo: 'Semana Municipal de 2025',
    registroTexto:
      'De 22 a 26 de setembro de 2025, a Semana Municipal dos Direitos da Criança e do Adolescente marcou os 35 anos do ECA no Centro Social Salesiano, com a Camerata Jovem do Projeto Jataí.',
    registroRotulo: 'Ler a notícia da Prefeitura',
    registroUrl: SOURCES.semana2025,
  },
  geral: {
    rodapeDescricao:
      'Órgão paritário que delibera e fiscaliza a política para crianças e adolescentes em Pindamonhangaba.',
    naoEncontradaTitulo: 'Esta página não existe',
    naoEncontradaTexto:
      'O endereço pode ter mudado ou sido digitado errado. Escolha um dos caminhos abaixo.',
  },
}

export type TextosPadrao = typeof TEXTOS_PADRAO

export const PAGINA_INICIAL_PADRAO = {
  capa: {
    titulo: 'Direitos de crianças e adolescentes, decididos em público.',
    texto:
      'O CMDCA reúne Prefeitura e sociedade civil para cuidar da política da infância em Pindamonhangaba: define prioridades, aplica o Fundo Municipal e fiscaliza a rede de proteção.',
  },
  sobre: {
    titulo: 'Quem decide e como',
    texto:
      'O CMDCA é paritário: metade dos conselheiros representa a Prefeitura, metade a sociedade civil. As decisões saem de reuniões abertas e viram resoluções publicadas.',
  },
  rotas: {
    protecaoTitulo: 'Proteger agora',
    protecaoTexto: 'Emergência, denúncia e Conselho Tutelar, com telefones de um toque.',
    fundoTitulo: 'Destinar seu IR',
    fundoTexto: 'Parte do imposto que você já paga pode financiar projetos da cidade.',
    atosTitulo: 'Acompanhar o conselho',
    atosTexto: 'Reuniões, resoluções e editais, com data e documento.',
  },
}

export const CONFIGURACOES_PADRAO = {
  contato: {
    endereco: PENDENTE,
    horario: PENDENTE,
  },
  lgpd: {
    controlador: 'Município de Pindamonhangaba (CNPJ 45.226.214/0001-19)',
    encarregado: PENDENTE,
    encarregadoContato: PENDENTE,
  },
  fmdca: {
    cnpj: PENDENTE,
    conta: PENDENTE,
  },
}
