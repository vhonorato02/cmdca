import assert from 'node:assert/strict'
import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHmac, randomUUID } from 'node:crypto'

// API contract: coollabsio/coolify openapi.yaml, applications, envs and deployments.
assert.equal(process.env.GITHUB_ACTIONS, 'true', 'Entrega somente pelo GitHub Actions')
assert.equal(process.env.GITHUB_REPOSITORY, 'vhonorato02/cmdca')
assert.equal(process.env.GITHUB_REF, 'refs/heads/main')
const mode = process.argv[2]
assert.ok(['prepare', 'deploy', 'verify', 'rollback'].includes(mode))
const required = (name) => {
  const value = process.env[name]?.trim()
  assert.ok(value, `Configure ${name} no environment production`)
  return value
}
const base = new URL(required('COOLIFY_URL'))
assert.equal(base.protocol, 'https:', 'Coolify exige HTTPS')
assert.ok(!base.username && !base.password && !base.search && !base.hash)
assert.equal(base.pathname, '/', 'COOLIFY_URL deve ser a origem do painel')
const canonical = new URL(required('CMDCA_PUBLIC_URL'))
assert.equal(canonical.protocol, 'https:')
assert.ok(!canonical.username && !canonical.password && !canonical.search && !canonical.hash)
assert.equal(canonical.pathname, '/')
const appID = required('COOLIFY_APP_UUID')
const serverID = required('COOLIFY_SERVER_UUID')
assert.match(appID, /^[a-zA-Z0-9_-]+$/)
assert.match(serverID, /^[a-zA-Z0-9_-]+$/)
const token = required('COOLIFY_TOKEN')
const sha = required('GITHUB_SHA')
assert.match(sha, /^[a-f0-9]{40}$/)
const image = 'ghcr.io/vhonorato02/cmdca'
const runID = required('GITHUB_RUN_ID')
const attemptID = required('GITHUB_RUN_ATTEMPT')
assert.match(runID, /^\d+$/)
assert.match(attemptID, /^\d+$/)
const imageTag = `${sha}-${runID}-${attemptID}`
const releasePath = 'test-results/release.json'

async function api(route, method = 'GET', body) {
  const response = await fetch(new URL(`/api/v1/${route}`, base), {
    method,
    redirect: 'error',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(30_000),
  })
  // Do not print API bodies: they may contain runtime credentials or logs.
  assert.ok(response.ok, `Coolify ${method} ${route.split('?')[0]}: HTTP ${response.status}`)
  return response.json()
}

