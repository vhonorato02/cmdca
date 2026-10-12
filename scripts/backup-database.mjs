import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { parse } from 'dotenv'

assert.ok(process.argv.includes('--confirm-backup-and-isolated-restore'),
  'Explicit --confirm-backup-and-isolated-restore is required')
const env = parse(await readFile('.env.local'))
const uri = env.DATABASE_URI_UNPOOLED
assert.ok(uri && !/[\r\n]/.test(uri), 'A single-line direct database URI is required')
const database = new URL(uri)
assert.equal(database.protocol, 'postgresql:')
assert.ok(database.hostname.endsWith('.neon.tech'), 'Only the configured Neon source is allowed')
const stamp = new Date().toISOString().replace(/[-:TZ.]/g, '')
const name = `cmdca_restore_${stamp}`
const backup = `/srv/backups/cmdca/database-${stamp}.dump`
const script = `
set -euo pipefail
umask 077
install -d -m 700 /srv/backups/cmdca
test ! -e '${backup}'
docker run --rm --pull never --network host --read-only --memory 128m --cpus 0.5 --cap-drop ALL --security-opt no-new-privileges:true -i --entrypoint sh postgres:17-alpine -c '
  IFS= read -r PGHOST
  IFS= read -r PGPORT
  IFS= read -r PGUSER
  IFS= read -r PGPASSWORD
  IFS= read -r PGDATABASE
  export PGHOST PGPORT PGUSER PGPASSWORD PGDATABASE
  export PGSSLMODE=verify-full PGSSLROOTCERT=system PGCONNECT_TIMEOUT=20
  exec pg_dump --format=custom --no-owner --no-acl
' > '${backup}'
test -s '${backup}'
docker exec platform-postgres-1 createdb -U postgres '${name}'
docker exec platform-postgres-1 psql -U postgres -d postgres -v ON_ERROR_STOP=1 -c 'REVOKE ALL ON DATABASE "${name}" FROM PUBLIC' >/dev/null
docker exec -i platform-postgres-1 pg_restore -U postgres --exit-on-error --no-owner --no-acl -d '${name}' < '${backup}'
tables=$(docker exec platform-postgres-1 psql -U postgres -d '${name}' -qAt -c "SELECT count(*) FROM information_schema.tables WHERE table_schema='public'")
test "$tables" -gt 0
printf 'BACKUP=%s\\nRESTORE_DATABASE=%s\\nTABLES=%s\\n' '${backup}' '${name}' "$tables"
sha256sum '${backup}'
`
const shellQuote = (value) => `'${value.replaceAll("'", "'\\''")}'`
const child = spawn('ssh', [
  '-F', 'NUL', '-T', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10',
  '-o', 'StrictHostKeyChecking=yes', '-o', 'IdentitiesOnly=yes',
  '-i', path.join(os.homedir(), '.ssh', 'id_ed25519_zewithane'),
  '-p', '22322', 'zewithane@zewithane.vps.brz.dev.br',
  `sudo -n bash -c ${shellQuote(script)}`,
], { stdio: ['pipe', 'pipe', 'pipe'] })
// The source credential travels over encrypted stdin, never in argv or a remote file.
const connection = [database.hostname, database.port || '5432',
  decodeURIComponent(database.username), decodeURIComponent(database.password),
  decodeURIComponent(database.pathname.slice(1))]
assert.ok(connection.every((value) => value && !/[\r\n]/.test(value)))
child.stdin.end(`${connection.join('\n')}\n`)
let output = ''
let error = ''
child.stdout.on('data', (chunk) => { output += chunk })
child.stderr.on('data', (chunk) => { error += chunk })
const code = await new Promise((resolve, reject) => {
  child.once('error', reject)
  child.once('close', resolve)
})
if (code !== 0) {
  const secrets = [uri, database.hostname, database.username, database.password,
    decodeURIComponent(database.password)].filter(Boolean)
  for (const value of secrets) error = error.replaceAll(value, '[redacted]')
  console.error(`Backup/restore failed (exit ${code}). No source mutation was requested.\n${error}`)
  process.exit(1)
}
console.log(output.trim())
console.log('Source database unchanged. Isolated restore retained privately for inspection; no application is connected.')
