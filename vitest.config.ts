import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

// Testes unitários das funções puras (slug, datas). Ambiente Node — sem DOM.
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
