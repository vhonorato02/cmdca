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
        situacao: 'Alguém corre perigo agora',
        descricao: 'Alguém está sendo agredido, ameaçado ou corre risco neste momento.',
        observacao: 'Polícia Militar, 24 horas.',
        naFaixa: true,
      },
      {
        tipo: 'denuncia' as CanalTipo,
        rotulo: 'Denúncia',
        numero: 'Disque 100',
        discagem: '100',
        situacao: 'Denunciar violação de direitos',
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
        situacao: 'Falar com o Conselho Tutelar',
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
        situacao: 'Sou criança ou adolescente e preciso de ajuda',
        descricao:
          'Se algo está machucando, assustando ou ameaçando você, peça ajuda. A culpa não é sua.',
        observacao: 'A ligação é gratuita e você não precisa dizer seu nome.',
        naFaixa: false,
      },
    ],
  },
  ajuda: {
    titulo: 'Pedir ajuda para uma criança ou adolescente',
    introducao:
      'Escolha a situação mais parecida com a sua e ligue para o canal indicado. Se alguém corre perigo agora, ligue 190.',
    conselhosTitulo: 'Conselhos Tutelares',
    conselhosTexto:
      'Pindamonhangaba tem dois Conselhos Tutelares. Eles recebem casos de ameaça ou violação de direitos e encaminham cada situação à rede de proteção.',
    redeTitulo: 'Outros serviços da rede de proteção',
    redeTexto:
      'O CRAS e o CREAS atendem famílias e acompanham situações de risco. Confirme o endereço e o horário de atendimento antes de ir.',
    fontes: [
      { rotulo: 'Disque 100, Governo Federal', url: SOURCES.disque100 },
      { rotulo: 'Telefones úteis da Prefeitura', url: SOURCES.telefonesUteis },
      { rotulo: 'Nova sede do Conselho Tutelar de Moreira César', url: SOURCES.segundoConselho },
    ],
  },
  fmdca: {
    titulo: 'Destinar parte do Imposto de Renda ao Fundo Municipal',
    introducao:
      'Você pode direcionar parte do Imposto de Renda devido ao Fundo Municipal dos Direitos da Criança e do Adolescente (FMDCA). O valor é abatido do imposto: você não paga nada a mais, e o dinheiro financia projetos aprovados pelo CMDCA.',
    oQueETitulo: 'O que é o Fundo Municipal',
    oQueE:
      'O FMDCA reúne recursos para programas e projetos de promoção, proteção e defesa dos direitos de crianças e adolescentes de Pindamonhangaba. O CMDCA define as prioridades, aprova os projetos e acompanha a aplicação do dinheiro, com prestação de contas pública.',
    passosTitulo: 'Como destinar na declaração',
    passos: [
      {
        titulo: 'Preencha a declaração completa',
        texto:
          'Preencha rendimentos, bens e deduções. A destinação só aparece no modelo por deduções legais.',
      },
      {
        titulo: 'Informe a doação na ficha própria',
        texto:
          'Em “Doações Diretamente na Declaração”, na ficha Criança e Adolescente, escolha o fundo municipal de Pindamonhangaba (SP) e informe o valor. O programa mostra o limite disponível.',
      },
      {
        titulo: 'Pague o DARF até o prazo',
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
    simuladorTitulo: 'Simular o valor da doação',
    simuladorTexto:
      'Digite o imposto devido para ver quanto pode ir ao Fundo pela declaração. O valor final é calculado pelo programa da Receita Federal.',
    simuladorPercentual: 3,
    bancarioTitulo: 'Doar fora da declaração',
    bancarioAviso:
      'Os dados bancários do Fundo estão sendo conferidos e serão publicados nesta página. Não faça depósitos com base em mensagens, ligações ou dados que não estejam aqui ou em ato oficial.',
    fontes: [
      { rotulo: 'Manual da Receita Federal sobre a destinação', url: SOURCES.receitaDeclaracao },
      { rotulo: 'Estatuto da Criança e do Adolescente, art. 260', url: SOURCES.eca },
      { rotulo: 'Campanha Destina Ação, Prefeitura de Pindamonhangaba', url: SOURCES.destinaAcao },
    ],
  },
  conselho: {
    titulo: 'Sobre o CMDCA',
    introducao:
      'O Conselho Municipal dos Direitos da Criança e do Adolescente (CMDCA) define as prioridades da política para a infância em Pindamonhangaba e acompanha sua execução. Metade dos conselheiros representa a Prefeitura e metade, a sociedade civil.',
    composicaoTitulo: 'Composição paritária',
    composicaoTexto:
      'Poder público e sociedade civil têm o mesmo número de conselheiros. O colegiado se reúne em sessões ordinárias e extraordinárias e decide por resolução, publicada na imprensa oficial.',
    composicaoLinkRotulo: 'Ler a notícia da posse da gestão atual',
    composicaoLinkUrl: SOURCES.posse,
    atribuicoesTitulo: 'Atribuições do conselho',
    atribuicoes: [
      {
        titulo: 'Definir a política municipal',
        texto:
          'Delibera diretrizes e prioridades para o atendimento de crianças e adolescentes, com base nas conferências municipais (art. 88 do ECA).',
      },
      {
        titulo: 'Decidir sobre o Fundo Municipal',
        texto: 'Escolhe prioridades, aprova projetos e acompanha a aplicação dos recursos do FMDCA.',
      },
      {
        titulo: 'Registrar entidades e programas',
        texto:
          'Registra e fiscaliza organizações e programas de atendimento, conforme os arts. 90 e 91 do ECA.',
      },
      {
        titulo: 'Conduzir a escolha do Conselho Tutelar',
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
    titulo: 'Participar do CMDCA',
    introducao:
      'As reuniões do conselho são abertas ao público, exceto quando a pauta envolve informações protegidas. Veja como acompanhar, opinar e colaborar.',
    caminhos: [
      {
        titulo: 'Assistir a uma reunião',
        texto: 'Confira data, horário e local no calendário. A pauta sai antes de cada sessão.',
        href: '/reunioes',
      },
      {
        titulo: 'Acompanhar as decisões',
        texto: 'Resoluções e editais mostram o que foi aprovado, com documento e publicação oficial.',
        href: '/resolucoes',
      },
      {
        titulo: 'Registrar uma entidade',
        texto:
          'Organizações que atendem crianças e adolescentes precisam de registro no CMDCA. Veja quem já está registrado e fale com o conselho.',
        href: '/entidades',
      },
      {
        titulo: 'Destinar Imposto de Renda',
        texto: 'Parte do imposto que você já paga pode financiar projetos na cidade.',
        href: '/fmdca',
      },
      {
        titulo: 'Participar de uma conferência',
        texto: 'A cada edição, a cidade avalia a política da infância e vota prioridades.',
        href: '/conferencias',
      },
    ],
    contatoTitulo: 'Falar com o conselho',
  },
  transparencia: {
    titulo: 'Transparência',
    introducao:
      'Consulte as decisões do CMDCA e a aplicação dos recursos do Fundo Municipal, com documento, data e fonte.',
    documentosTitulo: 'Plano de aplicação e prestação de contas do Fundo',
    documentosTexto:
      'Planos de aplicação, receitas, projetos financiados e prestações de contas entram nesta página assim que forem oficializados.',
    vazio: 'Ainda não há plano de aplicação ou prestação de contas publicados neste portal.',
  },
  atos: {
    reunioesTitulo: 'Reuniões',
    reunioesIntro:
      'Consulte o calendário, as pautas e as atas das reuniões do conselho. As atas são publicadas depois de aprovadas.',
    reunioesComoAcompanhar:
      'Reuniões públicas podem ser acompanhadas por qualquer pessoa. Algumas sessões são reservadas quando a pauta envolve dados protegidos de crianças, adolescentes ou famílias. Se houver transmissão, o link aparece no registro da reunião.',
    resolucoesTitulo: 'Resoluções',
    resolucoesIntro:
      'Consulte as decisões do conselho por número, data e situação, com o documento ou a publicação oficial.',
    editaisTitulo: 'Editais',
    editaisIntro:
      'Consulte chamamentos, seleções e processos de escolha, com prazos, situação, anexos e retificações.',
    entidadesTitulo: 'Entidades registradas',
    entidadesIntro:
      'Consulte as organizações e os programas registrados no CMDCA, com número e validade do registro quando informados.',
    entidadesOrientacaoTitulo: 'Como registrar ou renovar',
    entidadesOrientacao:
      'Organizações que atendem crianças e adolescentes precisam de registro no CMDCA. Os requisitos dependem do programa e dos atos em vigor: antes de protocolar documentos, consulte editais e resoluções e fale com o conselho.',
  },
  publicacoes: {
    noticiasTitulo: 'Notícias',
    noticiasIntro:
      'Comunicados, campanhas e ações do conselho. Os atos oficiais estão em Resoluções e Editais.',
    conferenciasTitulo: 'Conferências e fóruns',
    conferenciasIntro:
      'Encontros abertos em que a cidade avalia a política para a infância e define prioridades.',
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
    naoEncontradaTitulo: 'Página não encontrada',
    naoEncontradaTexto:
      'O endereço pode estar errado ou a página foi removida. Use um dos caminhos abaixo para continuar.',
  },
}

export type TextosPadrao = typeof TEXTOS_PADRAO

export const PAGINA_INICIAL_PADRAO = {
  capa: {
    titulo: 'Proteção e direitos de crianças e adolescentes em Pindamonhangaba',
    texto:
      'O CMDCA define as prioridades da política para a infância, decide como usar o Fundo Municipal e acompanha os serviços de proteção da cidade.',
  },
  sobre: {
    titulo: 'Sobre o CMDCA',
    texto:
      'O conselho reúne representantes da Prefeitura e da sociedade civil em número igual. As decisões são tomadas em reuniões e publicadas como resoluções.',
  },
  rotas: {
    protecaoTitulo: 'Precisa de ajuda agora?',
    protecaoTexto: 'Escolha o canal de acordo com a situação. Em caso de perigo imediato, ligue 190.',
    fundoTitulo: 'Destinar Imposto de Renda',
    fundoTexto: 'Direcione parte do imposto devido ao Fundo Municipal, sem pagar nada a mais.',
    atosTitulo: 'Acompanhar reuniões',
    atosTexto: 'Calendário, pautas e atas das reuniões do conselho.',
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
