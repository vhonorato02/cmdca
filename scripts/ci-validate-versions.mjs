import { readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url)))
const expectedNodeMajor = 24
const expectedPnpmVersion = '11.15.0'

if (Number(process.versions.node.split('.')[0]) !== expectedNodeMajor) {
  throw new Error(`Node ${expectedNodeMajor} e obrigatorio; recebido ${process.versions.node}.`)
}

if (packageJson.packageManager !== `pnpm@${expectedPnpmVersion}`) {
  throw new Error(`packageManager deve ser pnpm@${expectedPnpmVersion}.`)
}

if (packageJson.engines?.node !== '>=24 <25' || packageJson.engines?.pnpm !== '>=11 <12') {
  throw new Error('As faixas de engines do package.json nao correspondem ao pipeline.')
}

const pnpmCommand = process.platform === 'win32' ? process.env.ComSpec ?? 'cmd.exe' : 'pnpm'
const pnpmArgs = process.platform === 'win32' ? ['/d', '/s', '/c', 'pnpm --version'] : ['--version']
const pnpm = spawnSync(pnpmCommand, pnpmArgs, {
  encoding: 'utf8',
})

if (pnpm.status !== 0) {
  const detail = pnpm.error?.message ?? pnpm.stderr?.trim() ?? 'erro sem detalhes'
  throw new Error(`Nao foi possivel consultar a versao do pnpm: ${detail}`)
}

if (pnpm.stdout.trim() !== expectedPnpmVersion) {
  throw new Error(`pnpm ${expectedPnpmVersion} e obrigatorio; recebido ${pnpm.stdout.trim()}.`)
}

console.log(`Versoes validadas: Node ${process.versions.node}, pnpm ${expectedPnpmVersion}.`)
