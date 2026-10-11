import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { createServer } from 'node:http'

// Explicit S3 transport simulation, not evidence of R2 persistence or IAM.
// It stays alive through the CMS and browser suites, only on the isolated runner.
assert.equal(process.env.GITHUB_ACTIONS, 'true')
for (const name of ['DATABASE_URI', 'DATABASE_URI_UNPOOLED']) {
  const uri = new URL(process.env[name] || '')
  assert.ok(['localhost', '127.0.0.1'].includes(uri.hostname))
  assert.equal(uri.pathname, '/cmdca_test')
}
const objects = new Map()
const server = createServer(async (request, response) => {
  const key = new URL(request.url, 'http://localhost').pathname
  if (key === '/health') {
    response.writeHead(200).end('ready')
    return
  }
  if (!key.startsWith('/cmdca-quality/')) {
    response.writeHead(403).end()
    return
  }
  try {
    if (request.method === 'PUT') {
      const chunks = []
      let size = 0
      for await (const chunk of request) {
        size += chunk.length
        if (size > 21 * 1024 * 1024) {
          response.writeHead(413).end()
          return
        }
        chunks.push(chunk)
      }
      const body = Buffer.concat(chunks)
      const etag = `"${createHash('md5').update(body).digest('hex')}"`
      objects.set(key, { body, etag, type: request.headers['content-type'] || 'application/octet-stream' })
      response.writeHead(200, { ETag: etag }).end()
      return
    }
    if (request.method === 'DELETE') {
      objects.delete(key)
      response.writeHead(204).end()
      return
    }
    const object = objects.get(key)
    if (!object) {
      response.writeHead(404, { 'Content-Type': 'application/xml' })
        .end('<Error><Code>NoSuchKey</Code></Error>')
      return
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405).end()
      return
    }
    const headers = {
      'Content-Type': object.type,
      'Content-Length': object.body.length,
      ETag: object.etag,
      'Last-Modified': new Date(0).toUTCString(),
      'Accept-Ranges': 'bytes',
    }
    const range = request.headers.range?.match(/^bytes=(\d+)-(\d*)$/)
    if (range) {
      const start = Number(range[1])
      const end = Math.min(Number(range[2] || object.body.length - 1), object.body.length - 1)
      if (start > end) {
        response.writeHead(416, { 'Content-Range': `bytes */${object.body.length}` }).end()
        return
      }
      response.writeHead(206, {
        ...headers,
        'Content-Length': end - start + 1,
        'Content-Range': `bytes ${start}-${end}/${object.body.length}`,
      }).end(request.method === 'HEAD' ? undefined : object.body.subarray(start, end + 1))
      return
    }
    response.writeHead(200, headers).end(request.method === 'HEAD' ? undefined : object.body)
  } catch {
    response.writeHead(500).end()
  }
})
server.listen(4569, '127.0.0.1', () => console.log('Isolated S3 transport fixture ready on loopback:4569'))
