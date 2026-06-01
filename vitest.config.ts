import { defineConfig } from 'vitest/config'

// Testes unitários das funções puras (slug, datas). Ambiente Node — sem DOM.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
