import { chromium } from '@playwright/test'
import fs from 'node:fs/promises'
import path from 'node:path'

const NAVIGATION_TIMEOUT_MS = 60_000
const READY_TIMEOUT_MS = 20_000
const OUTPUT_DIRECTORY = path.resolve('test-results/admin-audit')
const REPORT_PATH = path.join(OUTPUT_DIRECTORY, 'report.json')
const VIEWPORTS = [1440, 1024, 768, 390]
const AUTHENTICATED_ROUTES = [
  '/admin',
  '/admin/collections/noticias',
  '/admin/collections/noticias/create',
]
const EDITOR_EMAIL = 'editor@example.test'

function requireIsolatedCIEnvironment() {
  if (process.env.GITHUB_ACTIONS !== 'true') {
    throw new Error('Admin audit refused: GITHUB_ACTIONS must be exactly "true".')
  }

  for (const key of ['DATABASE_URI', 'DATABASE_URI_UNPOOLED']) {
    let databaseURL
    try {
      databaseURL = new URL(process.env[key] || '')
    } catch {
      throw new Error(`Admin audit refused: ${key} must be a valid PostgreSQL URL.`)
    }

    if (!['postgres:', 'postgresql:'].includes(databaseURL.protocol)) {
      throw new Error(`Admin audit refused: ${key} must use PostgreSQL.`)
    }
    if (!['localhost', '127.0.0.1'].includes(databaseURL.hostname)) {
      throw new Error(`Admin audit refused: ${key} must point to localhost.`)
    }
    if (databaseURL.pathname !== '/cmdca_test') {
      throw new Error(`Admin audit refused: ${key} must use the cmdca_test database.`)
    }
  }

  let baseURL
  try {
    baseURL = new URL(process.env.SMOKE_BASE_URL || '')
  } catch {
    throw new Error('Admin audit refused: SMOKE_BASE_URL must be a valid URL.')
  }
  if (
    baseURL.protocol !== 'http:' ||
    baseURL.hostname !== 'localhost' ||
    baseURL.port !== '3000' ||
    !['', '/'].includes(baseURL.pathname) ||
    baseURL.search ||
    baseURL.hash
  ) {
    throw new Error('Admin audit refused: SMOKE_BASE_URL must be http://localhost:3000.')
  }

  const password = process.env.CMS_TEST_PASSWORD
  if (!password) {
    throw new Error('Admin audit refused: CMS_TEST_PASSWORD is required.')
  }

  return { baseURL: baseURL.origin, password }
}

function sanitizeText(value, password) {
  let sanitized = String(value || '')
  if (password) sanitized = sanitized.replaceAll(password, '[REDACTED]')
  return sanitized
    .replace(/(authorization|cookie|set-cookie)(\s*[:=]\s*)[^\s,;]+/gi, '$1$2[REDACTED]')
    .replace(/bearer\s+[a-z0-9._~+\/-]+=*/gi, 'Bearer [REDACTED]')
    .replace(/\beyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\b/g, '[REDACTED_TOKEN]')
    .slice(0, 2_000)
}

function normalizePathname(value) {
  const pathname = new URL(value).pathname
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
}

function screenshotName(route, width) {
  const routeName = route.replace(/^\//, '').replaceAll('/', '-') || 'root'
  return `${routeName}-${width}.png`
}

function attachErrorCollection(page, password) {
  const errors = []
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push({
        source: 'console',
        message: sanitizeText(message.text(), password),
      })
    }
  })
  page.on('pageerror', (error) => {
    errors.push({
      source: 'pageerror',
      message: sanitizeText(error.message, password),
    })
  })
  return errors
}

