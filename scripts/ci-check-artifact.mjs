import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

assert.equal(process.env.GITHUB_ACTIONS, 'true', 'Verificacao do artefato somente no Actions')
const secrets = ['DATABASE_URI', 'DATABASE_URI_UNPOOLED', 'PAYLOAD_SECRET', 'S3_SECRET_ACCESS_KEY',
  'S3_ACCESS_KEY_ID', 'SMTP_PASS', 'COOLIFY_TOKEN']
  .map((name) => ({ name, value: process.env[name] }))
  .filter(({ value }) => value && value.length >= 8)
let checked = 0
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    assert.ok(!/^\.env(?:\.|$)/.test(entry.name), `Arquivo de ambiente no artefato: ${file}`)
    if (entry.isSymbolicLink()) continue
    if (entry.isDirectory()) await walk(file)
    else if (entry.isFile()) {
      const bytes = await readFile(file)
      for (const { name, value } of secrets) {
        assert.ok(!bytes.includes(Buffer.from(value)), `Valor de ${name} incorporado no artefato: ${file}`)
      }
      checked++
    }
  }
}
await walk('.next/standalone')
await walk('.next/static')
await walk('public')
console.log(`${checked} arquivos do artefato verificados, sem valores de segredos ou arquivos .env.`)
