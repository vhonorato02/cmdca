type TranslationWindow = Window & {
  VLibras?: { Widget: new (url: string) => unknown }
  VLibrasWidget?: { open?: () => void }
}

const PLUGIN_URL = 'https://vlibras.gov.br/app/vlibras-plugin.js'
const APP_URL = 'https://vlibras.gov.br/app'
const LOAD_TIMEOUT_MS = 20_000

let loading: Promise<void> | undefined

function labelWidget() {
  const wrapper = document.getElementById('vlibras-access-wrapper')
  if (wrapper) {
    wrapper.setAttribute('role', 'region')
    wrapper.setAttribute('aria-label', 'Tradução para Libras')
  }
}

/** Espera o plugin expor `VLibrasWidget.open()` depois de inicializado. */
function waitForWidget(win: TranslationWindow): Promise<void> {
  return new Promise((resolve, reject) => {
    const started = Date.now()
    const tick = () => {
      if (typeof win.VLibrasWidget?.open === 'function') return resolve()
      if (Date.now() - started > LOAD_TIMEOUT_MS) return reject(new Error('VLibras não respondeu'))
      window.setTimeout(tick, 150)
    }
    tick()
  })
}

/**
 * Carrega o VLibras (governo federal) só quando a pessoa pede. Assim nenhum
 * script de terceiro roda antes de uma ação do visitante e a página não fica
 * presa esperando o servidor do plugin.
 */
export function loadVLibras(): Promise<void> {
  if (loading) return loading
  const win = window as TranslationWindow
  loading = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = PLUGIN_URL
    script.async = true
    script.onerror = () => reject(new Error('Falha ao baixar o VLibras'))
    script.onload = () => {
      try {
        const Widget = win.VLibras?.Widget
        if (!Widget) throw new Error('VLibras indisponível')
        new Widget(APP_URL)
        // O plugin escuta o "load" da janela, que já passou: dispara de novo.
        window.dispatchEvent(new Event('load'))
        new MutationObserver(labelWidget).observe(document.body, { childList: true, subtree: true })
        waitForWidget(win).then(resolve, reject)
      } catch (error) {
        reject(error)
      }
    }
    document.body.appendChild(script)
  }).catch((error: unknown) => {
    loading = undefined
    throw error
  })
  return loading
}

export async function openVLibras(): Promise<void> {
  await loadVLibras()
  ;(window as TranslationWindow).VLibrasWidget?.open?.()
}
