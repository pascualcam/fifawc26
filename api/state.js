import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  console.error('[api/state] DATABASE_URL is missing. .env.local not loaded or value empty.')
}
const sql = neon(process.env.DATABASE_URL || 'postgresql://placeholder@localhost/none')

function slugify(name) {
  return String(name || '').trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
}

// USER_PASSCODES env var: comma-separated "name:passcode" pairs, names case-insensitive.
//   Example: "pascual:abc123,alice:xyz789,bob:hunter2"
// Fallback: shared APP_PASSCODE applies to any name.
function parseUsers() {
  const raw = process.env.USER_PASSCODES || ''
  const map = {}
  for (const pair of raw.split(',')) {
    const [name, pass] = pair.split(':').map(s => s && s.trim())
    if (name && pass) map[slugify(name)] = pass
  }
  return map
}

function auth(req) {
  const passcode = req.headers['x-passcode']
  const userRaw = req.headers['x-user']
  const userId = slugify(userRaw)
  if (!userId || !passcode) return null
  const users = parseUsers()
  if (Object.keys(users).length > 0) {
    return users[userId] === passcode ? userId : null
  }
  // Fallback: shared passcode
  return passcode === process.env.APP_PASSCODE ? userId : null
}

export default async function handler(req, res) {
  // CORS for dev
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Passcode, X-User')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  if (req.method === 'OPTIONS') return res.status(204).end()

  const userId = auth(req)
  if (!userId) return res.status(401).json({ error: 'invalid passcode or user' })

  try {
    if (req.method === 'GET') {
      const rows = await sql`SELECT data FROM user_state WHERE user_id = ${userId}`
      const data = rows[0]?.data ?? { results: {}, ko: {}, expect: { results: {}, ko: {} } }
      return res.status(200).json({ user: userId, data })
    }
    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      if (!body || typeof body !== 'object') return res.status(400).json({ error: 'invalid body' })
      await sql`
        INSERT INTO user_state (user_id, data, updated_at)
        VALUES (${userId}, ${body}::jsonb, now())
        ON CONFLICT (user_id) DO UPDATE
        SET data = EXCLUDED.data, updated_at = now()
      `
      return res.status(200).json({ ok: true })
    }
    return res.status(405).json({ error: 'method not allowed' })
  } catch (err) {
    console.error('api/state error', err)
    return res.status(500).json({ error: 'server error' })
  }
}
