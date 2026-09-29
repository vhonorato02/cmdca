import { access } from 'node:fs/promises'
import { spawn } from 'node:child_process'

const envFile = new URL('../.vercel/.env.production.local', import.meta.url)

try {
  await access(envFile)
} catch {
  throw new Error('Arquivo de ambiente de producao nao foi criado por vercel pull.')
}

process.loadEnvFile(envFile)

const child = spawn('pnpm', ['migrate'], {
  env: process.env,
  stdio: 'inherit',
})

const exitCode = await new Promise((resolve, reject) => {
  child.once('error', reject)
  child.once('exit', (code, signal) => resolve(code ?? (signal ? 1 : 0)))
})

if (exitCode !== 0) {
  throw new Error(`Migracoes falharam com codigo ${exitCode}.`)
}
