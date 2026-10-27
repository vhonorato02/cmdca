import assert from 'node:assert/strict'

// Reproduz a produção: o build usa um banco sem o conteúdo real, e o conteúdo
// publicado depois precisa aparecer já no primeiro acesso ao container, sem esperar
// a janela do ISR. Só roda no PostgreSQL efêmero do runner.
assert.equal(process.env.GITHUB_ACTIONS, 'true', 'CMS fixtures run only in GitHub Actions')
for (const key of ['DATABASE_URI', 'DATABASE_URI_UNPOOLED']) {
  const uri = new URL(process.env[key] || '')
  assert.ok(['localhost', '127.0.0.1'].includes(uri.hostname), 'Only runner PostgreSQL is allowed')
  assert.equal(uri.pathname, '/cmdca_test')
}
process.env.DATABASE_MIGRATION = 'true'
const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })

const text = 'Notícia publicada depois do build, só no banco isolado do CI.'
await payload.create({
  collection: 'noticias',
  overrideAccess: true,
  data: {
    title: 'CI notícia publicada depois do build',
    slug: 'ci-noticia-depois-do-build',
    resumo: text,
    corpo: {
      root: {
        type: 'root',
        version: 1,
        format: '',
        indent: 0,
        direction: null,
        children: [
          {
            type: 'paragraph',
            version: 1,
            format: '',
            indent: 0,
            direction: null,
            children: [
              { type: 'text', version: 1, text, format: 0, detail: 0, mode: 'normal', style: '' },
            ],
          },
        ],
      },
    },
    categoria: 'noticia',
    autor: 'CI fixture author',
    data: new Date().toISOString(),
    _status: 'published',
    controleEditorial: { fonte: 'CI isolated fixture', verificadoEm: new Date().toISOString() },
  },
})
console.log('Notícia publicada depois do build criada no banco isolado.')
process.exit(0)
