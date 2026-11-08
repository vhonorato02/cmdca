import { createHash } from 'node:crypto'

import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { lexical } from '../content/lexical'
import { PAGINAS_PADRAO } from '../content/paginas'

// Só conteúdo (blindagem jurídica, 08/11/2026; ver docs/juridico/):
// 1. cria as páginas "Acesso à informação" (LAI) e "Publicação e uso de imagem" (ECA),
//    se ainda não existirem (inclusive na lixeira);
// 2. reescreve Privacidade, Termos e Acessibilidade só se o texto no banco ainda for
//    exatamente o semeado em 26/10 (comparação pelo hash do texto, não por marcador);
// 3. preenche o encarregado de dados do Município, publicado pela Prefeitura (LGPD,
//    art. 41, § 1º), só onde ainda está o marcador de pendência;
// 4. acrescenta a pesquisa e as duas páginas ao rodapé só se o menu "Sobre o site" ainda for o padrão.

const NOVAS = ['acesso-a-informacao', 'uso-de-imagem']
const ORIGINAIS: Record<string, string> = {
  privacidade: '658b224a1605783809a981eefc2648a56e167b9dc378e05d488369006570d64a',
  termos: '3a23b734b4fcde782468de57e3fbe7ee66522afd248b51748ee4555e200b5ab9',
  acessibilidade: 'e08834b2cecd12ba2c830e5a624a43be6e2fc48073f1924ec9580da69069fc81',
}
const FONTE = 'Texto institucional do portal do CMDCA (versão de 08/11/2026, revisão jurídica do portal)'

const MUNICIPIO_LGPD =
  'https://pindamonhangaba.sp.gov.br/lei-geral-de-protecao-de-dados-lei-federal-n-137092018'
const ENCARREGADO = 'Lucilio Mendes Raposo, encarregado de dados do Município de Pindamonhangaba'

const RODAPE_ANTES = ['/mapa-do-site', '/acessibilidade', '/privacidade', '/termos', '/creditos']
const RODAPE_DEPOIS = [
  { label: 'Pesquisar no portal', href: '/pesquisa' },
  { label: 'Mapa do site', href: '/mapa-do-site' },
  { label: 'Acesso à informação', href: '/acesso-a-informacao' },
  { label: 'Acessibilidade', href: '/acessibilidade' },
  { label: 'Privacidade (LGPD)', href: '/privacidade' },
  { label: 'Termos de uso', href: '/termos' },
  { label: 'Uso de imagem', href: '/uso-de-imagem' },
  { label: 'Créditos de imagens', href: '/creditos' },
]

function texto(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const o = node as Record<string, unknown>
  const own = typeof o.text === 'string' ? o.text : ''
  const kids = Array.isArray(o.children) ? o.children.map(texto).join('') : ''
  const root = o.root ? texto(o.root) : ''
  const fim = o.type === 'paragraph' || o.type === 'heading' || o.type === 'listitem' ? '\n' : ''
  return own + kids + root + fim
}

const hash = (corpo: unknown) => createHash('sha256').update(texto(corpo)).digest('hex')

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const pagina of PAGINAS_PADRAO) {
    const novo = NOVAS.includes(pagina.slug)
    if (!novo && !ORIGINAIS[pagina.slug]) continue
    const existing = await payload.find({
      collection: 'paginas',
      where: { slug: { equals: pagina.slug } },
      limit: 1,
      depth: 0,
      req,
      trash: true,
    })
    const doc = existing.docs[0]
    const data = {
      titulo: pagina.titulo,
      slug: pagina.slug,
      resumo: pagina.resumo,
      atualizadoEm: pagina.atualizadoEm,
      contato: pagina.contato,
      corpo: lexical(pagina.blocos),
      controleEditorial: { fonte: FONTE, verificadoEm: pagina.atualizadoEm },
      _status: 'published' as const,
    }
    if (novo) {
      if (!doc) await payload.create({ collection: 'paginas', data, req })
      continue
    }
    if (!doc || doc.deletedAt || hash(doc.corpo) !== ORIGINAIS[pagina.slug]) continue
    await payload.update({ collection: 'paginas', id: doc.id, data, req })
  }

  const config = (await payload.findGlobal({ slug: 'configuracoes', depth: 0, req })) as unknown as Record<
    string,
    unknown
  >
  const lgpd = (config.lgpd ?? {}) as Record<string, unknown>
  if (lgpd.encarregado === 'XXXX') {
    const { id: _id, createdAt: _c, updatedAt: _u, globalType: _g, ...rest } = config
    await payload.updateGlobal({
      slug: 'configuracoes',
      data: {
        ...rest,
        lgpd: {
          ...lgpd,
          encarregado: ENCARREGADO,
          encarregadoContato:
            lgpd.encarregadoContato === 'XXXX' ? MUNICIPIO_LGPD : lgpd.encarregadoContato,
        },
        _status: 'published',
      } as never,
      depth: 0,
      req,
    })
  }

  const nav = (await payload.findGlobal({ slug: 'navegacao', depth: 0, req })) as unknown as Record<
    string,
    unknown
  >
  const rodape = Array.isArray(nav.rodapeSobreSite) ? (nav.rodapeSobreSite as { href?: string }[]) : []
  if (nav._status === 'published' && JSON.stringify(rodape.map((l) => l.href)) === JSON.stringify(RODAPE_ANTES)) {
    const { id: _id, createdAt: _c, updatedAt: _u, globalType: _g, ...rest } = nav
    await payload.updateGlobal({
      slug: 'navegacao',
      data: { ...rest, rodapeSobreSite: RODAPE_DEPOIS, _status: 'published' } as never,
      depth: 0,
      req,
    })
  }
}

// Sem volta automática: os textos anteriores continuam no histórico de versões.
export async function down(_args: MigrateDownArgs): Promise<void> {}
