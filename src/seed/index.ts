/**
 * Seed inicial do CMDCA Pindamonhangaba.
 * Rodar com: pnpm seed  (usa a conexão UNPOOLED via DATABASE_MIGRATION=true)
 *
 * Regra de ouro: somente dados reais do Apêndice A. O que não está confirmado
 * entra como [A CONFIRMAR] (editável no CMS). Números de indicadores são
 * ILUSTRATIVOS e claramente marcados. As 6 notícias entram como rascunho.
 *
 * ATENÇÃO: estes valores são DEFAULTS para uma base nova. `updateGlobal`
 * sobrescreve globais — não rode em produção com conteúdo já editado.
 *
 * Dados públicos preenchidos nesta versão (fontes registradas em CONTEUDO.md):
 * - Casa dos Conselhos (endereço provisório): Prefeitura de Pindamonhangaba
 *   (noticias/assistencia-social/casa-dos-conselhos-passa-a-funcionar-provisoriamente...).
 * - 2º Conselho Tutelar (Moreira César): notícia oficial da Prefeitura (mudança em 09/06/2025).
 * Dados financeiros (CNPJ/conta) e legais (lei do CMDCA/FMDCA) permanecem
 * [A CONFIRMAR]: exigem validação em fonte oficial antes de publicar.
 */
import type { Payload } from 'payload'
import { getPayload } from 'payload'

import configPromise from '../payload.config'

const CONFIRMAR = '[A CONFIRMAR]'

type Block = { type?: 'p' | 'quote'; text: string }

/** Constrói um editorState Lexical mínimo a partir de parágrafos/citações. */
function rt(blocks: Block[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: blocks.map((b) => ({
        type: b.type === 'quote' ? 'quote' : 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        children: [
          {
            type: 'text',
            text: b.text,
            format: 0,
            style: '',
            mode: 'normal',
            detail: 0,
            version: 1,
          },
        ],
      })),
    },
  }
}

async function ensureUser(
  payload: Payload,
  user: { email: string; password: string; name: string; role: 'admin' | 'editor' },
) {
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: user.email } },
    limit: 1,
  })
  if (existing.docs.length) {
    payload.logger.info(`• usuário ${user.email} já existe — mantido`)
    return
  }
  await payload.create({ collection: 'users', data: user })
  payload.logger.info(`• usuário criado: ${user.email} (${user.role})`)
}

async function seedIfEmpty(
  payload: Payload,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  collection: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[],
) {
  const { totalDocs } = await payload.count({ collection })
  if (totalDocs > 0) {
    payload.logger.info(`• ${collection}: já populado (${totalDocs}) — pulando`)
    return
  }
  for (const data of rows) {
    await payload.create({ collection, data })
  }
  payload.logger.info(`• ${collection}: ${rows.length} registro(s) criado(s)`)
}