async function inspect() {
  const [app, resources, entries] = await Promise.all([
    api(`applications/${appID}`),
    api(`servers/${serverID}/resources`),
    api(`applications/${appID}/envs`),
  ])
  assert.equal(app.uuid, appID)
  assert.ok(/\bcmdca\b/i.test(app.name), 'A aplicacao deve identificar explicitamente CMDCA')
  assert.ok(resources.some((resource) => resource.uuid === appID), 'Aplicacao fora da VPS autorizada')
  assert.equal(app.docker_registry_image_name, image, 'Cadastre uma aplicacao Docker Image para CMDCA')
  assert.ok(String(app.fqdn).split(',').some((url) => new URL(url.trim()).origin === canonical.origin),
    'Dominio canonico nao pertence a esta aplicacao')
  const keys = [
    'DATABASE_URI', 'DATABASE_URI_UNPOOLED', 'PAYLOAD_SECRET', 'NEXT_PUBLIC_SERVER_URL',
    'NEXT_PUBLIC_R2_PUBLIC_URL', 'S3_BUCKET', 'S3_ENDPOINT', 'S3_REGION', 'S3_ACCESS_KEY_ID',
    'S3_SECRET_ACCESS_KEY', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASS',
    'EMAIL_FROM_ADDRESS', 'EMAIL_FROM_NAME', 'ENFORCE_PRODUCTION_ENV',
  ]
  const env = {}
  for (const key of keys) {
    const matches = entries.filter((entry) => entry.key === key && !entry.is_preview)
    assert.ok(matches.length <= 1, `Variavel duplicada: ${key}`)
    if (matches.length) {
      const entry = matches[0]
      assert.notEqual(entry.is_runtime, false, `${key} precisa estar disponivel no runtime`)
      assert.equal(typeof entry.value, 'string', `${key} indisponivel pela API`)
      assert.ok(!entry.value.includes('{{'), `${key}: resolva referencias compartilhadas antes da entrega`)
      env[key] = entry.value
    }
  }
  for (const key of ['DATABASE_URI', 'DATABASE_URI_UNPOOLED', 'PAYLOAD_SECRET', 'NEXT_PUBLIC_R2_PUBLIC_URL',
    'S3_BUCKET', 'S3_ENDPOINT', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY', 'SMTP_HOST', 'EMAIL_FROM_ADDRESS']) {
    assert.ok(env[key]?.trim(), `Variavel obrigatoria ausente no Coolify: ${key}`)
  }
  assert.ok(env.PAYLOAD_SECRET.length >= 32)
  assert.equal(env.ENFORCE_PRODUCTION_ENV, 'true')
  assert.equal(new URL(env.NEXT_PUBLIC_SERVER_URL).origin, canonical.origin)
  assert.equal(new URL(env.NEXT_PUBLIC_R2_PUBLIC_URL).protocol, 'https:')
  assert.equal(new URL(env.S3_ENDPOINT).protocol, 'https:')
  // Keyed digest over every production variable, so any change after the build blocks the
  // release and the stored value cannot be used to guess secrets.
  const allEntries = entries
    .filter((entry) => !entry.is_preview)
    .map((entry) => [entry.key, entry.value])
    .sort(([a], [b]) => String(a).localeCompare(String(b)))
  const fingerprint = createHmac('sha256', token).update(JSON.stringify(allEntries)).digest('hex')
  return { app, env, fingerprint }
}

async function waitForDeployment(deploymentID) {
  for (let attempt = 0; attempt < 90; attempt++) {
    const status = await api(`deployments/${encodeURIComponent(deploymentID)}`)
    if (status.status === 'finished') return
    assert.ok(!/fail|cancel|error/i.test(String(status.status)), `Implantacao ${status.status}`)
    await new Promise((resolve) => setTimeout(resolve, 10_000))
  }
  throw new Error('Tempo excedido aguardando Coolify. Consulte release.json para diagnostico.')
}

async function deployTag(tag) {
  await api(`applications/${appID}`, 'PATCH', { docker_registry_image_tag: tag })
  const result = await api(`deploy?uuid=${encodeURIComponent(appID)}`, 'POST')
  const deployment = result.deployments?.find((entry) => entry.resource_uuid === appID)
  assert.ok(deployment?.deployment_uuid, 'Coolify nao retornou identificador de implantacao')
  return deployment.deployment_uuid
}

const current = await inspect()
if (mode === 'prepare') {
  const backup = required('BACKUP_REFERENCE')
  assert.ok(backup.length >= 12, 'Registre identificador e data de backup real recuperavel')
  assert.ok(process.env.GITHUB_ENV)
  for (const [key, value] of Object.entries(current.env)) {
    // Mask each line before exposing the value to subsequent runner steps.
    for (const line of value.split(/\r?\n/).filter(Boolean)) {
      console.log(`::add-mask::${line.replaceAll('%', '%25').replaceAll('\r', '%0D')}`)
    }
    const delimiter = randomUUID()
    await appendFile(process.env.GITHUB_ENV, `${key}<<${delimiter}\n${value}\n${delimiter}\n`)
  }
  await mkdir('test-results', { recursive: true })
  await writeFile(releasePath, JSON.stringify({
    commit: sha, image, appID, serverID, canonical: canonical.origin,
    imageTag, previousTag: current.app.docker_registry_image_tag, fingerprint: current.fingerprint,
    backupReference: backup, preparedAt: new Date().toISOString(),
  }, null, 2))
  console.log('Destino CMDCA, servidor, dominio e ambiente verificados. Nenhuma alteracao remota.')
} else if (mode === 'rollback') {
  const release = JSON.parse(await readFile(releasePath, 'utf8'))
  assert.equal(release.appID, appID)
  assert.equal(release.imageTag, imageTag)
  if (current.app.docker_registry_image_tag !== imageTag) {
    console.log('A aplicacao nao aponta para a tag desta entrega. Nada a reverter.')
    process.exit(0)
  }
  assert.ok(release.previousTag, 'Primeira entrega sem tag anterior: reverter manualmente no Coolify')
  release.rollbackDeploymentID = await deployTag(release.previousTag)
  await writeFile(releasePath, JSON.stringify(release, null, 2))
  await waitForDeployment(release.rollbackDeploymentID)
  console.log(`Tag anterior ${release.previousTag} restaurada no Coolify.`)
} else {
  const release = JSON.parse(await readFile(releasePath, 'utf8'))
  assert.equal(release.commit, sha)
  assert.equal(release.appID, appID)
  assert.equal(release.serverID, serverID)
  assert.equal(release.imageTag, imageTag)
  assert.equal(release.fingerprint, current.fingerprint, 'Ambiente mudou depois do build')
  if (mode === 'deploy') {
    assert.equal(current.app.docker_registry_image_tag, release.previousTag, 'Outra entrega alterou a imagem')
    release.digest = required('IMAGE_DIGEST')
    assert.match(release.digest, /^sha256:[a-f0-9]{64}$/)
    await writeFile(releasePath, JSON.stringify(release, null, 2))
    release.deploymentID = await deployTag(imageTag)
    await writeFile(releasePath, JSON.stringify(release, null, 2))
    await waitForDeployment(release.deploymentID)
    console.log(`Coolify concluiu a implantacao ${release.deploymentID}`)
    process.exit(0)
  }
  assert.equal(current.app.docker_registry_image_tag, imageTag)
  assert.match(String(current.app.status), /^running(?::healthy)?$/, 'Aplicacao sem saude confirmada')
  console.log('Aplicacao CMDCA em execucao com a tag esperada. Smoke HTTP deve confirmar o commit servido.')
}
