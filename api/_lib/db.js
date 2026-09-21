import postgres from 'postgres'

let sqlClient
let ready

function getSql() {
  if (!sqlClient) {
    const connectionString = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING
    if (!connectionString) throw new Error('POSTGRES_URL não configurado')
    sqlClient = postgres(connectionString, { ssl: 'require' })
  }
  return sqlClient
}

async function ensureTable() {
  const sql = getSql()
  await sql`
    CREATE TABLE IF NOT EXISTS site_content (
      id INTEGER PRIMARY KEY DEFAULT 1,
      data JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
}

async function init() {
  if (!ready) ready = ensureTable()
  return ready
}

export async function readContent() {
  await init()
  const sql = getSql()
  const rows = await sql`SELECT data FROM site_content WHERE id = 1`
  return rows[0]?.data || {}
}

export async function writeContent(data) {
  await init()
  const sql = getSql()
  await sql`
    INSERT INTO site_content (id, data, updated_at)
    VALUES (1, ${sql.json(data)}, now())
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
  `
}