async function collectPageMetrics(page) {
  return page.evaluate(() => {
    const isVisible = (element) => {
      const rect = element.getBoundingClientRect()
      const style = getComputedStyle(element)
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0'
      )
    }
    const describeElement = (element) => {
      const id = element.id ? `#${element.id}` : ''
      const classes = [...element.classList].slice(0, 3).map((name) => `.${name}`).join('')
      return `${element.tagName.toLowerCase()}${id}${classes}`
    }
    const selectorFor = (element) => {
      if (element.id) return `#${CSS.escape(element.id)}`
      const parts = []
      let current = element
      while (current && current !== document.body && parts.length < 5) {
        let part = current.tagName.toLowerCase()
        const classes = [...current.classList].slice(0, 2)
        if (classes.length > 0) part += classes.map((name) => `.${CSS.escape(name)}`).join('')
        const siblings = current.parentElement
          ? [...current.parentElement.children].filter((child) => child.tagName === current.tagName)
          : []
        if (siblings.length > 1) part += `:nth-of-type(${siblings.indexOf(current) + 1})`
        parts.unshift(part)
        current = current.parentElement
      }
      return parts.join(' > ')
    }
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
      .filter(isVisible)
      .map((element) => ({
        level: Number(element.tagName.slice(1)),
        text: element.textContent?.trim().slice(0, 200) || '',
      }))
    const headingSkips = headings.flatMap((heading, index) => {
      if (index === 0 || heading.level <= headings[index - 1].level + 1) return []
      return [{ previous: headings[index - 1], current: heading }]
    })
    const overflowingElements = [...document.querySelectorAll('body *')]
      .filter(isVisible)
      .filter((element) => {
        const rect = element.getBoundingClientRect()
        return rect.left < -1 || rect.right > window.innerWidth + 1
      })
      .slice(0, 50)
      .map((element) => {
        const rect = element.getBoundingClientRect()
        return {
          element: describeElement(element),
          left: Math.round(rect.left * 100) / 100,
          right: Math.round(rect.right * 100) / 100,
          width: Math.round(rect.width * 100) / 100,
        }
      })
    const smallTargets = [...document.querySelectorAll('a[href],button,input,select,textarea,[role="button"],[role="link"]')]
      .filter(isVisible)
      .filter((element) => {
        if (element instanceof HTMLInputElement && element.type === 'hidden') return false
        const rect = element.getBoundingClientRect()
        return rect.width < 44 || rect.height < 44
      })
      .slice(0, 100)
      .map((element) => {
        const rect = element.getBoundingClientRect()
        return {
          element: describeElement(element),
          selector: selectorFor(element),
          classes: [...element.classList],
          name:
            element.getAttribute('aria-label') ||
            element.textContent?.trim().slice(0, 120) ||
            element.getAttribute('name') ||
            '',
          width: Math.round(rect.width * 100) / 100,
          height: Math.round(rect.height * 100) / 100,
        }
      })
    const images = [...document.images].map((image) => ({
      src: image.currentSrc || image.getAttribute('src') || '',
      alt: image.getAttribute('alt'),
      visible: isVisible(image),
      loaded: image.complete && image.naturalWidth > 0,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
    }))
    const robots = [
      ...document.querySelectorAll('meta[name="robots"],meta[name="googlebot"]'),
    ].map((meta) => ({
      name: meta.getAttribute('name'),
      content: meta.getAttribute('content') || '',
    }))

    return {
      title: document.title,
      titlePresent: document.title.trim().length > 0,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') || null,
      noindex: robots.some((meta) => /(^|,)\s*noindex\b/i.test(meta.content)),
      robots,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      overflowingElements,
      headings,
      headingSkips,
      images,
      imagesMissingAlt: images.filter((image) => image.alt === null),
      smallTargets,
    }
  })
}

async function collectAccessibleH1s(page) {
  const headings = page.getByRole('heading', { level: 1 })
  const count = await headings.count()
  const accessibleH1s = []
  for (let index = 0; index < count; index += 1) {
    const heading = headings.nth(index)
    if (await heading.isVisible()) {
      const name = (await heading.innerText()).trim()
      if (name) accessibleH1s.push(name.slice(0, 200))
    }
  }
  return accessibleH1s
}

