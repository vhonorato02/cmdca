import assert from 'node:assert/strict'

const url = process.env.SMOKE_BASE_URL || 'https://cmdca.vercel.app/'
const attempts = 12
const delayMs = 5_000

for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    for (const route of ['/', '/noticias', '/reunioes', '/admin/login']) {
      const response = await fetch(new URL(route, url), { signal: AbortSignal.timeout(15_000) })
      assert.equal(response.status, 200, `${route}: HTTP ${response.status}`)
      const html = await response.text()
      assert.match(html, /<title>[^<]+<\/title>/i, `${route}: titulo ausente`)
      assert.doesNotMatch(html, /Application error:|Internal Server Error/i)
      if (route === '/admin/login') {
        assert.match(html, /type="password"/i, 'Formulario de login ausente')
        assert.match(html, /name="email"/i, 'Campo de e-mail ausente')
      } else {
        assert.match(html, /<main[\s>]/i, `${route}: conteudo principal ausente`)
      }
    }
    for (const collection of ['media', 'noticias', 'reunioes']) {
      const response = await fetch(new URL(`/api/${collection}?limit=1&depth=0`, url), {
        signal: AbortSignal.timeout(15_000),
      })
      assert.equal(response.status, 200, `${collection}: HTTP ${response.status}`)
      const data = await response.json()
      assert.ok(Array.isArray(data.docs), `${collection}: resposta invalida`)
      assert.ok(data.docs.every((doc) => doc._status === 'published'), `${collection}: rascunho exposto`)
    }
    const users = await fetch(new URL('/api/users', url), { signal: AbortSignal.timeout(15_000) })
    assert.ok([401, 403].includes(users.status), 'Usuarios expostos anonimamente')
    console.log(`Smoke aprovado: paginas, formulario CMS e APIs em ${url}.`)
    process.exit(0)
  } catch (error) {
    console.warn(`Tentativa ${attempt}/${attempts}: ${error.message}`)
  }

  if (attempt < attempts) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
}

throw new Error(`Smoke de producao falhou para ${url} apos ${attempts} tentativas.`)
