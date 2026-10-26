import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

import { PAGINA_INICIAL_PADRAO, PENDENTE, TEXTOS_PADRAO } from '../content/defaults'
import { lexical } from '../content/lexical'
import { PAGINAS_PADRAO } from '../content/paginas'
import { DEFAULT_NAVIGATION } from '../lib/navigation'


export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_paginas_contato" AS ENUM('nenhum', 'encarregado', 'institucional');
  CREATE TYPE "public"."enum_paginas_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum_paginas_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__paginas_v_version_contato" AS ENUM('nenhum', 'encarregado', 'institucional');
  CREATE TYPE "public"."enum__paginas_v_version_controle_editorial_status_revisao" AS ENUM('pendente', 'aprovada', 'dispensada');
  CREATE TYPE "public"."enum__paginas_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_textos_protecao_canais_tipo" AS ENUM('emergencia', 'denuncia', 'tutelar', 'outro');
  CREATE TYPE "public"."enum_textos_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__textos_v_version_protecao_canais_tipo" AS ENUM('emergencia', 'denuncia', 'tutelar', 'outro');
  CREATE TYPE "public"."enum__textos_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "paginas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"slug" varchar,
  	"resumo" varchar,
  	"atualizado_em" timestamp(3) with time zone,
  	"contato" "enum_paginas_contato" DEFAULT 'nenhum',
  	"corpo" jsonb,
  	"controle_editorial_fonte" varchar,
  	"controle_editorial_fonte_u_r_l" varchar,
  	"controle_editorial_verificado_em" timestamp(3) with time zone,
  	"controle_editorial_status_revisao" "enum_paginas_controle_editorial_status_revisao",
  	"controle_editorial_revisado_por_id" integer,
  	"controle_editorial_observacoes_internas" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_paginas_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_paginas_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titulo" varchar,
  	"version_slug" varchar,
  	"version_resumo" varchar,
  	"version_atualizado_em" timestamp(3) with time zone,
  	"version_contato" "enum__paginas_v_version_contato" DEFAULT 'nenhum',
  	"version_corpo" jsonb,
  	"version_controle_editorial_fonte" varchar,
  	"version_controle_editorial_fonte_u_r_l" varchar,
  	"version_controle_editorial_verificado_em" timestamp(3) with time zone,
  	"version_controle_editorial_status_revisao" "enum__paginas_v_version_controle_editorial_status_revisao",
  	"version_controle_editorial_revisado_por_id" integer,
  	"version_controle_editorial_observacoes_internas" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__paginas_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "textos_protecao_canais" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tipo" "enum_textos_protecao_canais_tipo" DEFAULT 'denuncia',
  	"rotulo" varchar,
  	"numero" varchar,
  	"discagem" varchar,
  	"situacao" varchar,
  	"descricao" varchar,
  	"observacao" varchar,
  	"na_faixa" boolean DEFAULT true
  );
  
  CREATE TABLE "textos_ajuda_fontes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rotulo" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "textos_fmdca_passos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"texto" varchar
  );
  
  CREATE TABLE "textos_fmdca_modalidades" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"limite" varchar,
  	"titulo" varchar,
  	"texto" varchar
  );
  
  CREATE TABLE "textos_fmdca_fontes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rotulo" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "textos_conselho_atribuicoes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"texto" varchar
  );
  
  CREATE TABLE "textos_conselho_fontes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rotulo" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "textos_participe_caminhos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"texto" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "textos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"protecao_chamada" varchar DEFAULT 'Criança ou adolescente em perigo?',
  	"protecao_aviso_titulo" varchar DEFAULT 'Você não precisa ter certeza para pedir ajuda',
  	"protecao_aviso" varchar DEFAULT 'A suspeita basta. O Disque 100 é gratuito, funciona 24 horas e aceita denúncia anônima. Quem recebe a ligação orienta o próximo passo.',
  	"ajuda_titulo" varchar DEFAULT 'Uma criança ou adolescente precisa de ajuda?',
  	"ajuda_introducao" varchar DEFAULT 'Escolha a situação mais parecida com a sua e ligue. Se houver perigo agora, ligue 190 antes de qualquer outra coisa.',
  	"ajuda_conselhos_titulo" varchar DEFAULT 'Conselhos Tutelares',
  	"ajuda_conselhos_texto" varchar DEFAULT 'Pindamonhangaba tem dois Conselhos Tutelares. Eles recebem casos de ameaça ou violação de direitos e encaminham cada situação à rede de proteção.',
  	"ajuda_rede_titulo" varchar DEFAULT 'Outros serviços da rede de proteção',
  	"ajuda_rede_texto" varchar DEFAULT 'CRAS e CREAS atendem famílias e acompanham situações de risco. Confirme endereço e horário antes de sair de casa.',
  	"fmdca_titulo" varchar DEFAULT 'Destine parte do seu Imposto de Renda à infância de Pinda',
  	"fmdca_introducao" varchar DEFAULT 'O Fundo Municipal dos Direitos da Criança e do Adolescente recebe parte do imposto devido e financia projetos aprovados pelo CMDCA. Você não paga nada a mais: só escolhe onde parte do imposto será aplicada.',
  	"fmdca_o_que_e_titulo" varchar DEFAULT 'O que é o Fundo',
  	"fmdca_o_que_e" varchar DEFAULT 'O FMDCA reúne recursos para programas e projetos de promoção, proteção e defesa dos direitos de crianças e adolescentes de Pindamonhangaba. O CMDCA define as prioridades, aprova os projetos e acompanha a aplicação do dinheiro, com prestação de contas pública.',
  	"fmdca_passos_titulo" varchar DEFAULT 'Como destinar na declaração',
  	"fmdca_modalidades_titulo" varchar DEFAULT 'Quanto você pode destinar',
  	"fmdca_aviso" varchar DEFAULT 'São regras gerais. Antes de destinar, confirme prazos e limites com a Receita Federal ou com quem cuida da sua contabilidade.',
  	"fmdca_simulador_titulo" varchar DEFAULT 'Faça uma estimativa',
  	"fmdca_simulador_texto" varchar DEFAULT 'Digite o imposto devido para ver quanto pode ir ao Fundo pela declaração. O valor final é calculado pelo programa da Receita Federal.',
  	"fmdca_simulador_percentual" numeric DEFAULT 3,
  	"fmdca_bancario_titulo" varchar DEFAULT 'Doação fora da declaração',
  	"fmdca_bancario_aviso" varchar DEFAULT 'Os dados bancários do Fundo estão sendo conferidos e serão publicados nesta página. Não faça depósitos com base em mensagens, ligações ou dados que não estejam aqui ou em ato oficial.',
  	"conselho_titulo" varchar DEFAULT 'O que é o CMDCA',
  	"conselho_introducao" varchar DEFAULT 'O Conselho Municipal dos Direitos da Criança e do Adolescente decide e fiscaliza a política para a infância em Pindamonhangaba. Metade das cadeiras é da Prefeitura, metade da sociedade civil.',
  	"conselho_composicao_titulo" varchar DEFAULT 'Composição paritária',
  	"conselho_composicao_texto" varchar DEFAULT 'Poder público e sociedade civil têm o mesmo número de conselheiros. O colegiado se reúne em sessões ordinárias e extraordinárias e decide por resolução, publicada na imprensa oficial.',
  	"conselho_composicao_link_rotulo" varchar DEFAULT 'Ver a posse da gestão atual',
  	"conselho_composicao_link_url" varchar DEFAULT 'https://pindamonhangaba.sp.gov.br/prefeitura-recebe-cerimonia-de-posse-do-cmdca',
  	"conselho_atribuicoes_titulo" varchar DEFAULT 'O que o conselho faz',
  	"participe_titulo" varchar DEFAULT 'Participe das decisões',
  	"participe_introducao" varchar DEFAULT 'As reuniões do CMDCA são abertas, salvo quando a pauta exige sigilo. Veja como acompanhar, opinar e colaborar.',
  	"participe_contato_titulo" varchar DEFAULT 'Fale com o conselho',
  	"transparencia_titulo" varchar DEFAULT 'Transparência',
  	"transparencia_introducao" varchar DEFAULT 'O que o CMDCA decide e como o Fundo Municipal é aplicado, com documento, data e fonte.',
  	"transparencia_documentos_titulo" varchar DEFAULT 'Plano de aplicação e prestação de contas do Fundo',
  	"transparencia_documentos_texto" varchar DEFAULT 'Planos de aplicação, receitas, projetos financiados e prestações de contas entram nesta página assim que forem oficializados.',
  	"transparencia_vazio" varchar DEFAULT 'Ainda não há plano de aplicação ou prestação de contas publicados neste portal.',
  	"atos_reunioes_titulo" varchar DEFAULT 'Reuniões',
  	"atos_reunioes_intro" varchar DEFAULT 'Calendário, pautas e atas das reuniões do colegiado. As atas entram depois de aprovadas.',
  	"atos_reunioes_como_acompanhar" varchar DEFAULT 'Reuniões públicas podem ser acompanhadas por qualquer pessoa. Algumas sessões são reservadas quando a pauta envolve dados protegidos de crianças, adolescentes ou famílias. Se houver transmissão, o link aparece no registro da reunião.',
  	"atos_resolucoes_titulo" varchar DEFAULT 'Resoluções',
  	"atos_resolucoes_intro" varchar DEFAULT 'Decisões do colegiado com número, data e situação. Abra o documento ou, quando houver, a publicação oficial.',
  	"atos_editais_titulo" varchar DEFAULT 'Editais',
  	"atos_editais_intro" varchar DEFAULT 'Chamamentos, processos de escolha e seleções, com prazo, situação, anexos e retificações.',
  	"atos_entidades_titulo" varchar DEFAULT 'Entidades registradas',
  	"atos_entidades_intro" varchar DEFAULT 'Organizações e programas com registro no CMDCA, com número e validade quando informados.',
  	"atos_entidades_orientacao_titulo" varchar DEFAULT 'Registro ou renovação',
  	"atos_entidades_orientacao" varchar DEFAULT 'Organizações que atendem crianças e adolescentes precisam de registro no CMDCA. Os requisitos dependem do programa e dos atos em vigor: antes de protocolar documentos, consulte editais e resoluções e fale com o conselho.',
  	"publicacoes_noticias_titulo" varchar DEFAULT 'Notícias',
  	"publicacoes_noticias_intro" varchar DEFAULT 'Comunicados, campanhas e o que acontece no conselho. Atos oficiais ficam em Resoluções e Editais.',
  	"publicacoes_conferencias_titulo" varchar DEFAULT 'Conferências e fóruns',
  	"publicacoes_conferencias_intro" varchar DEFAULT 'Encontros abertos em que a cidade avalia a política para a infância e vota prioridades.',
  	"publicacoes_conferencias_texto" varchar DEFAULT 'A conferência municipal reúne poder público, entidades, famílias e adolescentes. As propostas aprovadas orientam o plano de ação do CMDCA e seguem para as etapas estadual e nacional. Convocações e regulamentos aparecem em Editais.',
  	"publicacoes_registro_titulo" varchar DEFAULT 'Semana Municipal de 2025',
  	"publicacoes_registro_texto" varchar DEFAULT 'De 22 a 26 de setembro de 2025, a Semana Municipal dos Direitos da Criança e do Adolescente marcou os 35 anos do ECA no Centro Social Salesiano, com a Camerata Jovem do Projeto Jataí.',
  	"publicacoes_registro_rotulo" varchar DEFAULT 'Ler a notícia da Prefeitura',
  	"publicacoes_registro_url" varchar DEFAULT 'https://pindamonhangaba.sp.gov.br/semana-municipal-destaca-desafios-e-avancos-na-defesa-dos-direitos-da-crianca-e-do-adolescente',
  	"geral_rodape_descricao" varchar DEFAULT 'Órgão paritário que delibera e fiscaliza a política para crianças e adolescentes em Pindamonhangaba.',
  	"geral_nao_encontrada_titulo" varchar DEFAULT 'Esta página não existe',
  	"geral_nao_encontrada_texto" varchar DEFAULT 'O endereço pode ter mudado ou sido digitado errado. Escolha um dos caminhos abaixo.',
  	"_status" "enum_textos_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_textos_v_version_protecao_canais" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tipo" "enum__textos_v_version_protecao_canais_tipo" DEFAULT 'denuncia',
  	"rotulo" varchar,
  	"numero" varchar,
  	"discagem" varchar,
  	"situacao" varchar,
  	"descricao" varchar,
  	"observacao" varchar,
  	"na_faixa" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_textos_v_version_ajuda_fontes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rotulo" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_textos_v_version_fmdca_passos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"texto" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_textos_v_version_fmdca_modalidades" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"limite" varchar,
  	"titulo" varchar,
  	"texto" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_textos_v_version_fmdca_fontes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rotulo" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_textos_v_version_conselho_atribuicoes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"texto" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_textos_v_version_conselho_fontes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rotulo" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_textos_v_version_participe_caminhos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"texto" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_textos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_protecao_chamada" varchar DEFAULT 'Criança ou adolescente em perigo?',
  	"version_protecao_aviso_titulo" varchar DEFAULT 'Você não precisa ter certeza para pedir ajuda',
  	"version_protecao_aviso" varchar DEFAULT 'A suspeita basta. O Disque 100 é gratuito, funciona 24 horas e aceita denúncia anônima. Quem recebe a ligação orienta o próximo passo.',
  	"version_ajuda_titulo" varchar DEFAULT 'Uma criança ou adolescente precisa de ajuda?',
  	"version_ajuda_introducao" varchar DEFAULT 'Escolha a situação mais parecida com a sua e ligue. Se houver perigo agora, ligue 190 antes de qualquer outra coisa.',
  	"version_ajuda_conselhos_titulo" varchar DEFAULT 'Conselhos Tutelares',
  	"version_ajuda_conselhos_texto" varchar DEFAULT 'Pindamonhangaba tem dois Conselhos Tutelares. Eles recebem casos de ameaça ou violação de direitos e encaminham cada situação à rede de proteção.',
  	"version_ajuda_rede_titulo" varchar DEFAULT 'Outros serviços da rede de proteção',
  	"version_ajuda_rede_texto" varchar DEFAULT 'CRAS e CREAS atendem famílias e acompanham situações de risco. Confirme endereço e horário antes de sair de casa.',
  	"version_fmdca_titulo" varchar DEFAULT 'Destine parte do seu Imposto de Renda à infância de Pinda',
  	"version_fmdca_introducao" varchar DEFAULT 'O Fundo Municipal dos Direitos da Criança e do Adolescente recebe parte do imposto devido e financia projetos aprovados pelo CMDCA. Você não paga nada a mais: só escolhe onde parte do imposto será aplicada.',
  	"version_fmdca_o_que_e_titulo" varchar DEFAULT 'O que é o Fundo',
  	"version_fmdca_o_que_e" varchar DEFAULT 'O FMDCA reúne recursos para programas e projetos de promoção, proteção e defesa dos direitos de crianças e adolescentes de Pindamonhangaba. O CMDCA define as prioridades, aprova os projetos e acompanha a aplicação do dinheiro, com prestação de contas pública.',
  	"version_fmdca_passos_titulo" varchar DEFAULT 'Como destinar na declaração',
  	"version_fmdca_modalidades_titulo" varchar DEFAULT 'Quanto você pode destinar',
  	"version_fmdca_aviso" varchar DEFAULT 'São regras gerais. Antes de destinar, confirme prazos e limites com a Receita Federal ou com quem cuida da sua contabilidade.',
  	"version_fmdca_simulador_titulo" varchar DEFAULT 'Faça uma estimativa',
  	"version_fmdca_simulador_texto" varchar DEFAULT 'Digite o imposto devido para ver quanto pode ir ao Fundo pela declaração. O valor final é calculado pelo programa da Receita Federal.',
  	"version_fmdca_simulador_percentual" numeric DEFAULT 3,
  	"version_fmdca_bancario_titulo" varchar DEFAULT 'Doação fora da declaração',
  	"version_fmdca_bancario_aviso" varchar DEFAULT 'Os dados bancários do Fundo estão sendo conferidos e serão publicados nesta página. Não faça depósitos com base em mensagens, ligações ou dados que não estejam aqui ou em ato oficial.',
  	"version_conselho_titulo" varchar DEFAULT 'O que é o CMDCA',
  	"version_conselho_introducao" varchar DEFAULT 'O Conselho Municipal dos Direitos da Criança e do Adolescente decide e fiscaliza a política para a infância em Pindamonhangaba. Metade das cadeiras é da Prefeitura, metade da sociedade civil.',
  	"version_conselho_composicao_titulo" varchar DEFAULT 'Composição paritária',
  	"version_conselho_composicao_texto" varchar DEFAULT 'Poder público e sociedade civil têm o mesmo número de conselheiros. O colegiado se reúne em sessões ordinárias e extraordinárias e decide por resolução, publicada na imprensa oficial.',
  	"version_conselho_composicao_link_rotulo" varchar DEFAULT 'Ver a posse da gestão atual',
  	"version_conselho_composicao_link_url" varchar DEFAULT 'https://pindamonhangaba.sp.gov.br/prefeitura-recebe-cerimonia-de-posse-do-cmdca',
  	"version_conselho_atribuicoes_titulo" varchar DEFAULT 'O que o conselho faz',
  	"version_participe_titulo" varchar DEFAULT 'Participe das decisões',
  	"version_participe_introducao" varchar DEFAULT 'As reuniões do CMDCA são abertas, salvo quando a pauta exige sigilo. Veja como acompanhar, opinar e colaborar.',
  	"version_participe_contato_titulo" varchar DEFAULT 'Fale com o conselho',
  	"version_transparencia_titulo" varchar DEFAULT 'Transparência',
  	"version_transparencia_introducao" varchar DEFAULT 'O que o CMDCA decide e como o Fundo Municipal é aplicado, com documento, data e fonte.',
  	"version_transparencia_documentos_titulo" varchar DEFAULT 'Plano de aplicação e prestação de contas do Fundo',
  	"version_transparencia_documentos_texto" varchar DEFAULT 'Planos de aplicação, receitas, projetos financiados e prestações de contas entram nesta página assim que forem oficializados.',
  	"version_transparencia_vazio" varchar DEFAULT 'Ainda não há plano de aplicação ou prestação de contas publicados neste portal.',
  	"version_atos_reunioes_titulo" varchar DEFAULT 'Reuniões',
  	"version_atos_reunioes_intro" varchar DEFAULT 'Calendário, pautas e atas das reuniões do colegiado. As atas entram depois de aprovadas.',
  	"version_atos_reunioes_como_acompanhar" varchar DEFAULT 'Reuniões públicas podem ser acompanhadas por qualquer pessoa. Algumas sessões são reservadas quando a pauta envolve dados protegidos de crianças, adolescentes ou famílias. Se houver transmissão, o link aparece no registro da reunião.',
  	"version_atos_resolucoes_titulo" varchar DEFAULT 'Resoluções',
  	"version_atos_resolucoes_intro" varchar DEFAULT 'Decisões do colegiado com número, data e situação. Abra o documento ou, quando houver, a publicação oficial.',
  	"version_atos_editais_titulo" varchar DEFAULT 'Editais',
  	"version_atos_editais_intro" varchar DEFAULT 'Chamamentos, processos de escolha e seleções, com prazo, situação, anexos e retificações.',
  	"version_atos_entidades_titulo" varchar DEFAULT 'Entidades registradas',
  	"version_atos_entidades_intro" varchar DEFAULT 'Organizações e programas com registro no CMDCA, com número e validade quando informados.',
  	"version_atos_entidades_orientacao_titulo" varchar DEFAULT 'Registro ou renovação',
  	"version_atos_entidades_orientacao" varchar DEFAULT 'Organizações que atendem crianças e adolescentes precisam de registro no CMDCA. Os requisitos dependem do programa e dos atos em vigor: antes de protocolar documentos, consulte editais e resoluções e fale com o conselho.',
  	"version_publicacoes_noticias_titulo" varchar DEFAULT 'Notícias',
  	"version_publicacoes_noticias_intro" varchar DEFAULT 'Comunicados, campanhas e o que acontece no conselho. Atos oficiais ficam em Resoluções e Editais.',
  	"version_publicacoes_conferencias_titulo" varchar DEFAULT 'Conferências e fóruns',
  	"version_publicacoes_conferencias_intro" varchar DEFAULT 'Encontros abertos em que a cidade avalia a política para a infância e vota prioridades.',
  	"version_publicacoes_conferencias_texto" varchar DEFAULT 'A conferência municipal reúne poder público, entidades, famílias e adolescentes. As propostas aprovadas orientam o plano de ação do CMDCA e seguem para as etapas estadual e nacional. Convocações e regulamentos aparecem em Editais.',
  	"version_publicacoes_registro_titulo" varchar DEFAULT 'Semana Municipal de 2025',
  	"version_publicacoes_registro_texto" varchar DEFAULT 'De 22 a 26 de setembro de 2025, a Semana Municipal dos Direitos da Criança e do Adolescente marcou os 35 anos do ECA no Centro Social Salesiano, com a Camerata Jovem do Projeto Jataí.',
  	"version_publicacoes_registro_rotulo" varchar DEFAULT 'Ler a notícia da Prefeitura',
  	"version_publicacoes_registro_url" varchar DEFAULT 'https://pindamonhangaba.sp.gov.br/semana-municipal-destaca-desafios-e-avancos-na-defesa-dos-direitos-da-crianca-e-do-adolescente',
  	"version_geral_rodape_descricao" varchar DEFAULT 'Órgão paritário que delibera e fiscaliza a política para crianças e adolescentes em Pindamonhangaba.',
  	"version_geral_nao_encontrada_titulo" varchar DEFAULT 'Esta página não existe',
  	"version_geral_nao_encontrada_texto" varchar DEFAULT 'O endereço pode ter mudado ou sido digitado errado. Escolha um dos caminhos abaixo.',
  	"version__status" "enum__textos_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "navegacao_rodape_sobre_site" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "_navegacao_v_version_rodape_sobre_site" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "configuracoes" ALTER COLUMN "fmdca_cnpj" SET DEFAULT 'XXXX';
  ALTER TABLE "configuracoes" ALTER COLUMN "fmdca_conta" SET DEFAULT 'XXXX';
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_fmdca_cnpj" SET DEFAULT 'XXXX';
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_fmdca_conta" SET DEFAULT 'XXXX';
  ALTER TABLE "pagina_inicial" ALTER COLUMN "capa_titulo" SET DEFAULT 'Direitos de crianças e adolescentes, decididos em público.';
  ALTER TABLE "pagina_inicial" ALTER COLUMN "capa_texto" SET DEFAULT 'O CMDCA reúne Prefeitura e sociedade civil para cuidar da política da infância em Pindamonhangaba: define prioridades, aplica o Fundo Municipal e fiscaliza a rede de proteção.';
  ALTER TABLE "_pagina_inicial_v" ALTER COLUMN "version_capa_titulo" SET DEFAULT 'Direitos de crianças e adolescentes, decididos em público.';
  ALTER TABLE "_pagina_inicial_v" ALTER COLUMN "version_capa_texto" SET DEFAULT 'O CMDCA reúne Prefeitura e sociedade civil para cuidar da política da infância em Pindamonhangaba: define prioridades, aplica o Fundo Municipal e fiscaliza a rede de proteção.';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "paginas_id" integer;
  ALTER TABLE "configuracoes" ADD COLUMN "contato_endereco" varchar DEFAULT 'XXXX';
  ALTER TABLE "configuracoes" ADD COLUMN "contato_horario" varchar DEFAULT 'XXXX';
  ALTER TABLE "configuracoes" ADD COLUMN "lgpd_controlador" varchar DEFAULT 'Município de Pindamonhangaba (CNPJ 45.226.214/0001-19)';
  ALTER TABLE "configuracoes" ADD COLUMN "lgpd_encarregado" varchar DEFAULT 'XXXX';
  ALTER TABLE "configuracoes" ADD COLUMN "lgpd_encarregado_contato" varchar DEFAULT 'XXXX';
  ALTER TABLE "_configuracoes_v" ADD COLUMN "version_contato_endereco" varchar DEFAULT 'XXXX';
  ALTER TABLE "_configuracoes_v" ADD COLUMN "version_contato_horario" varchar DEFAULT 'XXXX';
  ALTER TABLE "_configuracoes_v" ADD COLUMN "version_lgpd_controlador" varchar DEFAULT 'Município de Pindamonhangaba (CNPJ 45.226.214/0001-19)';
  ALTER TABLE "_configuracoes_v" ADD COLUMN "version_lgpd_encarregado" varchar DEFAULT 'XXXX';
  ALTER TABLE "_configuracoes_v" ADD COLUMN "version_lgpd_encarregado_contato" varchar DEFAULT 'XXXX';
  ALTER TABLE "pagina_inicial" ADD COLUMN "rotas_protecao_titulo" varchar DEFAULT 'Proteger agora';
  ALTER TABLE "pagina_inicial" ADD COLUMN "rotas_protecao_texto" varchar DEFAULT 'Emergência, denúncia e Conselho Tutelar, com telefones de um toque.';
  ALTER TABLE "pagina_inicial" ADD COLUMN "rotas_fundo_titulo" varchar DEFAULT 'Destinar seu IR';
  ALTER TABLE "pagina_inicial" ADD COLUMN "rotas_fundo_texto" varchar DEFAULT 'Parte do imposto que você já paga pode financiar projetos da cidade.';
  ALTER TABLE "pagina_inicial" ADD COLUMN "rotas_atos_titulo" varchar DEFAULT 'Acompanhar o conselho';
  ALTER TABLE "pagina_inicial" ADD COLUMN "rotas_atos_texto" varchar DEFAULT 'Reuniões, resoluções e editais, com data e documento.';
  ALTER TABLE "pagina_inicial" ADD COLUMN "sobre_titulo" varchar DEFAULT 'Quem decide e como';
  ALTER TABLE "pagina_inicial" ADD COLUMN "sobre_texto" varchar DEFAULT 'O CMDCA é paritário: metade dos conselheiros representa a Prefeitura, metade a sociedade civil. As decisões saem de reuniões abertas e viram resoluções publicadas.';
  ALTER TABLE "_pagina_inicial_v" ADD COLUMN "version_rotas_protecao_titulo" varchar DEFAULT 'Proteger agora';
  ALTER TABLE "_pagina_inicial_v" ADD COLUMN "version_rotas_protecao_texto" varchar DEFAULT 'Emergência, denúncia e Conselho Tutelar, com telefones de um toque.';
  ALTER TABLE "_pagina_inicial_v" ADD COLUMN "version_rotas_fundo_titulo" varchar DEFAULT 'Destinar seu IR';
  ALTER TABLE "_pagina_inicial_v" ADD COLUMN "version_rotas_fundo_texto" varchar DEFAULT 'Parte do imposto que você já paga pode financiar projetos da cidade.';
  ALTER TABLE "_pagina_inicial_v" ADD COLUMN "version_rotas_atos_titulo" varchar DEFAULT 'Acompanhar o conselho';
  ALTER TABLE "_pagina_inicial_v" ADD COLUMN "version_rotas_atos_texto" varchar DEFAULT 'Reuniões, resoluções e editais, com data e documento.';
  ALTER TABLE "_pagina_inicial_v" ADD COLUMN "version_sobre_titulo" varchar DEFAULT 'Quem decide e como';
  ALTER TABLE "_pagina_inicial_v" ADD COLUMN "version_sobre_texto" varchar DEFAULT 'O CMDCA é paritário: metade dos conselheiros representa a Prefeitura, metade a sociedade civil. As decisões saem de reuniões abertas e viram resoluções publicadas.';
  ALTER TABLE "paginas" ADD CONSTRAINT "paginas_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_paginas_v" ADD CONSTRAINT "_paginas_v_parent_id_paginas_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."paginas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_paginas_v" ADD CONSTRAINT "_paginas_v_version_controle_editorial_revisado_por_id_users_id_fk" FOREIGN KEY ("version_controle_editorial_revisado_por_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "textos_protecao_canais" ADD CONSTRAINT "textos_protecao_canais_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."textos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "textos_ajuda_fontes" ADD CONSTRAINT "textos_ajuda_fontes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."textos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "textos_fmdca_passos" ADD CONSTRAINT "textos_fmdca_passos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."textos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "textos_fmdca_modalidades" ADD CONSTRAINT "textos_fmdca_modalidades_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."textos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "textos_fmdca_fontes" ADD CONSTRAINT "textos_fmdca_fontes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."textos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "textos_conselho_atribuicoes" ADD CONSTRAINT "textos_conselho_atribuicoes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."textos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "textos_conselho_fontes" ADD CONSTRAINT "textos_conselho_fontes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."textos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "textos_participe_caminhos" ADD CONSTRAINT "textos_participe_caminhos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."textos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_textos_v_version_protecao_canais" ADD CONSTRAINT "_textos_v_version_protecao_canais_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_textos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_textos_v_version_ajuda_fontes" ADD CONSTRAINT "_textos_v_version_ajuda_fontes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_textos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_textos_v_version_fmdca_passos" ADD CONSTRAINT "_textos_v_version_fmdca_passos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_textos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_textos_v_version_fmdca_modalidades" ADD CONSTRAINT "_textos_v_version_fmdca_modalidades_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_textos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_textos_v_version_fmdca_fontes" ADD CONSTRAINT "_textos_v_version_fmdca_fontes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_textos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_textos_v_version_conselho_atribuicoes" ADD CONSTRAINT "_textos_v_version_conselho_atribuicoes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_textos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_textos_v_version_conselho_fontes" ADD CONSTRAINT "_textos_v_version_conselho_fontes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_textos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_textos_v_version_participe_caminhos" ADD CONSTRAINT "_textos_v_version_participe_caminhos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_textos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navegacao_rodape_sobre_site" ADD CONSTRAINT "navegacao_rodape_sobre_site_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navegacao"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navegacao_v_version_rodape_sobre_site" ADD CONSTRAINT "_navegacao_v_version_rodape_sobre_site_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navegacao_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "paginas_slug_idx" ON "paginas" USING btree ("slug");
  CREATE INDEX "paginas_controle_editorial_controle_editorial_revisado_p_idx" ON "paginas" USING btree ("controle_editorial_revisado_por_id");
  CREATE INDEX "paginas_updated_at_idx" ON "paginas" USING btree ("updated_at");
  CREATE INDEX "paginas_created_at_idx" ON "paginas" USING btree ("created_at");
  CREATE INDEX "paginas_deleted_at_idx" ON "paginas" USING btree ("deleted_at");
  CREATE INDEX "paginas__status_idx" ON "paginas" USING btree ("_status");
  CREATE INDEX "_paginas_v_parent_idx" ON "_paginas_v" USING btree ("parent_id");
  CREATE INDEX "_paginas_v_version_version_slug_idx" ON "_paginas_v" USING btree ("version_slug");
  CREATE INDEX "_paginas_v_version_controle_editorial_version_controle_e_idx" ON "_paginas_v" USING btree ("version_controle_editorial_revisado_por_id");
  CREATE INDEX "_paginas_v_version_version_updated_at_idx" ON "_paginas_v" USING btree ("version_updated_at");
  CREATE INDEX "_paginas_v_version_version_created_at_idx" ON "_paginas_v" USING btree ("version_created_at");
  CREATE INDEX "_paginas_v_version_version_deleted_at_idx" ON "_paginas_v" USING btree ("version_deleted_at");
  CREATE INDEX "_paginas_v_version_version__status_idx" ON "_paginas_v" USING btree ("version__status");
  CREATE INDEX "_paginas_v_created_at_idx" ON "_paginas_v" USING btree ("created_at");
  CREATE INDEX "_paginas_v_updated_at_idx" ON "_paginas_v" USING btree ("updated_at");
  CREATE INDEX "_paginas_v_latest_idx" ON "_paginas_v" USING btree ("latest");
  CREATE INDEX "_paginas_v_autosave_idx" ON "_paginas_v" USING btree ("autosave");
  CREATE INDEX "textos_protecao_canais_order_idx" ON "textos_protecao_canais" USING btree ("_order");
  CREATE INDEX "textos_protecao_canais_parent_id_idx" ON "textos_protecao_canais" USING btree ("_parent_id");
  CREATE INDEX "textos_ajuda_fontes_order_idx" ON "textos_ajuda_fontes" USING btree ("_order");
  CREATE INDEX "textos_ajuda_fontes_parent_id_idx" ON "textos_ajuda_fontes" USING btree ("_parent_id");
  CREATE INDEX "textos_fmdca_passos_order_idx" ON "textos_fmdca_passos" USING btree ("_order");
  CREATE INDEX "textos_fmdca_passos_parent_id_idx" ON "textos_fmdca_passos" USING btree ("_parent_id");
  CREATE INDEX "textos_fmdca_modalidades_order_idx" ON "textos_fmdca_modalidades" USING btree ("_order");
  CREATE INDEX "textos_fmdca_modalidades_parent_id_idx" ON "textos_fmdca_modalidades" USING btree ("_parent_id");
  CREATE INDEX "textos_fmdca_fontes_order_idx" ON "textos_fmdca_fontes" USING btree ("_order");
  CREATE INDEX "textos_fmdca_fontes_parent_id_idx" ON "textos_fmdca_fontes" USING btree ("_parent_id");
  CREATE INDEX "textos_conselho_atribuicoes_order_idx" ON "textos_conselho_atribuicoes" USING btree ("_order");
  CREATE INDEX "textos_conselho_atribuicoes_parent_id_idx" ON "textos_conselho_atribuicoes" USING btree ("_parent_id");
  CREATE INDEX "textos_conselho_fontes_order_idx" ON "textos_conselho_fontes" USING btree ("_order");
  CREATE INDEX "textos_conselho_fontes_parent_id_idx" ON "textos_conselho_fontes" USING btree ("_parent_id");
  CREATE INDEX "textos_participe_caminhos_order_idx" ON "textos_participe_caminhos" USING btree ("_order");
  CREATE INDEX "textos_participe_caminhos_parent_id_idx" ON "textos_participe_caminhos" USING btree ("_parent_id");
  CREATE INDEX "textos__status_idx" ON "textos" USING btree ("_status");
  CREATE INDEX "_textos_v_version_protecao_canais_order_idx" ON "_textos_v_version_protecao_canais" USING btree ("_order");
  CREATE INDEX "_textos_v_version_protecao_canais_parent_id_idx" ON "_textos_v_version_protecao_canais" USING btree ("_parent_id");
  CREATE INDEX "_textos_v_version_ajuda_fontes_order_idx" ON "_textos_v_version_ajuda_fontes" USING btree ("_order");
  CREATE INDEX "_textos_v_version_ajuda_fontes_parent_id_idx" ON "_textos_v_version_ajuda_fontes" USING btree ("_parent_id");
  CREATE INDEX "_textos_v_version_fmdca_passos_order_idx" ON "_textos_v_version_fmdca_passos" USING btree ("_order");
  CREATE INDEX "_textos_v_version_fmdca_passos_parent_id_idx" ON "_textos_v_version_fmdca_passos" USING btree ("_parent_id");
  CREATE INDEX "_textos_v_version_fmdca_modalidades_order_idx" ON "_textos_v_version_fmdca_modalidades" USING btree ("_order");
  CREATE INDEX "_textos_v_version_fmdca_modalidades_parent_id_idx" ON "_textos_v_version_fmdca_modalidades" USING btree ("_parent_id");
  CREATE INDEX "_textos_v_version_fmdca_fontes_order_idx" ON "_textos_v_version_fmdca_fontes" USING btree ("_order");
  CREATE INDEX "_textos_v_version_fmdca_fontes_parent_id_idx" ON "_textos_v_version_fmdca_fontes" USING btree ("_parent_id");
  CREATE INDEX "_textos_v_version_conselho_atribuicoes_order_idx" ON "_textos_v_version_conselho_atribuicoes" USING btree ("_order");
  CREATE INDEX "_textos_v_version_conselho_atribuicoes_parent_id_idx" ON "_textos_v_version_conselho_atribuicoes" USING btree ("_parent_id");
  CREATE INDEX "_textos_v_version_conselho_fontes_order_idx" ON "_textos_v_version_conselho_fontes" USING btree ("_order");
  CREATE INDEX "_textos_v_version_conselho_fontes_parent_id_idx" ON "_textos_v_version_conselho_fontes" USING btree ("_parent_id");
  CREATE INDEX "_textos_v_version_participe_caminhos_order_idx" ON "_textos_v_version_participe_caminhos" USING btree ("_order");
  CREATE INDEX "_textos_v_version_participe_caminhos_parent_id_idx" ON "_textos_v_version_participe_caminhos" USING btree ("_parent_id");
  CREATE INDEX "_textos_v_version_version__status_idx" ON "_textos_v" USING btree ("version__status");
  CREATE INDEX "_textos_v_created_at_idx" ON "_textos_v" USING btree ("created_at");
  CREATE INDEX "_textos_v_updated_at_idx" ON "_textos_v" USING btree ("updated_at");
  CREATE INDEX "_textos_v_latest_idx" ON "_textos_v" USING btree ("latest");
  CREATE INDEX "_textos_v_autosave_idx" ON "_textos_v" USING btree ("autosave");
  CREATE INDEX "navegacao_rodape_sobre_site_order_idx" ON "navegacao_rodape_sobre_site" USING btree ("_order");
  CREATE INDEX "navegacao_rodape_sobre_site_parent_id_idx" ON "navegacao_rodape_sobre_site" USING btree ("_parent_id");
  CREATE INDEX "_navegacao_v_version_rodape_sobre_site_order_idx" ON "_navegacao_v_version_rodape_sobre_site" USING btree ("_order");
  CREATE INDEX "_navegacao_v_version_rodape_sobre_site_parent_id_idx" ON "_navegacao_v_version_rodape_sobre_site" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_paginas_fk" FOREIGN KEY ("paginas_id") REFERENCES "public"."paginas"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_paginas_id_idx" ON "payload_locked_documents_rels" USING btree ("paginas_id");`)
  await seedContent({ db, payload, req })
}

/**
 * Dados iniciais do redesenho: marca como XXXX os dados ainda não confirmados
 * (aparecem como pendência no painel), preenche os textos novos e publica as
 * páginas institucionais. Tudo é idempotente.
 */
async function seedContent({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const capa = PAGINA_INICIAL_PADRAO.capa
  // Um comando por chamada: consultas parametrizadas não aceitam vários comandos.
  const fill = [
    { table: 'configuracoes', column: 'fmdca_cnpj', value: PENDENTE },
    { table: 'configuracoes', column: 'fmdca_conta', value: PENDENTE },
    { table: 'pagina_inicial', column: 'capa_titulo', value: capa.titulo },
    { table: 'pagina_inicial', column: 'capa_texto', value: capa.texto },
  ]
  for (const { table, column, value } of fill) {
    await db.execute(
      sql`UPDATE ${sql.identifier(table)} SET ${sql.identifier(column)} = ${value} WHERE coalesce(btrim(${sql.identifier(column)}), '') = ''`,
    )
    await db.execute(
      sql`UPDATE ${sql.identifier(`_${table}_v`)} SET ${sql.identifier(`version_${column}`)} = ${value} WHERE "latest" IS TRUE AND coalesce(btrim(${sql.identifier(`version_${column}`)}), '') = ''`,
    )
  }

  const textos = (await payload.findGlobal({ slug: 'textos', req, depth: 0 })) as { _status?: string }
  if (textos?._status !== 'published') {
    await payload.updateGlobal({
      slug: 'textos',
      data: { ...TEXTOS_PADRAO, _status: 'published' },
      req,
    })
  }

  const navegacao = (await payload.findGlobal({ slug: 'navegacao', req, depth: 0 })) as {
    _status?: string
    rodapeSobreSite?: unknown[]
  }
  if (navegacao?._status === 'published' && !navegacao.rodapeSobreSite?.length) {
    await payload.updateGlobal({
      slug: 'navegacao',
      data: { rodapeSobreSite: DEFAULT_NAVIGATION.rodapeSobreSite, _status: 'published' },
      req,
    })
  }

  for (const pagina of PAGINAS_PADRAO) {
    const existing = await payload.find({
      collection: 'paginas',
      where: { slug: { equals: pagina.slug } },
      limit: 1,
      depth: 0,
      req,
      trash: true,
    })
    if (existing.totalDocs) continue
    await payload.create({
      collection: 'paginas',
      data: {
        titulo: pagina.titulo,
        slug: pagina.slug,
        resumo: pagina.resumo,
        atualizadoEm: pagina.atualizadoEm,
        contato: pagina.contato,
        corpo: lexical(pagina.blocos),
        controleEditorial: {
          fonte: 'Texto institucional do portal do CMDCA (versão de 26/10/2026)',
          verificadoEm: pagina.atualizadoEm,
        },
        _status: 'published',
      },
      req,
    })
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "paginas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_paginas_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "textos_protecao_canais" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "textos_ajuda_fontes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "textos_fmdca_passos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "textos_fmdca_modalidades" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "textos_fmdca_fontes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "textos_conselho_atribuicoes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "textos_conselho_fontes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "textos_participe_caminhos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "textos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_textos_v_version_protecao_canais" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_textos_v_version_ajuda_fontes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_textos_v_version_fmdca_passos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_textos_v_version_fmdca_modalidades" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_textos_v_version_fmdca_fontes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_textos_v_version_conselho_atribuicoes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_textos_v_version_conselho_fontes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_textos_v_version_participe_caminhos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_textos_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "navegacao_rodape_sobre_site" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_navegacao_v_version_rodape_sobre_site" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "paginas" CASCADE;
  DROP TABLE "_paginas_v" CASCADE;
  DROP TABLE "textos_protecao_canais" CASCADE;
  DROP TABLE "textos_ajuda_fontes" CASCADE;
  DROP TABLE "textos_fmdca_passos" CASCADE;
  DROP TABLE "textos_fmdca_modalidades" CASCADE;
  DROP TABLE "textos_fmdca_fontes" CASCADE;
  DROP TABLE "textos_conselho_atribuicoes" CASCADE;
  DROP TABLE "textos_conselho_fontes" CASCADE;
  DROP TABLE "textos_participe_caminhos" CASCADE;
  DROP TABLE "textos" CASCADE;
  DROP TABLE "_textos_v_version_protecao_canais" CASCADE;
  DROP TABLE "_textos_v_version_ajuda_fontes" CASCADE;
  DROP TABLE "_textos_v_version_fmdca_passos" CASCADE;
  DROP TABLE "_textos_v_version_fmdca_modalidades" CASCADE;
  DROP TABLE "_textos_v_version_fmdca_fontes" CASCADE;
  DROP TABLE "_textos_v_version_conselho_atribuicoes" CASCADE;
  DROP TABLE "_textos_v_version_conselho_fontes" CASCADE;
  DROP TABLE "_textos_v_version_participe_caminhos" CASCADE;
  DROP TABLE "_textos_v" CASCADE;
  DROP TABLE "navegacao_rodape_sobre_site" CASCADE;
  DROP TABLE "_navegacao_v_version_rodape_sobre_site" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_paginas_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_paginas_id_idx";
  ALTER TABLE "configuracoes" ALTER COLUMN "fmdca_cnpj" DROP DEFAULT;
  ALTER TABLE "configuracoes" ALTER COLUMN "fmdca_conta" DROP DEFAULT;
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_fmdca_cnpj" DROP DEFAULT;
  ALTER TABLE "_configuracoes_v" ALTER COLUMN "version_fmdca_conta" DROP DEFAULT;
  ALTER TABLE "pagina_inicial" ALTER COLUMN "capa_titulo" DROP DEFAULT;
  ALTER TABLE "pagina_inicial" ALTER COLUMN "capa_texto" DROP DEFAULT;
  ALTER TABLE "_pagina_inicial_v" ALTER COLUMN "version_capa_titulo" DROP DEFAULT;
  ALTER TABLE "_pagina_inicial_v" ALTER COLUMN "version_capa_texto" DROP DEFAULT;
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "paginas_id";
  ALTER TABLE "configuracoes" DROP COLUMN "contato_endereco";
  ALTER TABLE "configuracoes" DROP COLUMN "contato_horario";
  ALTER TABLE "configuracoes" DROP COLUMN "lgpd_controlador";
  ALTER TABLE "configuracoes" DROP COLUMN "lgpd_encarregado";
  ALTER TABLE "configuracoes" DROP COLUMN "lgpd_encarregado_contato";
  ALTER TABLE "_configuracoes_v" DROP COLUMN "version_contato_endereco";
  ALTER TABLE "_configuracoes_v" DROP COLUMN "version_contato_horario";
  ALTER TABLE "_configuracoes_v" DROP COLUMN "version_lgpd_controlador";
  ALTER TABLE "_configuracoes_v" DROP COLUMN "version_lgpd_encarregado";
  ALTER TABLE "_configuracoes_v" DROP COLUMN "version_lgpd_encarregado_contato";
  ALTER TABLE "pagina_inicial" DROP COLUMN "rotas_protecao_titulo";
  ALTER TABLE "pagina_inicial" DROP COLUMN "rotas_protecao_texto";
  ALTER TABLE "pagina_inicial" DROP COLUMN "rotas_fundo_titulo";
  ALTER TABLE "pagina_inicial" DROP COLUMN "rotas_fundo_texto";
  ALTER TABLE "pagina_inicial" DROP COLUMN "rotas_atos_titulo";
  ALTER TABLE "pagina_inicial" DROP COLUMN "rotas_atos_texto";
  ALTER TABLE "pagina_inicial" DROP COLUMN "sobre_titulo";
  ALTER TABLE "pagina_inicial" DROP COLUMN "sobre_texto";
  ALTER TABLE "_pagina_inicial_v" DROP COLUMN "version_rotas_protecao_titulo";
  ALTER TABLE "_pagina_inicial_v" DROP COLUMN "version_rotas_protecao_texto";
  ALTER TABLE "_pagina_inicial_v" DROP COLUMN "version_rotas_fundo_titulo";
  ALTER TABLE "_pagina_inicial_v" DROP COLUMN "version_rotas_fundo_texto";
  ALTER TABLE "_pagina_inicial_v" DROP COLUMN "version_rotas_atos_titulo";
  ALTER TABLE "_pagina_inicial_v" DROP COLUMN "version_rotas_atos_texto";
  ALTER TABLE "_pagina_inicial_v" DROP COLUMN "version_sobre_titulo";
  ALTER TABLE "_pagina_inicial_v" DROP COLUMN "version_sobre_texto";
  DROP TYPE "public"."enum_paginas_contato";
  DROP TYPE "public"."enum_paginas_controle_editorial_status_revisao";
  DROP TYPE "public"."enum_paginas_status";
  DROP TYPE "public"."enum__paginas_v_version_contato";
  DROP TYPE "public"."enum__paginas_v_version_controle_editorial_status_revisao";
  DROP TYPE "public"."enum__paginas_v_version_status";
  DROP TYPE "public"."enum_textos_protecao_canais_tipo";
  DROP TYPE "public"."enum_textos_status";
  DROP TYPE "public"."enum__textos_v_version_protecao_canais_tipo";
  DROP TYPE "public"."enum__textos_v_version_status";`)
}