async function seed() {
  const payload = await getPayload({ config: await configPromise })
  payload.logger.info('=== Seed CMDCA Pindamonhangaba: início ===')

  // ----- Usuários (exemplo; trocar senhas em produção) -----
  await ensureUser(payload, {
    email: 'admin@cmdca-pinda.local',
    password: 'CmdcaAdmin#2026',
    name: 'Administrador CMDCA',
    role: 'admin',
  })
  await ensureUser(payload, {
    email: 'editor@cmdca-pinda.local',
    password: 'CmdcaEditor#2026',
    name: 'Equipe de Comunicação',
    role: 'editor',
  })

  // ----- Globais -----
  await payload.updateGlobal({
    slug: 'configuracoes',
    data: {
      nomeConselho: 'CMDCA Pindamonhangaba',
      municipio: 'Pindamonhangaba/SP',
      diretoria: {
        gestaoLabel: 'Gestão 2025–2027',
        presidenteNome: 'Dr. Rodolfo Brockhof',
        presidenteCargo: 'Presidente',
        viceNome: 'Andrea Campos Sales Martins',
        viceCargo: 'Vice-presidente',
      },
      contato: {
        email: 'cmdca@pindamonhangaba.sp.gov.br',
        telefone: '(12) 3642-1249',
        cep: '12420-070',
        casaConselhosTelefone: '(12) 3643-1607 (ramal 6037) · (12) 3643-1609',
        // Funcionamento provisório na sede da Secretaria de Assistência Social
        // (fonte: Prefeitura de Pindamonhangaba). Confirmar CEP/horário antes de divulgar.
        casaConselhosEndereco:
          'Rua Dr. Laerte Machado Guimarães, 590 — Vila Borghese, Pindamonhangaba/SP (funcionamento provisório, na Secretaria de Assistência Social)',
        assessora: 'Simone Braça',
      },
      redes: {
        instagramHandle: '@cmdca_pindamonhangaba',
        instagramUrl: 'https://www.instagram.com/cmdca_pindamonhangaba',
      },
      fmdca: {
        cnpj: CONFIRMAR,
        conta: CONFIRMAR,
        percentualDeducaoIR: 6,
        comoDestinar:
          'Pessoas físicas e jurídicas podem destinar parte do Imposto de Renda devido ao FMDCA. Os recursos permanecem em Pindamonhangaba, financiando projetos para a infância e a adolescência. Confirme limites e prazos com seu contador.',
      },
      baseLegal: { leiCMDCA: CONFIRMAR, leiFMDCA: CONFIRMAR, regimento: CONFIRMAR },
      tribunaUrl: 'https://www.jornaltribunadonorte.com.br',
    },
  })
  payload.logger.info('• global configuracoes atualizado')

  await payload.updateGlobal({
    slug: 'pagina-inicial',
    data: {
      blocos: [
        { tipo: 'slider', ativo: true },
        { tipo: 'sobre', ativo: true },
        { tipo: 'atalhos', ativo: true },
        { tipo: 'indicadores', ativo: true },
        { tipo: 'vozes', ativo: true },
        { tipo: 'noticias', ativo: true },
      ],
    },
  })
  payload.logger.info('• global pagina-inicial atualizado')

  await payload.updateGlobal({
    slug: 'indicadores',
    data: {
      alcancados: 2480,
      projetos: 34,
      entidades: 58,
      reunioesNoAno: 22,
      serieAnual: [
        { ano: '2022', valor: 12 },
        { ano: '2023', valor: 18 },
        { ano: '2024', valor: 21 },
        { ano: '2025', valor: 29 },
        { ano: '2026', valor: 34 },
      ],
      aplicacaoPorArea: [
        { area: 'Educação', percentual: 38 },
        { area: 'Saúde', percentual: 24 },
        { area: 'Cultura/Esporte', percentual: 22 },
        { area: 'Acolhimento', percentual: 16 },
      ],
      observacao: 'Valores ilustrativos — substituir pelos dados oficiais do conselho/FMDCA.',
    },
  })
  payload.logger.info('• global indicadores atualizado (valores ILUSTRATIVOS)')

  // ----- Destaques (slider) -----
  await seedIfEmpty(payload, 'destaques', [
    {
      _status: 'published',
      kicker: 'Maio Laranja',
      titulo: 'Proteger é tarefa de toda a cidade.',
      texto:
        'Campanha de enfrentamento ao abuso e à exploração de crianças e adolescentes. Saiba reconhecer sinais e onde pedir ajuda.',
      cta: { label: 'Como ajudar', href: '/ajuda' },
      tema: 'maos',
      ordem: 1,
    },
    {
      _status: 'published',
      kicker: 'Conferência 2026',
      titulo: 'A cidade vai construir, junta, a política da infância.',
      texto:
        'A Conferência Municipal dos Direitos da Criança e do Adolescente está agendada para 2026. Participe.',
      cta: { label: 'Saiba mais', href: '/conferencias' },
      tema: 'cidade',
      ordem: 2,
    },
    {
      _status: 'published',
      kicker: 'Participação',
      titulo: 'As reuniões do conselho são abertas.',
      texto:
        'Acompanhe as decisões, consulte as pautas e participe presencialmente ou pela transmissão online.',
      cta: { label: 'Ver calendário', href: '/reunioes' },
      tema: 'encontro',
      ordem: 3,
    },
  ])

  // ----- Depoimentos (vozes) -----
  await seedIfEmpty(payload, 'depoimentos', [
    {
      _status: 'published',
      frase: 'A defesa dos direitos da criança e do adolescente não pode ter intervalo.',
      autor: 'Dr. Rodolfo Brockhof',
      papel: 'Presidente do CMDCA · biênio 2025–2027',
    },
    {
      _status: 'published',
      frase:
        'Mais do que comemorar os 35 anos do ECA, queremos reforçar a participação da comunidade nesse processo de formação cidadã.',
      autor: 'Casa dos Conselhos',
      papel: 'Semana Municipal dos Direitos da Criança e do Adolescente',
    },
    {
      _status: 'published',
      frase:
        'Quando uma escola sabe a quem recorrer, a proteção deixa de ser sorte e vira rede.',
      autor: 'Educadora da rede municipal',
      papel: 'depoimento ilustrativo',
    },
  ])

  // ----- FAQ -----
  await seedIfEmpty(payload, 'faq', [
    {
      _status: 'published',
      contexto: 'ajuda',
      ordem: 1,
      pergunta: 'Como faço uma denúncia em Pindamonhangaba?',
      resposta:
        'Ligue para o Disque 100 (anônimo e gratuito, 24h) ou procure o Conselho Tutelar: 1º CT (12) 3550-0513 / 0514; 2º CT (12) 3641-1688. Em emergência, 190.',
    },
    {
      _status: 'published',
      contexto: 'fmdca',
      ordem: 2,
      pergunta: 'O que é o FMDCA?',
      resposta:
        'É o Fundo Municipal dos Direitos da Criança e do Adolescente, gerido pelo conselho. Financia projetos locais e pode receber destinação de parte do Imposto de Renda.',
    },
    {
      _status: 'published',
      contexto: 'ajuda',
      ordem: 3,
      pergunta: 'Posso participar das reuniões?',
      resposta:
        'Sim. As reuniões públicas são abertas à comunidade. Consulte o calendário e a pauta na página Reuniões.',
    },
    {
      _status: 'published',
      contexto: 'geral',
      ordem: 4,
      pergunta: 'Como minha entidade se registra no CMDCA?',
      resposta:
        'O registro segue os arts. 90 e 91 do ECA. Procure a Casa dos Conselhos (12) 3643-1607 para a relação de documentos.',
    },
  ])

  // ----- Rede de proteção (coordenadas a confirmar; não inventar lat/lng) -----
  await seedIfEmpty(payload, 'rede-protecao', [
    {
      _status: 'published',
      nome: '1º Conselho Tutelar',
      tipo: 'ct',
      endereco: 'R. Aníbal de Jesus Pinto Monteiro, 237 — Alto do Cardoso, CEP 12420-210',
      telefone: '(12) 3550-0513 · (12) 3550-0514',
      email: 'conselhotutelar1@pindamonhangaba.sp.gov.br',
      horario: 'Segunda a sexta, 7h30–17h30',
      obs: `Coordenadas para o mapa: ${CONFIRMAR}`,
    },
    {
      _status: 'published',
      nome: '2º Conselho Tutelar (Moreira César)',
      tipo: 'ct',
      // Endereço atualizado pela Prefeitura (atendimento a partir de 09/06/2025).
      endereco: 'Av. das Hortências, 168 — Vale das Acácias, Moreira César (Pindamonhangaba/SP)',
      telefone: '(12) 3641-1688',
      email: 'conselhotutelar2@pindamonhangaba.sp.gov.br',
      horario: 'Segunda a sexta, 7h30–17h30 · plantão fora do horário pela escala da Prefeitura',
      obs: `Coordenadas para o mapa: ${CONFIRMAR}`,
    },
    {
      _status: 'published',
      nome: 'Casa dos Conselhos',
      tipo: 'casa',
      // Sede provisória na Secretaria de Assistência Social (fonte: Prefeitura).
      endereco:
        'Rua Dr. Laerte Machado Guimarães, 590 — Vila Borghese, Pindamonhangaba/SP (na Secretaria de Assistência Social)',
      telefone: '(12) 3643-1607 (ramal 6037) · (12) 3643-1609',
      horario: `Segunda a sexta — horário a confirmar ${CONFIRMAR}`,
      obs: 'Assessora: Simone Braça. Funcionamento provisório.',
    },
    {
      _status: 'published',
      nome: 'CRAS (unidades)',
      tipo: 'cras',
      endereco: CONFIRMAR,
      telefone: CONFIRMAR,
      obs: 'Endereços, telefones e coordenadas a confirmar com a Secretaria de Assistência Social.',
    },
    {
      _status: 'published',
      nome: 'CREAS',
      tipo: 'creas',
      endereco: CONFIRMAR,
      telefone: CONFIRMAR,
      obs: 'Endereço, telefone e coordenadas a confirmar.',
    },
  ])

  // ----- Notícias (RASCUNHOS — Apêndice B; revisar antes de publicar) -----
  await seedIfEmpty(payload, 'noticias', [
    {
      _status: 'draft',
      title: 'Conferência Municipal dos Direitos da Criança e do Adolescente é agendada para 2026',
      categoria: 'conferencia',
      tema: 'cidade',
      destaque: true,
      autor: 'Comunicação CMDCA',
      resumo:
        'Espaço de escuta e construção coletiva da política da infância, a conferência é mais uma etapa do processo de mobilização da cidade.',
      corpo: rt([
        {
          text: 'O Conselho Municipal dos Direitos da Criança e do Adolescente (CMDCA) de Pindamonhangaba confirmou que a Conferência Municipal dos Direitos da Criança e do Adolescente está agendada para 2026. O encontro é um espaço de escuta e de construção coletiva da política municipal para a infância e a adolescência.',
        },
        {
          text: 'A conferência reúne poder público, entidades, profissionais da rede de proteção e a sociedade civil para avaliar serviços, debater prioridades e apontar diretrizes. Datas, local e programação serão divulgados nos canais oficiais do conselho.',
        },
        {
          type: 'quote',
          text: 'A defesa dos direitos da criança e do adolescente não pode ter intervalo.',
        },
        {
          text: 'Acompanhe as próximas informações nesta página e no Instagram @cmdca_pindamonhangaba.',
        },
      ]),
    },
    {
      _status: 'draft',
      title: 'Semana Municipal reúne entidades, estudantes e a Camerata Jovem do Projeto Jataí',
      categoria: 'evento',
      tema: 'encontro',
      autor: 'Comunicação CMDCA',
      data: '2025-09-22T12:00:00.000Z',
      resumo:
        'Programação gratuita no Centro Social Salesiano marcou os 35 anos do ECA, com apoio da Secretaria de Assistência Social.',
      corpo: rt([
        {
          text: 'Entre os dias 22 e 26 de setembro de 2025, Pindamonhangaba realizou a Semana Municipal dos Direitos da Criança e do Adolescente, com programação gratuita no Centro Social Salesiano (R. São João Bôsco, 727).',
        },
        {
          text: 'A semana marcou os 35 anos do Estatuto da Criança e do Adolescente (ECA) e contou com a apresentação da Camerata Jovem do Projeto Jataí, além de atividades que reuniram entidades e estudantes.',
        },
        { text: 'A realização teve apoio da Secretaria de Assistência Social, por meio da Casa dos Conselhos.' },
        {
          type: 'quote',
          text: 'Mais do que comemorar os 35 anos do ECA, queremos reforçar a participação da comunidade nesse processo de formação cidadã.',
        },
      ]),
    },
    {
      _status: 'draft',
      title: 'Nova gestão do CMDCA toma posse para o biênio 2025–2027',
      categoria: 'gestao',
      tema: 'familia',
      autor: 'Comunicação CMDCA',
      resumo:
        'Dr. Rodolfo Brockhof assume a presidência e Andrea Campos Sales Martins a vice; colegiado é paritário.',
      corpo: rt([
        {
          text: 'O CMDCA de Pindamonhangaba empossou, em junho de 2025, a nova diretoria para o biênio 2025–2027.',
        },
        {
          text: 'A presidência é exercida pelo advogado Dr. Rodolfo Brockhof, e a vice-presidência por Andrea Campos Sales Martins.',
        },
        {
          text: 'O conselho é paritário: poder público e sociedade civil dividem, em igual número, as cadeiras do colegiado, em mandato voluntário de dois anos. A composição nominal completa será publicada nesta página.',
        },
        {
          type: 'quote',
          text: 'A defesa dos direitos da criança e do adolescente não pode ter intervalo.',
        },
      ]),
    },
    {
      _status: 'draft',
      title: 'FMDCA: como destinar parte do seu Imposto de Renda à infância de Pinda',
      categoria: 'fmdca',
      tema: 'doc',
      autor: 'Comunicação CMDCA',
      resumo:
        'Pessoas físicas e empresas podem destinar parte do IR devido ao fundo; o recurso permanece na cidade.',
      corpo: rt([
        {
          text: 'O Fundo Municipal dos Direitos da Criança e do Adolescente (FMDCA) é gerido pelo conselho e financia projetos voltados à infância e à adolescência em Pindamonhangaba.',
        },
        {
          text: 'Pessoas físicas e jurídicas podem destinar parte do Imposto de Renda devido ao FMDCA. O recurso permanece no município, fortalecendo a rede local de proteção.',
        },
        {
          text: `Os dados bancários para destinação e o passo a passo serão divulgados oficialmente pelo conselho. ${CONFIRMAR}`,
        },
        { text: 'Confirme os limites e os prazos de dedução com o seu contador.' },
      ]),
    },
    {
      _status: 'draft',
      title: 'Conselho Tutelar: como e quando acionar em Pindamonhangaba',
      categoria: 'orientacao',
      tema: 'escudo',
      autor: 'Comunicação CMDCA',
      resumo: 'Duas unidades, contatos, Disque 100 e 190 — um guia rápido de orientação.',
      corpo: rt([
        {
          text: 'O Conselho Tutelar é o órgão responsável por zelar pelos direitos de crianças e adolescentes. Em Pindamonhangaba, há duas unidades.',
        },
        {
          text: '1º Conselho Tutelar — R. Aníbal de Jesus Pinto Monteiro, 237, Alto do Cardoso. Telefones (12) 3550-0513 e (12) 3550-0514. Atendimento de segunda a sexta, das 7h30 às 17h30.',
        },
        {
          text: '2º Conselho Tutelar (Moreira César) — (12) 3641-1688. Fora do horário de atendimento, o plantão é feito pela escala da Prefeitura.',
        },
        {
          text: 'Em situações de violência, negligência ou abuso, você também pode acionar o Disque 100 (anônimo e gratuito, 24h). Em caso de risco imediato à vida, ligue 190.',
        },
      ]),
    },
    {
      _status: 'draft',
      title: 'Nota técnica sobre uso de imagem de crianças (LGPD e ECA Digital)',
      categoria: 'nota-tecnica',
      tema: 'doc',
      autor: 'Jurídico CMDCA',
      resumo:
        'Orientação preliminar para publicação responsável de imagens de crianças e adolescentes.',
      corpo: rt([
        {
          text: 'Esta nota técnica orienta a publicação responsável de imagens de crianças e adolescentes, em conformidade com a Lei Geral de Proteção de Dados (LGPD) e com a legislação de proteção à infância no ambiente digital (Lei 15.211/2025).',
        },
        {
          text: 'Como regra, não se deve publicar imagem de criança ou adolescente identificável sem o consentimento formal dos responsáveis. Na dúvida, prefira imagens que não permitam identificação.',
        },
        {
          text: 'Ao divulgar atividades, dê preferência a planos abertos, ilustrações ou registros que não exponham individualmente os participantes. Guarde os termos de consentimento, quando houver.',
        },
        { text: `Esta orientação é preliminar e será detalhada pelo jurídico do conselho. ${CONFIRMAR}` },
      ]),
    },
  ])

  payload.logger.info('=== Seed concluído ===')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Falha no seed:', err)
  process.exit(1)
})
