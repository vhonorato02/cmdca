import { createHash, randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const reportPath = resolve(projectRoot, 'test-results', 'storage-verification.json')
const startedAt = new Date().toISOString()
const requiredVariables = [
  'S3_BUCKET',
  'S3_ENDPOINT',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
]
const report = {
  startedAt,
  completedAt: null,
  operation: 'R2 S3-compatible controlled object verification',
  environment: {
    requiredVariables: Object.fromEntries(requiredVariables.map((name) => [name, false])),
    s3RegionPresent: false,
  },
  object: {
    key: null,
    byteLength: null,
    sha256: null,
  },
  cleanup: {
    status: 'not-required',
    note: null,
  },
  steps: {
    put: 'not-run',
    getAndCompare: 'not-run',
    delete: 'not-run',
    confirmAbsent: 'not-run',
  },
  result: 'not-run',
  failure: null,
}

function safeFailure(error) {
  return {
    name: error instanceof Error ? error.name : 'UnknownError',
    code: typeof error === 'object' && error !== null && 'Code' in error ? String(error.Code) : null,
  }
}

function isNotFound(error) {
  return error?.$metadata?.httpStatusCode === 404 || error?.name === 'NotFound'
}

function isPreconditionFailure(error) {
  return error?.$metadata?.httpStatusCode === 412 || error?.name === 'PreconditionFailed'
}

async function writeReport({ completed = false } = {}) {
  if (completed) report.completedAt = new Date().toISOString()
  await mkdir(dirname(reportPath), { recursive: true })
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}

let client

try {
  dotenv.config({ path: resolve(projectRoot, '.env.local'), quiet: true })
  for (const name of requiredVariables) {
    report.environment.requiredVariables[name] = Boolean(process.env[name]?.trim())
  }
  report.environment.s3RegionPresent = Boolean(process.env.S3_REGION?.trim())

  const missing = requiredVariables.filter((name) => !report.environment.requiredVariables[name])
  if (missing.length > 0) {
    throw new Error('RequiredStorageVariablesMissing')
  }

  const require = createRequire(import.meta.url)
  const storageRequire = createRequire(require.resolve('@payloadcms/storage-s3'))
  const { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } =
    storageRequire('@aws-sdk/client-s3')
  const { NodeHttpHandler } = storageRequire('@smithy/node-http-handler')

  const verificationId = randomUUID()
  const body = Buffer.from(`cmdca-r2-verification:${verificationId}\n`, 'utf8')
  report.object.key = `codex-verification/${verificationId}.txt`
  report.object.byteLength = body.byteLength
  report.object.sha256 = createHash('sha256').update(body).digest('hex')
  report.cleanup = {
    status: 'required',
    note: 'The key was recorded before PUT. Remove only this key if the process is interrupted.',
  }
  await writeReport()

  client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION || 'auto',
    maxAttempts: 2,
    requestHandler: new NodeHttpHandler({ connectionTimeout: 10_000, socketTimeout: 10_000 }),
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  })

  let putAttempted = false
  let objectCreated = false
  try {
    putAttempted = true
    try {
      await client.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: report.object.key,
          Body: body,
          IfNoneMatch: '*',
        }),
      )
      objectCreated = true
      report.steps.put = 'passed'
    } catch (putError) {
      report.steps.put = 'failed'
      if (isPreconditionFailure(putError)) {
        report.cleanup = {
          status: 'not-required',
          note: 'PUT did not create an object because the key already existed.',
        }
        throw putError
      }

      try {
        const ambiguousGetResponse = await client.send(
          new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: report.object.key }),
        )
        const ambiguousReceived = Buffer.from(await ambiguousGetResponse.Body.transformToByteArray())
        const ambiguousHash = createHash('sha256').update(ambiguousReceived).digest('hex')
        if (ambiguousReceived.equals(body) && ambiguousHash === report.object.sha256) {
          objectCreated = true
          report.cleanup = {
            status: 'required',
            note: 'PUT outcome was ambiguous, but GET confirmed the unique verification body.',
          }
        } else {
          report.cleanup = {
            status: 'not-required',
            note: 'A different object exists at the verification key. It was not modified or deleted.',
          }
        }
      } catch (getAfterPutError) {
        if (isNotFound(getAfterPutError)) {
          report.cleanup = {
            status: 'required',
            note: 'PUT outcome was ambiguous and GET did not confirm the object. Review only this recorded key before cleanup.',
          }
        } else {
          report.cleanup = {
            status: 'required',
            note: 'PUT outcome was ambiguous and GET could not confirm the object. Review only this recorded key before cleanup.',
          }
        }
      }
      throw putError
    }

    const getResponse = await client.send(
      new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: report.object.key }),
    )
    const received = Buffer.from(await getResponse.Body.transformToByteArray())
    const receivedHash = createHash('sha256').update(received).digest('hex')
    if (!received.equals(body) || receivedHash !== report.object.sha256) {
      throw new Error('ReadBackMismatch')
    }
    report.steps.getAndCompare = 'passed'
  } finally {
    if (objectCreated) {
      try {
        await client.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key: report.object.key }))
        report.steps.delete = 'passed'
        try {
          await client.send(new HeadObjectCommand({ Bucket: process.env.S3_BUCKET, Key: report.object.key }))
          throw new Error('ObjectStillPresentAfterDelete')
        } catch (error) {
          if (error instanceof Error && error.message === 'ObjectStillPresentAfterDelete') throw error
          if (!isNotFound(error)) throw error
          report.steps.confirmAbsent = 'passed'
          report.cleanup = { status: 'completed', note: null }
        }
      } catch (cleanupError) {
        report.steps.delete = report.steps.delete === 'passed' ? report.steps.delete : 'failed'
        report.steps.confirmAbsent = 'failed'
        throw cleanupError
      }
    }
  }

  report.result = 'passed'
} catch (error) {
  report.result = 'failed'
  report.failure = safeFailure(error)
  process.exitCode = 1
} finally {
  client?.destroy()
  await writeReport({ completed: true })
}
