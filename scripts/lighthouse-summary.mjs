// Resume relatórios JSON do Lighthouse (várias rodadas por página) em uma tabela
// Markdown com a mediana de cada métrica. Uso: node scripts/lighthouse-summary.mjs <pasta> [mínimo]
// Com [mínimo], sai com código 1 se alguma categoria ficar abaixo dele (SEO ignorado
// enquanto SITE_INDEXABLE não for true).
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const [dir = 'lh', minArg] = process.argv.slice(2)
const min = minArg ? Number(minArg) : undefined
const checkSeo = process.env.SITE_INDEXABLE === 'true'

const byPage = new Map()
for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const report = JSON.parse(readFileSync(join(dir, file), 'utf8'))
  if (!report.categories?.performance) continue
  const page = file.replace(/-\d+\.json$/, '')
  byPage.set(page, [...(byPage.get(page) ?? []), report])
}

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)]
const categories = ['performance', 'accessibility', 'best-practices', 'seo']
const failures = []

console.log('| Página | Perf | A11y | Boas práticas | SEO | LCP | TBT | CLS | CPU (benchmark) |')
console.log('|---|---|---|---|---|---|---|---|---|')
for (const [page, reports] of byPage) {
  const score = (id) => median(reports.map((r) => Math.round(r.categories[id].score * 100)))
  const audit = (id) => median(reports.map((r) => r.audits[id].numericValue))
  const scores = Object.fromEntries(categories.map((id) => [id, score(id)]))
  for (const id of categories) {
    if (min !== undefined && scores[id] < min && (id !== 'seo' || checkSeo)) {
      failures.push(`${page} ${id}=${scores[id]}`)
    }
  }
  console.log(
    `| ${page} | ${scores.performance} | ${scores.accessibility} | ${scores['best-practices']} | ${scores.seo} ` +
      `| ${(audit('largest-contentful-paint') / 1000).toFixed(1)} s | ${Math.round(audit('total-blocking-time'))} ms ` +
      `| ${audit('cumulative-layout-shift').toFixed(3)} | ${Math.round(median(reports.map((r) => r.environment.benchmarkIndex)))} |`,
  )
}

if (byPage.size === 0) failures.push('nenhum relatório válido')
if (!checkSeo) console.log('\nSEO não é cobrado enquanto o domínio é temporário (`noindex`).')
if (failures.length) {
  console.log(`\n**Abaixo de ${min ?? '-'}:** ${failures.join(', ')}`)
  if (min !== undefined) process.exitCode = 1
}
