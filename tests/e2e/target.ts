// Os dados de teste (fixtures) só existem no PostgreSQL efêmero do CI. Contra a
// produção (E2E_TARGET=production), os testes que dependem deles são pulados e os
// de leitura continuam valendo.
export const usesCiFixtures =
  process.env.GITHUB_ACTIONS === 'true' && process.env.E2E_TARGET !== 'production'

// Só a produção é indexável; o CI roda com SITE_INDEXABLE desligado (noindex global).
export const targetIsIndexable = process.env.E2E_TARGET === 'production'
