import postgres from 'postgres'
import { promises as fs } from 'node:fs'
import path from 'node:path'

// Armazenamento das rotas dos clientes. No site (Vercel) usa o Postgres.
// No dev local (ROTAS_STORE=file) usa um arquivo .dev-data/rotas.json, pra testar sem tocar no banco real.

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

async function ensureTables() {
  const sql = getSql()
  await sql`
    CREATE TABLE IF NOT EXISTS client_routes (
      id TEXT PRIMARY KEY,
      route_name TEXT NOT NULL,
      client_name TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      token_version INTEGER NOT NULL DEFAULT 1,
      revoked BOOLEAN NOT NULL DEFAULT false,
      html TEXT NOT NULL DEFAULT '',
      failed_attempts INTEGER NOT NULL DEFAULT 0,
      locked_until TIMESTAMPTZ,
      last_access TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS client_route_files (
      id TEXT PRIMARY KEY,
      route_id TEXT NOT NULL REFERENCES client_routes(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      size INTEGER NOT NULL,
      data BYTEA NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
}

async function init() {
  if (!ready) ready = ensureTables()
  return ready
}

const ms = (d) => (d ? new Date(d).getTime() : null)

function fileMeta(f) {
  return { id: f.id, name: f.name, type: f.type, size: f.size, createdAt: ms(f.created_at) }
}

function rowToRoute(r, files = []) {
  return {
    id: r.id,
    routeName: r.route_name,
    clientName: r.client_name,
    username: r.username,
    passwordHash: r.password_hash,
    tokenVersion: r.token_version,
    revoked: r.revoked,
    html: r.html,
    failedAttempts: r.failed_attempts,
    lockedUntil: ms(r.locked_until),
    lastAccess: ms(r.last_access),
    createdAt: ms(r.created_at),
    updatedAt: ms(r.updated_at),
    files,
  }
}

const FIELD_TO_COLUMN = {
  routeName: 'route_name',
  clientName: 'client_name',
  username: 'username',
  passwordHash: 'password_hash',
  tokenVersion: 'token_version',
  revoked: 'revoked',
  html: 'html',
  failedAttempts: 'failed_attempts',
  lockedUntil: 'locked_until',
  lastAccess: 'last_access',
}

const pgStore = {
  async list() {
    await init()
    const sql = getSql()
    const rows = await sql`
      SELECT id, route_name, client_name, username, token_version, revoked,
             failed_attempts, locked_until, last_access, created_at, updated_at,
             length(html) AS html_size
      FROM client_routes ORDER BY created_at DESC
    `
    const files = await sql`SELECT id, route_id, name, type, size, created_at FROM client_route_files ORDER BY created_at`
    return rows.map((r) => ({
      ...rowToRoute({ ...r, password_hash: undefined, html: '' }, files.filter((f) => f.route_id === r.id).map(fileMeta)),
      htmlSize: Number(r.html_size),
    }))
  },
  async get(id) {
    await init()
    const sql = getSql()
    const rows = await sql`SELECT * FROM client_routes WHERE id = ${id}`
    if (!rows[0]) return null
    const files = await sql`SELECT id, route_id, name, type, size, created_at FROM client_route_files WHERE route_id = ${id} ORDER BY created_at`
    return rowToRoute(rows[0], files.map(fileMeta))
  },
  async getByUsername(username) {
    await init()
    const sql = getSql()
    const rows = await sql`SELECT id FROM client_routes WHERE username = ${username}`
    return rows[0] ? this.get(rows[0].id) : null
  },
  async insert(route) {
    await init()
    const sql = getSql()
    await sql`
      INSERT INTO client_routes (id, route_name, client_name, username, password_hash, html)
      VALUES (${route.id}, ${route.routeName}, ${route.clientName}, ${route.username}, ${route.passwordHash}, ${route.html})
    `
  },
  async update(id, patch) {
    await init()
    const sql = getSql()
    const data = {}
    for (const [k, v] of Object.entries(patch)) {
      if (!FIELD_TO_COLUMN[k]) continue
      data[FIELD_TO_COLUMN[k]] = k === 'lockedUntil' || k === 'lastAccess' ? (v ? new Date(v) : null) : v
    }
    data.updated_at = new Date()
    await sql`UPDATE client_routes SET ${sql(data)} WHERE id = ${id}`
  },
  async remove(id) {
    await init()
    const sql = getSql()
    await sql`DELETE FROM client_routes WHERE id = ${id}`
  },
  async insertFile(file) {
    await init()
    const sql = getSql()
    await sql`
      INSERT INTO client_route_files (id, route_id, name, type, size, data)
      VALUES (${file.id}, ${file.routeId}, ${file.name}, ${file.type}, ${file.size}, ${file.data})
    `
  },
  async getFile(routeId, fileId) {
    await init()
    const sql = getSql()
    const rows = await sql`SELECT id, name, type, size, data FROM client_route_files WHERE id = ${fileId} AND route_id = ${routeId}`
    return rows[0] ? { id: rows[0].id, name: rows[0].name, type: rows[0].type, size: rows[0].size, data: rows[0].data } : null
  },
  async removeFile(routeId, fileId) {
    await init()
    const sql = getSql()
    await sql`DELETE FROM client_route_files WHERE id = ${fileId} AND route_id = ${routeId}`
  },
}

// ---- dev local: arquivo JSON ----
const DEV_FILE = path.resolve(process.cwd(), '.dev-data', 'rotas.json')

async function readDev() {
  try {
    return JSON.parse(await fs.readFile(DEV_FILE, 'utf8'))
  } catch {
    return { routes: [], files: [] }
  }
}

async function writeDev(db) {
  await fs.mkdir(path.dirname(DEV_FILE), { recursive: true })
  await fs.writeFile(DEV_FILE, JSON.stringify(db))
}

const devFileMeta = (f) => ({ id: f.id, name: f.name, type: f.type, size: f.size, createdAt: f.createdAt })

const devStore = {
  async list() {
    const db = await readDev()
    return db.routes
      .map((r) => ({
        ...r,
        htmlSize: r.html.length,
        html: '',
        passwordHash: undefined,
        files: db.files.filter((f) => f.routeId === r.id).map(devFileMeta),
      }))
      .sort((a, b) => b.createdAt - a.createdAt)
  },
  async get(id) {
    const db = await readDev()
    const r = db.routes.find((x) => x.id === id)
    if (!r) return null
    return { ...r, files: db.files.filter((f) => f.routeId === id).map(devFileMeta) }
  },
  async getByUsername(username) {
    const db = await readDev()
    const r = db.routes.find((x) => x.username === username)
    return r ? this.get(r.id) : null
  },
  async insert(route) {
    const db = await readDev()
    if (db.routes.some((x) => x.username === route.username)) throw Object.assign(new Error('duplicate'), { code: '23505' })
    db.routes.push({ ...route, tokenVersion: 1, revoked: false, failedAttempts: 0, lockedUntil: null, lastAccess: null, createdAt: Date.now(), updatedAt: Date.now() })
    await writeDev(db)
  },
  async update(id, patch) {
    const db = await readDev()
    const r = db.routes.find((x) => x.id === id)
    if (!r) return
    if (patch.username && db.routes.some((x) => x.id !== id && x.username === patch.username)) throw Object.assign(new Error('duplicate'), { code: '23505' })
    Object.assign(r, patch, { updatedAt: Date.now() })
    await writeDev(db)
  },
  async remove(id) {
    const db = await readDev()
    db.routes = db.routes.filter((x) => x.id !== id)
    db.files = db.files.filter((f) => f.routeId !== id)
    await writeDev(db)
  },
  async insertFile(file) {
    const db = await readDev()
    db.files.push({ ...file, data: file.data.toString('base64'), createdAt: Date.now() })
    await writeDev(db)
  },
  async getFile(routeId, fileId) {
    const db = await readDev()
    const f = db.files.find((x) => x.id === fileId && x.routeId === routeId)
    return f ? { id: f.id, name: f.name, type: f.type, size: f.size, data: Buffer.from(f.data, 'base64') } : null
  },
  async removeFile(routeId, fileId) {
    const db = await readDev()
    db.files = db.files.filter((x) => !(x.id === fileId && x.routeId === routeId))
    await writeDev(db)
  },
}

export function rotasStore() {
  return process.env.ROTAS_STORE === 'file' ? devStore : pgStore
}
