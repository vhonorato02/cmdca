import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'

// Refuse operational databases before importing config (which reads .env.local).
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
console.log('CMS initialized against the isolated runner database.')

try {
  const password = randomBytes(24).toString('base64url')
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

  const draft = await payload.create({
    collection: 'faq', draft: true, overrideAccess: false, user: editor,
    data: {
      pergunta: 'CI draft question', resposta: 'Controlled fixture visible only in the isolated runner.',
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
  console.log('CMS integration passed: migrations, authentication, roles, drafts, publication, history and media schema.')
} finally {
  await payload.db.pool.end()
  await payload.destroy()
}
// Payload and its plugins are designed for a long-lived server. Exit only after
// all assertions and database cleanup succeed, as the Payload CLI itself does.
process.exit(0)
