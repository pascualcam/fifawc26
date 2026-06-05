// Server-backed state store. Auth via passcode + user name (stored in localStorage).
// State shape: { results, ko, expect: { results, ko } }

const AUTH_KEY = 'fifawc26-auth'
const API_BASE = import.meta.env.VITE_API_BASE || ''

export const EMPTY_STATE = { results: {}, ko: {}, expect: { results: {}, ko: {} } }

export function loadAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveAuth(auth) {
  if (auth) localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
  else localStorage.removeItem(AUTH_KEY)
}

function headers(auth) {
  return {
    'Content-Type': 'application/json',
    'X-Passcode': auth.passcode,
    'X-User': auth.name
  }
}

export async function fetchState(auth) {
  const res = await fetch(`${API_BASE}/api/state`, { headers: headers(auth) })
  if (res.status === 401) throw new Error('unauthorized')
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
  const json = await res.json()
  return { ...EMPTY_STATE, ...json.data, expect: { ...EMPTY_STATE.expect, ...(json.data?.expect || {}) } }
}

export async function putState(auth, state) {
  const res = await fetch(`${API_BASE}/api/state`, {
    method: 'PUT',
    headers: headers(auth),
    body: JSON.stringify(state)
  })
  if (res.status === 401) throw new Error('unauthorized')
  if (!res.ok) throw new Error(`put failed: ${res.status}`)
}

// Verify passcode by attempting a GET. Returns true on success.
export async function verifyAuth(auth) {
  try {
    await fetchState(auth)
    return true
  } catch (e) {
    return false
  }
}
