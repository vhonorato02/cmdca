import fs from 'node:fs/promises'
const base = process.env.AUDIT_BASE_URL || 'http://localhost:3000'
const paths = ['/api/users?limit=1','/api/noticias?limit=100&depth=1','/api/reunioes?limit=100&depth=1','/api/media?limit=100&depth=0','/api/globals/configuracoes','/api/globals/indicadores','/api/globals/pagina-inicial']
const reports = []
for (const path of paths) {
  const response = await fetch(base + path, { signal: AbortSignal.timeout(180000) })
  const body = await response.json().catch(() => ({}))
  const docs = body.docs || [body]
  const internal = JSON.stringify(body).match(/"(?:controleEditorial|referenciaConsentimento|observacoesInternas|password|hash|salt)"/g) || []
  const report = { path, status: response.status, count: body.totalDocs, statuses: [...new Set(docs.map(d=>d._status).filter(Boolean))], reserved: docs.filter(d=>d.acesso==='reservada').length, internalFields: [...new Set(internal)], hasErrors: Boolean(body.errors), keys: Object.keys(body).filter(k=>k!=='docs') }
  reports.push(report)
  console.log(JSON.stringify(report))
}
await fs.writeFile('test-results/public-api.json', JSON.stringify(reports,null,2))
