import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { appendFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'

// Refuse operational databases before importing config (which reads .env.local).
assert.equal(process.env.GITHUB_ACTIONS, 'true', 'CMS fixtures run only in GitHub Actions')
for (const key of ['DATABASE_URI', 'DATABASE_URI_UNPOOLED']) {
  const uri = new URL(process.env[key] || '')
  assert.ok(['localhost', '127.0.0.1'].includes(uri.hostname), 'Only runner PostgreSQL is allowed')
  assert.equal(uri.pathname, '/cmdca_test')
}
// A real PDF upload crosses Payload validation and the S3 adapter. Only the
// storage transport is simulated, on loopback, before config can read .env.local.
const uploadedObjects: Buffer[] = []
const storage = createServer(async (request, response) => {
  try {
    if (request.method !== 'PUT') {
      response.writeHead(405).end()
      return
    }
    const chunks: Buffer[] = []
    for await (const chunk of request) chunks.push(Buffer.from(chunk))
    uploadedObjects.push(Buffer.concat(chunks))
    response.writeHead(200, { ETag: '"ci-fixture-object"' }).end()
  } catch {
    response.writeHead(500).end()
  }
})
await new Promise<void>((resolve, reject) => {
  storage.once('error', reject)
  storage.listen(0, '127.0.0.1', resolve)
})
const storageURL = `http://127.0.0.1:${(storage.address() as AddressInfo).port}`
process.env.S3_ENDPOINT = storageURL
process.env.S3_BUCKET = 'cmdca-ci-fixtures'
process.env.S3_ACCESS_KEY_ID = 'ci-isolated-access'
process.env.S3_SECRET_ACCESS_KEY = 'ci-isolated-secret'
process.env.NEXT_PUBLIC_R2_PUBLIC_URL = `${storageURL}/cmdca-ci-fixtures`
// PENDENCIA: download público e persistência R2 real não são cobertos pelo transporte efêmero do CI.
process.env.DATABASE_MIGRATION = 'true'
const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')
const payload = await getPayload({ config })
console.log('CMS initialized against the isolated runner database.')

try {
  const password = randomBytes(24).toString('base64url')
  assert.ok(process.env.GITHUB_ENV, 'Runner environment file is required')
  console.log(`::add-mask::${password}`)
  await appendFile(process.env.GITHUB_ENV, `CMS_TEST_PASSWORD=${password}\n`)
  const admin = await payload.create({
    collection: 'users',
    data: { name: 'CI administrator', email: 'admin@example.test', password, role: 'admin' },
  })
  const editor = await payload.create({
    collection: 'users',
    data: { name: 'CI editor', email: 'editor@example.test', password, role: 'editor' },
  })
  const login = await payload.login({ collection: 'users', data: { email: editor.email, password } })
  console.log('Fixture users created and editor authenticated.')
  assert.ok(login.token, 'Persisted editor can authenticate')
  await assert.rejects(payload.login({
    collection: 'users', data: { email: editor.email, password: 'invalid-password' },
  }))
  const publicOptions = { overrideAccess: false, user: null, depth: 0 } as const
  await assert.rejects(payload.find({ collection: 'users', ...publicOptions }))
  const ownUsers = await payload.find({ collection: 'users', overrideAccess: false, user: editor })
  assert.deepEqual(ownUsers.docs.map((user) => user.id), [editor.id])
  await assert.rejects(payload.update({
    collection: 'users', id: admin.id, data: { name: 'Forbidden change' },
    overrideAccess: false, user: editor,
  }))
  await payload.update({
    collection: 'users', id: editor.id, data: { role: 'admin' },
    overrideAccess: false, user: editor,
  })
  const unchanged = await payload.findByID({ collection: 'users', id: editor.id })
  assert.equal(unchanged.role, 'editor', 'Editor cannot elevate their own role')
  console.log('User isolation and role elevation checks passed.')

  await assert.rejects(payload.forgotPassword({ collection: 'users', data: { email: editor.email } }), /indisponível/)
  const originalEmail = payload.email
  try {
    payload.email = { ...originalEmail, name: 'ci-failing-email', sendEmail: async () => { throw new Error('CI transport failure') } }
    await assert.rejects(payload.forgotPassword({ collection: 'users', data: { email: editor.email } }), /CI transport failure/)
    let recoveryHTML = ''
    payload.email = { ...originalEmail, name: 'ci-captured-email', sendEmail: async (message) => { recoveryHTML = String(message.html); return undefined } }
    const token = await payload.forgotPassword({ collection: 'users', data: { email: editor.email } })
    assert.ok(token && recoveryHTML.includes(`/admin/reset/${token}`), 'Recovery message links to the configured CMS')
    await payload.resetPassword({ collection: 'users', overrideAccess: false, data: { token, password } })
    await assert.rejects(payload.resetPassword({ collection: 'users', overrideAccess: false, data: { token, password } }), 'Recovery token cannot be reused')
  } finally {
    payload.email = originalEmail
  }
  console.log('Password recovery rejects missing/failing transport and consumes a captured token once.')

  await payload.create({
    collection: 'noticias', overrideAccess: false, user: editor,
    data: {
      title: 'CI published institutional news', slug: 'ci-published-institutional-news',
      resumo: 'Controlled published news fixture for browser verification in the isolated runner.',
      corpo: { root: { type: 'root', version: 1, format: '', indent: 0, direction: null,
        children: [{ type: 'paragraph', version: 1, format: '', indent: 0, direction: null,
          children: [{ type: 'text', version: 1, text: 'Confirmed content used only in the isolated CI database.',
            format: 0, detail: 0, mode: 'normal', style: '' }] }] } },
      categoria: 'noticia', autor: 'CI fixture author', data: new Date().toISOString(),
      _status: 'published',
      controleEditorial: { fonte: 'CI isolated fixture', verificadoEm: new Date().toISOString() },
    },
  })
  assert.equal((await payload.find({ collection: 'noticias', overrideAccess: false, user: null,
    where: { slug: { equals: 'ci-published-institutional-news' } } })).totalDocs, 1)

  const draft = await payload.create({
    collection: 'faq', draft: true, overrideAccess: false, user: editor,
    data: {
      pergunta: 'CI fixture question', resposta: 'Controlled fixture visible only in the isolated runner.',
      contexto: 'geral', _status: 'draft',
    },
  })
  assert.equal((await payload.find({ collection: 'faq', ...publicOptions })).totalDocs, 0)
  await assert.rejects(payload.update({
    collection: 'faq', id: draft.id, data: { _status: 'published' },
    overrideAccess: false, user: editor,
  }), 'Publishing without confirmed source must fail')
  await payload.update({
    collection: 'faq', id: draft.id, overrideAccess: false, user: editor,
    data: {
      _status: 'published',
      controleEditorial: { fonte: 'CI isolated fixture', verificadoEm: new Date().toISOString() },
    },
  })
  const published = await payload.find({ collection: 'faq', ...publicOptions })
  assert.equal(published.totalDocs, 1)
  assert.equal(published.docs[0]._status, 'published')
  assert.equal(published.docs[0].controleEditorial, undefined, 'Internal provenance stays private')
  console.log('Draft isolation and validated publication checks passed.')
  await assert.rejects(payload.findVersions({ collection: 'faq', ...publicOptions }))
  const versions = await payload.findVersions({ collection: 'faq', overrideAccess: false, user: editor })
  assert.ok(versions.totalDocs > 0, 'Known editor can read history')
  await assert.rejects(payload.delete({
    collection: 'faq', id: draft.id, overrideAccess: false, user: editor,
  }))
  // Selecting media exercises the new object key column, without contacting R2.
  assert.equal((await payload.find({ collection: 'media', ...publicOptions })).totalDocs, 0)
  // Valid one-page PDF with xref offsets, rather than a fabricated media record.
  const pdfObjects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 200] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
  const stream = 'BT /F1 12 Tf 20 100 Td (CI isolated public document) Tj ET\n'
  pdfObjects.push(`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}endstream`)
  let pdfText = '%PDF-1.4\n'
  const offsets = [0]
  for (const [index, object] of pdfObjects.entries()) {
    offsets.push(Buffer.byteLength(pdfText))
    pdfText += `${index + 1} 0 obj\n${object}\nendobj\n`
  }
  const xrefOffset = Buffer.byteLength(pdfText)
  pdfText += `xref\n0 ${offsets.length}\n0000000000 65535 f \n`
  pdfText += offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')
  pdfText += `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`
  const pdfBytes = Buffer.from(pdfText)
  const provenance = { fonte: 'CI isolated public document', verificadoEm: new Date().toISOString() }
  const pdf = await payload.create({
    collection: 'media', overrideAccess: false, user: editor,
    file: { data: pdfBytes, name: 'ci-public-document.pdf', mimetype: 'application/pdf', size: pdfBytes.length },
    data: { alt: 'CI public document', _status: 'published', controleEditorial: provenance },
  })
  assert.equal(pdf.mimeType, 'application/pdf')
  assert.ok(uploadedObjects.some((object) => object.includes(Buffer.from('%PDF-1.4'))), 'S3 transport received the validated PDF bytes')
  const entity = await payload.create({
    collection: 'entidades', overrideAccess: false, user: editor,
    data: { nome: 'CI suspended organization', area: 'assistencia', registro: 'CI-ENTITY-001',
      validade: '2030-01-01T00:00:00.000Z', situacaoRegistro: 'suspenso', documentos: [pdf.id],
      _status: 'published', controleEditorial: provenance },
  })
  const resolution = await payload.create({
    collection: 'resolucoes', overrideAccess: false, user: editor,
    data: { numero: 'CI-RES-001', titulo: 'CI revoked resolution', data: new Date().toISOString(),
      situacaoJuridica: 'revogada', arquivo: pdf.id, _status: 'published', controleEditorial: provenance },
  })
  const notice = await payload.create({
    collection: 'editais', overrideAccess: false, user: editor,
    data: { numero: 'CI-NOTICE-001', titulo: 'CI suspended public notice', tipo: 'chamamento',
      data: new Date().toISOString(), situacaoJuridica: 'suspenso', arquivo: pdf.id,
      _status: 'published', controleEditorial: provenance },
  })
  assert.equal((await payload.findByID({ collection: 'entidades', id: entity.id, ...publicOptions })).situacaoRegistro, 'suspenso')
  assert.equal((await payload.findByID({ collection: 'resolucoes', id: resolution.id, ...publicOptions })).situacaoJuridica, 'revogada')
  assert.equal((await payload.findByID({ collection: 'editais', id: notice.id, ...publicOptions })).situacaoJuridica, 'suspenso')
  console.log('Published status fixtures passed with a validated PDF through isolated S3 transport.')
  for (const acesso of ['publica', 'reservada'] as const) {
    await payload.create({
      collection: 'reunioes', overrideAccess: false, user: editor,
      data: {
        titulo: acesso === 'publica' ? 'CI public meeting' : 'CI reserved meeting',
        data: '2026-09-29T00:00:00.000Z', hora: '14:30', tipo: 'ordinaria',
        acesso, modalidade: 'online', linkTransmissao: 'https://example.test/meeting',
        _status: 'published',
        controleEditorial: { fonte: 'CI isolated fixture', verificadoEm: new Date().toISOString() },
      },
    })
  }
  const meetings = await payload.find({ collection: 'reunioes', ...publicOptions })
  assert.equal(meetings.totalDocs, 1, 'Reserved published meetings remain private')
  assert.equal(meetings.docs[0].acesso, 'publica')
  console.log('Reserved meeting isolation passed.')
  await assert.rejects(payload.create({
    collection: 'reunioes', draft: true, overrideAccess: false, user: editor,
    data: { acesso: 'reservada', ata: 999999, _status: 'draft' },
  }), /biblioteca pública/)
  const testimony = await payload.create({
    collection: 'depoimentos', overrideAccess: false, user: admin,
    data: { autor: 'CI consented author', frase: 'Controlled testimony in the isolated runner.',
      origem: 'CI original consent', autorizacaoPublicacao: true, _status: 'published',
      controleEditorial: { fonte: 'CI consent fixture', verificadoEm: new Date().toISOString() } },
  })
  await assert.rejects(payload.update({ collection: 'depoimentos', id: testimony.id,
    overrideAccess: false, user: editor, data: { frase: 'Changed testimony without a new authorization.' },
  }), /autorização/)
  await payload.update({ collection: 'depoimentos', id: testimony.id,
    overrideAccess: false, user: admin, data: { frase: 'Changed testimony with a new authorization.',
      origem: 'CI renewed consent', autorizacaoPublicacao: true },
  })
  console.log('CMS integration passed: migrations, authentication, roles, drafts, publication, history and media schema.')
} finally {
  console.log('CMS cleanup:', {
    connections: payload.db.pool.totalCount,
    idleConnections: payload.db.pool.idleCount,
    waitingConnections: payload.db.pool.waitingCount,
    activeTransactions: Object.keys(payload.db.sessions ?? {}).length,
  })
  try {
    await payload.destroy()
  } finally {
    await new Promise<void>((resolve, reject) => storage.close((error) => error ? reject(error) : resolve()))
  }
}
// Payload and its plugins are designed for a long-lived server. Exit only after
// all assertions and adapter cleanup succeed, as the Payload CLI itself does.
process.exit(0)
