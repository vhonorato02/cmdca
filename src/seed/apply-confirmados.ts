/**
 * Prepara como RASCUNHO dados confirmados em fonte oficial
 * (endereços da rede de proteção, telefone/endereço da Casa dos Conselhos e a
 * lei de criação do CMDCA). Fontes em CONTEUDO.md.
 *
 * É idempotente (faz upsert por nome) e NÃO toca em dados pendentes
 * (CNPJ/conta do FMDCA), nem nos indicadores ou na página inicial.
 * `configuracoes` tem versionamento — dá para reverter pelo painel.
 *
 * Exige APPLY_CONFIRMED_DATA=true. O jurídico deve revisar e publicar no painel.
 */
import type { Payload } from 'payload'
import { getPayload } from 'payload'

import configPromise from '../payload.config'

const CASA_ENDERECO =
  'Rua Dr. Laerte Machado Guimarães, 590 — Vila Borghese, Pindamonhangaba/SP (na Secretaria de Assistência Social)'
const CASA_TELEFONE = '(12) 3643-1607 (ramal 6037) · (12) 3643-1609'
const LEI_CMDCA = 'Lei Municipal nº 2.626, de 19/12/1991'
const LEI_FMDCA = 'Lei Municipal nº 4.140, de 23/03/2004'

type Ponto = {
  nome: string
  tipo: 'ct' | 'cras' | 'creas' | 'casa' | 'outro'
  endereco: string
  telefone?: string
  horario?: string
  obs?: string
}

// Pontos confirmados (fonte: páginas oficiais da Prefeitura — ver CONTEUDO.md).
const PONTOS: Ponto[] = [
  {
    nome: '2º Conselho Tutelar (Moreira César)',
    tipo: 'ct',
    endereco: 'Av. das Hortências, 168 — Vale das Acácias, Moreira César (Pindamonhangaba/SP)',
    telefone: '(12) 3641-1688',
    horario: 'Segunda a sexta, 7h30–17h30 · plantão fora do horário pela escala da Prefeitura',
  },
  {
    nome: 'Casa dos Conselhos',
    tipo: 'casa',
    endereco: CASA_ENDERECO,
    telefone: CASA_TELEFONE,
    obs: 'Assessora: Simone Braça. Funcionamento provisório.',
  },
  {
    nome: 'CRAS Araretama',
    tipo: 'cras',
    endereco: 'Rua José Alves Pereira Sobrinho, 36 — Araretama, CEP 12426-320',
    telefone: '(12) 3643-4209 (ramais 9026/9027)',
    horario: 'Segunda a sexta',
  },
  {
    nome: 'CRAS Castolira',
    tipo: 'cras',
    endereco: 'Rua Regina Célia Pestana César, 276 — Castolira, CEP 12405-490',
    telefone: '(12) 3645-3672 (ramal 8850)',
    horario: 'Segunda a sexta',
  },
  {
    nome: 'CRAS Centro',
    tipo: 'cras',
    endereco: 'Rua Dr. Laerte de Assunção Júnior, 51 — Campo Alegre, CEP 12412-040',
    telefone: '(12) 3642-1302 (ramais 8804/8805)',
    horario: 'Segunda a sexta',
  },
  {
    nome: 'CRAS Cidade Nova',
    tipo: 'cras',
    endereco: 'Av. Rio de Janeiro, 475 — Cidade Nova, CEP 12414-080',
    telefone: '(12) 3645-6949 (ramais 8964/8965)',
    horario: 'Segunda a sexta',
  },
  {
    nome: 'CRAS Moreira César',
    tipo: 'cras',
    endereco: 'Rua Carlos Augusto Machado, 63 — Moreira César, CEP 12441-020',
    telefone: '(12) 3637-5386 (ramais 9132/9133)',
    horario: 'Segunda a sexta',
  },
  {
    nome: 'CREAS Centro',
    tipo: 'creas',
    endereco: 'Av. Fortunato Moreira, 341 — Centro',
    telefone: '(12) 3642-6856 · (12) 3642-6403 (ramais 7090/7091)',
    horario: 'Segunda a sexta, 8h–17h',
    obs: 'Serviços: PAEFI, alta complexidade e abordagem social.',
  },
  {
    nome: 'CREAS Moreira César',
    tipo: 'creas',
    endereco: 'Rua Joaquim Santana Salvador, 105 — Moreira César',
    telefone: '(12) 3550-3608 · (12) 3550-3609 (ramais 9198/9199)',
    horario: 'Segunda a sexta',
  },
]

async function upsertPonto(payload: Payload, p: Ponto): Promise<'criado' | 'atualizado'> {
  const existing = await payload.find({
    collection: 'rede-protecao',
    where: { nome: { equals: p.nome } },
    limit: 1,
    overrideAccess: true,
  })
  const data = { ...p, _status: 'draft' as const }
  if (existing.docs.length) {
    await payload.update({
      collection: 'rede-protecao',
      id: existing.docs[0].id,
      data,
      draft: true,
      overrideAccess: true,
    })
    return 'atualizado'
  }
  await payload.create({
    collection: 'rede-protecao',
    data,
    draft: true,
    overrideAccess: true,
  })
  return 'criado'
}

async function main() {
  if (process.env.APPLY_CONFIRMED_DATA !== 'true') {
    throw new Error('Operação bloqueada. Defina APPLY_CONFIRMED_DATA=true após conferir o banco alvo.')
  }
  const payload = await getPayload({ config: await configPromise })
  payload.logger.info('=== Preparando dados confirmados como rascunho ===')

  // 1) Configurações: somente lei do CMDCA + endereço/telefone da Casa.
  //    Mantém todo o resto (inclui FMDCA pendente) intacto via spread.
  const cfg = (await payload.findGlobal({
    slug: 'configuracoes',
    overrideAccess: true,
  })) as unknown as Record<string, unknown>
  await payload.updateGlobal({
    slug: 'configuracoes',
    draft: true,
    overrideAccess: true,
    data: {
      ...cfg,
      _status: 'draft',
      contato: {
        ...(cfg.contato as Record<string, unknown>),
        casaConselhosEndereco: CASA_ENDERECO,
        casaConselhosTelefone: CASA_TELEFONE,
      },
      baseLegal: {
        ...(cfg.baseLegal as Record<string, unknown>),
        leiCMDCA: LEI_CMDCA,
        leiFMDCA: LEI_FMDCA,
      },
    },
  })
  payload.logger.info('• configuracoes: lei do CMDCA + endereço da Casa aplicados')

  // 2) Remove os pontos placeholder antigos ("CRAS (unidades)" e "CREAS" genérico).
  for (const nome of ['CRAS (unidades)', 'CREAS']) {
    const found = await payload.find({
      collection: 'rede-protecao',
      where: { nome: { equals: nome } },
      limit: 50,
      overrideAccess: true,
    })
    for (const d of found.docs) {
      await payload.delete({ collection: 'rede-protecao', id: d.id, overrideAccess: true })
      payload.logger.info(`• removido placeholder: ${nome}`)
    }
  }

  // 3) Upsert dos pontos reais (idempotente por nome).
  for (const p of PONTOS) {
    const r = await upsertPonto(payload, p)
    payload.logger.info(`• ${p.nome}: ${r}`)
  }

  payload.logger.info('=== Concluído ===')
  process.exit(0)
}

main().catch((err) => {
  console.error('Falha ao aplicar dados confirmados:', err)
  process.exit(1)
})