async function waitForAdminReady(page) {
  await page.locator('h1').first().waitFor({ state: 'visible', timeout: READY_TIMEOUT_MS })
  await page.evaluate(async () => {
    await document.fonts.ready
  })
}

async function readEditorIdentity(page) {
  return page.evaluate(async () => {
    const response = await fetch('/api/users/me', {
      headers: { Accept: 'application/json' },
    })
    let body = null
    try {
      body = await response.json()
    } catch {
      body = null
    }
    return {
      status: response.status,
      email: body?.user?.email || null,
      role: body?.user?.role || null,
    }
  })
}

async function captureRoute({ context, baseURL, route, width, password, authenticated }) {
  const screenshot = screenshotName(route, width)
  const screenshotPath = path.join(OUTPUT_DIRECTORY, screenshot)
  const page = await context.newPage()
  page.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT_MS)
  page.setDefaultTimeout(READY_TIMEOUT_MS)
  await page.setViewportSize({ width, height: 1_000 })
  const consoleErrors = attachErrorCollection(page, password)
  const startedAt = Date.now()

  try {
    const response = await page.goto(new URL(route, baseURL).href, {
      waitUntil: 'domcontentloaded',
      timeout: NAVIGATION_TIMEOUT_MS,
    })
    if (!response) throw new Error('Navigation completed without an HTTP response.')
    if (!response.ok()) throw new Error(`Navigation returned HTTP ${response.status()}.`)

    await waitForAdminReady(page)
    const finalPath = normalizePathname(page.url())
    const expectedPath = normalizePathname(new URL(route, baseURL).href)
    const createdDraft = route.endsWith('/create') && /^\/admin\/collections\/noticias\/\d+$/.test(finalPath)
    if (finalPath !== expectedPath && !createdDraft) {
      throw new Error(`Unexpected redirect from ${route} to ${finalPath}.`)
    }
    if (createdDraft) {
      // Payload auto-creates a draft before rendering its edit form. This is
      // allowed only inside the guarded ephemeral CI database, never production.
      const draft = await page.evaluate(async (id) => {
        const response = await fetch(`/api/noticias/${id}?depth=0&draft=true`)
        return { status: response.status, publication: (await response.json())._status }
      }, finalPath.split('/').at(-1))
      if (draft.status !== 200 || draft.publication !== 'draft') {
        throw new Error('New document must remain an unpublished CI draft.')
      }
    }

    const accessibleH1s = await collectAccessibleH1s(page)
    if (accessibleH1s.length === 0) {
      throw new Error('No visible H1 with a non-empty accessible name was found.')
    }

    let session = null
    if (authenticated) {
      session = await readEditorIdentity(page)
      if (
        session.status !== 200 ||
        session.email !== EDITOR_EMAIL ||
        session.role !== 'editor'
      ) {
        throw new Error(
          `Editor session did not persist on ${route}: HTTP ${session.status}, role ${session.role || 'missing'}.`,
        )
      }
    }

    const metrics = await collectPageMetrics(page)
    await page.screenshot({ path: screenshotPath, fullPage: true })
    return {
      route,
      width,
      status: 'captured',
      httpStatus: response.status(),
      finalURL: page.url(),
      durationMs: Date.now() - startedAt,
      screenshot,
      accessibleH1s,
      session,
      metrics,
      consoleErrors,
    }
  } catch (error) {
    try {
      await page.screenshot({ path: screenshotPath, fullPage: true, timeout: 10_000 })
    } catch (screenshotError) {
      consoleErrors.push({
        source: 'screenshot',
        message: sanitizeText(screenshotError.message, password),
      })
    }
    return {
      route,
      width,
      status: 'failed',
      finalURL: page.url() || null,
      durationMs: Date.now() - startedAt,
      screenshot,
      error: sanitizeText(error.message, password),
      consoleErrors,
    }
  } finally {
    await page.close()
  }
}

