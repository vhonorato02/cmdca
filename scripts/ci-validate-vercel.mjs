const target = {
  orgId: 'team_43xSvVJZ9lHuy6K7NNxlMhXG',
  projectId: 'prj_H9WT3VLyIC8r2tvAsqeXYH9IoLey',
}
const required = ['VERCEL_TOKEN', 'VERCEL_ORG_ID', 'VERCEL_PROJECT_ID']
const missing = required.filter((name) => !process.env[name]?.trim())

if (missing.length > 0) {
  throw new Error(`Segredos GitHub obrigatorios ausentes: ${missing.join(', ')}.`)
}

if (process.env.VERCEL_ORG_ID !== target.orgId) {
  throw new Error('VERCEL_ORG_ID nao confere com o destino de producao confirmado.')
}

if (process.env.VERCEL_PROJECT_ID !== target.projectId) {
  throw new Error('VERCEL_PROJECT_ID nao confere com o destino de producao confirmado.')
}

console.log('Segredos obrigatorios e vinculo Vercel de producao validados.')
