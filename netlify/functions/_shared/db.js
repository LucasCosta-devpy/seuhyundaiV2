import { neon } from '@netlify/neon'

let sqlClient
let ready

function getSql() {
  if (!sqlClient) sqlClient = neon()
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
    VALUES (1, ${JSON.stringify(data)}::jsonb, now())
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
  `
}
