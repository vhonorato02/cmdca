// Os dados de teste (fixtures) só existem no PostgreSQL efêmero do CI. Contra a
// produção (E2E_TARGET=production), os testes que dependem deles são pulados e os
// de leitura continuam valendo.
export const usesCiFixtures =
  process.env.GITHUB_ACTIONS === 'true' && process.env.E2E_TARGET !== 'production'

// Só a produção é indexável, e só quando SITE_INDEXABLE não está desligado: o CI roda
// com noindex global, e a produção também pode estar fora do ar para buscadores (por
// exemplo, publicada só no domínio temporário enquanto o domínio oficial espera).
export const targetIsIndexable =
  process.env.E2E_TARGET === 'production' && process.env.SITE_INDEXABLE !== 'false'