async function authenticateEditor(context, baseURL, password) {
  const page = await context.newPage()
  page.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT_MS)
  page.setDefaultTimeout(READY_TIMEOUT_MS)
  const errors = attachErrorCollection(page, password)
  try {
    const response = await page.goto(new URL('/admin/login', baseURL).href, {
      waitUntil: 'domcontentloaded',
      timeout: NAVIGATION_TIMEOUT_MS,
    })
    if (!response?.ok()) {
      throw new Error(`Login navigation returned HTTP ${response?.status() ?? 'unknown'}.`)
    }
    await page.getByRole('textbox', { name: /e-?mail/i }).fill(EDITOR_EMAIL)
    await page.getByLabel(/senha/i).fill(password)
    await Promise.all([
      page.waitForURL((url) => normalizePathname(url.href) === '/admin', {
        timeout: NAVIGATION_TIMEOUT_MS,
      }),
      page.getByRole('button', { name: /entrar|login/i }).click(),
    ])
    await waitForAdminReady(page)
    const identity = await readEditorIdentity(page)
    if (
      identity.status !== 200 ||
      identity.email !== EDITOR_EMAIL ||
      identity.role !== 'editor'
    ) {
      throw new Error(
        `Login did not establish the expected editor session: HTTP ${identity.status}, role ${identity.role || 'missing'}.`,
      )
    }
    return { status: 'authenticated', identity, consoleErrors: errors }
  } catch (error) {
    return {
      status: 'failed',
      error: sanitizeText(error.message, password),
      consoleErrors: errors,
    }
  } finally {
    await page.close()
  }
}

async function writeReport(report) {
  await fs.writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}

const startedAt = new Date().toISOString()
const { baseURL, password } = requireIsolatedCIEnvironment()
await fs.mkdir(OUTPUT_DIRECTORY, { recursive: true })

const report = {
  schemaVersion: 1,
  startedAt,
  completedAt: null,
  baseURL,
  purpose:
    'Visual review evidence and DOM measurements. Recorded metrics are observations, not an automatic compliance claim.',
  navigationTimeoutMs: NAVIGATION_TIMEOUT_MS,
  editorEmail: EDITOR_EMAIL,
  login: null,
  captures: [],
  failures: [],
}

let browser
try {
  browser = await chromium.launch({ headless: true })

  const anonymousContext = await browser.newContext()
  try {
    for (const width of VIEWPORTS) {
      const capture = await captureRoute({
        context: anonymousContext,
        baseURL,
        route: '/admin/login',
        width,
        password,
        authenticated: false,
      })
      report.captures.push(capture)
      if (capture.status === 'failed') report.failures.push(capture)
      await writeReport(report)
    }
  } finally {
    await anonymousContext.close()
  }

  const authenticatedContext = await browser.newContext()
  try {
    report.login = await authenticateEditor(authenticatedContext, baseURL, password)
    if (report.login.status === 'failed') {
      report.failures.push({ stage: 'login', ...report.login })
    } else {
      for (const route of AUTHENTICATED_ROUTES) {
        for (const width of VIEWPORTS) {
          const capture = await captureRoute({
            context: authenticatedContext,
            baseURL,
            route,
            width,
            password,
            authenticated: true,
          })
          report.captures.push(capture)
          if (capture.status === 'failed') report.failures.push(capture)
          await writeReport(report)
        }
      }
    }
  } finally {
    await authenticatedContext.close()
  }
} catch (error) {
  report.failures.push({ stage: 'audit', error: sanitizeText(error.message, password) })
} finally {
  if (browser) await browser.close()
  report.completedAt = new Date().toISOString()
  await writeReport(report)
}

const captured = report.captures.filter((capture) => capture.status === 'captured').length
console.log(
  `Admin audit recorded ${captured}/${report.captures.length} captures in ${path.relative(process.cwd(), OUTPUT_DIRECTORY)}.`,
)
if (report.failures.length > 0) {
  const summary = report.failures
    .map((failure) => failure.error || `${failure.route} at ${failure.width}px failed`)
    .join(' | ')
  throw new Error(`Admin audit failed with ${report.failures.length} error(s): ${summary}`)
}
