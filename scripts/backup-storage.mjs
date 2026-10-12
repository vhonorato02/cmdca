import assert from 'node:assert/strict'
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'
import { createRequire } from 'node:module'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import { parse } from 'dotenv'

assert.ok(process.argv.includes('--confirm-readonly-backup'), 'Explicit confirmation is required')
assert.equal(process.platform, 'win32', 'This helper secures its output with Windows ACLs')
const directory = path.join(os.homedir(), '.cmdca-backups', new Date().toISOString().replace(/[:.]/g, '-'))
await mkdir(directory, { recursive: true })
const account = `${process.env.USERDOMAIN}\\${process.env.USERNAME}`
const acl = spawnSync('icacls', [directory, '/inheritance:r', '/grant:r', `${account}:(OI)(CI)F`], { encoding: 'utf8' })
assert.equal(acl.status, 0, 'Private backup ACL could not be applied')

const env = parse(await readFile('.env.local'))
const require = createRequire(import.meta.url)
const storageRequire = createRequire(require.resolve('@payloadcms/storage-s3'))
const { S3Client, ListObjectsV2Command, GetObjectCommand } = storageRequire('@aws-sdk/client-s3')
const client = new S3Client({
  endpoint: env.S3_ENDPOINT, region: env.S3_REGION || 'auto', forcePathStyle: true,
  credentials: { accessKeyId: env.S3_ACCESS_KEY_ID, secretAccessKey: env.S3_SECRET_ACCESS_KEY },
})
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex')
try {
  const listing = await client.send(new ListObjectsV2Command({ Bucket: env.S3_BUCKET, MaxKeys: 1000 }))
  assert.ok(!listing.IsTruncated, 'Use a streaming backup for buckets with more than 1000 objects')
  assert.ok(listing.Contents?.length, 'Refuse an empty backup')
  assert.ok(listing.Contents.reduce((sum, object) => sum + (object.Size || 0), 0) <= 100 * 1024 * 1024,
    'Use a streaming backup above 100 MiB')
  const objects = []
  for (const item of listing.Contents) {
    const object = await client.send(new GetObjectCommand({
      Bucket: env.S3_BUCKET, Key: item.Key, IfMatch: item.ETag,
    }))
    const bytes = Buffer.from(await object.Body.transformToByteArray())
    assert.equal(bytes.length, item.Size)
    objects.push({ key: item.Key, sha256: sha256(bytes), body: bytes.toString('base64') })
  }
  const key = randomBytes(32)
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(JSON.stringify({ version: 1, objects }))), cipher.final(),
  ])
  const archive = Buffer.concat([iv, cipher.getAuthTag(), encrypted])
  await writeFile(path.join(directory, 'recovery.key'), key, { flag: 'wx' })
  await writeFile(path.join(directory, 'uploads.aes'), archive, { flag: 'wx' })

  // Restore from disk, not from the in-memory source, and compare every object's digest.
  const persisted = await readFile(path.join(directory, 'uploads.aes'))
  const decipher = createDecipheriv('aes-256-gcm',
    await readFile(path.join(directory, 'recovery.key')), persisted.subarray(0, 12))
  decipher.setAuthTag(persisted.subarray(12, 28))
  const restored = JSON.parse(Buffer.concat([decipher.update(persisted.subarray(28)), decipher.final()]).toString())
  await mkdir(path.join(directory, 'restored'))
  for (const object of restored.objects) {
    const bytes = Buffer.from(object.body, 'base64')
    assert.equal(sha256(bytes), object.sha256)
    await writeFile(path.join(directory, 'restored', `${sha256(object.key)}.bin`), bytes, { flag: 'wx' })
  }
  assert.equal(restored.objects.length, objects.length)
  console.log(JSON.stringify({
    directory, objects: objects.length, archiveSHA256: sha256(archive),
    restoredAndVerified: true, cloudOperations: ['LIST', 'GET'],
    warning: 'Recovery key is local to this protected folder; no scheduled offsite copy configured.',
  }, null, 2))
} catch (error) {
  console.error(`Storage backup failed: ${error.name}. No cloud mutation was requested.`)
  process.exitCode = 1
} finally {
  client.destroy()
}
