import { TEAMS, GROUPS, GROUP_KEYS, groupMatches } from './data.js'

function poisson(lambda) {
  const L = Math.exp(-lambda)
  let p = 1, k = 0
  do { k++; p *= Math.random() } while (p > L)
  return k - 1
}

function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)) }

// Generate plausible scoreline from Elo diff (home perspective).
function sampleScore(homeId, awayId) {
  const d = TEAMS[homeId].elo - TEAMS[awayId].elo
  const lh = clamp(1.45 + d / 220, 0.25, 4.2)
  const la = clamp(1.45 - d / 220, 0.25, 4.2)
  return [poisson(lh), poisson(la)]
}

// KO: replay until non-draw (mimic ET/pens) — but skew by Elo.
function sampleKO(homeId, awayId) {
  let [h, a] = sampleScore(homeId, awayId)
  if (h !== a) return [h, a, h > a ? homeId : awayId]
  // penalties → tilt by Elo
  const d = TEAMS[homeId].elo - TEAMS[awayId].elo
  const pHome = 1 / (1 + Math.pow(10, -d / 600))
  const winner = Math.random() < pHome ? homeId : awayId
  return [h, a, winner]
}

function computeGroupStandings(groupKey, results) {
  const teams = GROUPS[groupKey]
  const stats = {}
  teams.forEach(t => stats[t] = { team: t, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 })
  const matches = groupMatches(groupKey)
  matches.forEach(([h, a], idx) => {
    const key = `${groupKey}-${idx}`
    const r = results[key]
    if (!r || r.home == null || r.away == null) return
    stats[h].P++; stats[a].P++
    stats[h].GF += r.home; stats[h].GA += r.away
    stats[a].GF += r.away; stats[a].GA += r.home
    stats[h].GD = stats[h].GF - stats[h].GA
    stats[a].GD = stats[a].GF - stats[a].GA
    if (r.home > r.away) { stats[h].W++; stats[a].L++; stats[h].Pts += 3 }
    else if (r.home < r.away) { stats[a].W++; stats[h].L++; stats[a].Pts += 3 }
    else { stats[h].D++; stats[a].D++; stats[h].Pts++; stats[a].Pts++ }
  })
  return Object.values(stats).sort((x, y) =>
    y.Pts - x.Pts || y.GD - x.GD || y.GF - x.GF || (TEAMS[y.team].elo - TEAMS[x.team].elo)
  )
}

export function allGroupStandings(results) {
  const out = {}
  GROUP_KEYS.forEach(k => out[k] = computeGroupStandings(k, results))
  return out
}

// Determine 32 advancing teams in seeded order
export function advancingTeams(standings) {
  const top2 = []
  const thirds = []
  GROUP_KEYS.forEach(k => {
    const s = standings[k]
    if (s[0]) top2.push(s[0])
    if (s[1]) top2.push(s[1])
    if (s[2]) thirds.push(s[2])
  })
  thirds.sort((a, b) => b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF || (TEAMS[b.team].elo - TEAMS[a.team].elo))
  const best8 = thirds.slice(0, 8)
  const all = [...top2, ...best8]
  // Seed by Pts/GD/GF/Elo
  all.sort((a, b) => b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF || (TEAMS[b.team].elo - TEAMS[a.team].elo))
  return all
}

// Build standard knockout bracket pairings from 32 seeds.
// R32: 1-32, 16-17, 8-25, 9-24, 4-29, 13-20, 5-28, 12-21,
//      2-31, 15-18, 7-26, 10-23, 3-30, 14-19, 6-27, 11-22
const R32_PAIRS = [
  [1, 32], [16, 17], [8, 25], [9, 24], [4, 29], [13, 20], [5, 28], [12, 21],
  [2, 31], [15, 18], [7, 26], [10, 23], [3, 30], [14, 19], [6, 27], [11, 22]
]

export function buildBracketPairs(advancing) {
  // advancing[0] is seed 1
  return R32_PAIRS.map(([a, b]) => [advancing[a - 1]?.team, advancing[b - 1]?.team])
}

// Simulate one full tournament given current results (treat empty matches as random)
function simOnce(results) {
  const simResults = { ...results }
  // Fill missing group matches
  GROUP_KEYS.forEach(k => {
    groupMatches(k).forEach(([h, a], idx) => {
      const key = `${k}-${idx}`
      if (!simResults[key] || simResults[key].home == null) {
        const [hg, ag] = sampleScore(h, a)
        simResults[key] = { home: hg, away: ag }
      }
    })
  })
  const standings = allGroupStandings(simResults)
  const advancing = advancingTeams(standings)
  const reached = {}
  advancing.forEach(t => reached[t.team] = { r32: 1, r16: 0, qf: 0, sf: 0, final: 0, champ: 0 })

  let round = buildBracketPairs(advancing).map(([h, a]) => sampleKO(h, a)[2])
  // round is array of 16 winners → R16
  round.forEach(w => reached[w].r16 = 1)
  let r16 = []
  for (let i = 0; i < round.length; i += 2) r16.push(sampleKO(round[i], round[i + 1])[2])
  r16.forEach(w => reached[w].qf = 1)
  let qf = []
  for (let i = 0; i < r16.length; i += 2) qf.push(sampleKO(r16[i], r16[i + 1])[2])
  qf.forEach(w => reached[w].sf = 1)
  let sf = []
  for (let i = 0; i < qf.length; i += 2) sf.push(sampleKO(qf[i], qf[i + 1])[2])
  sf.forEach(w => reached[w].final = 1)
  const champ = sampleKO(sf[0], sf[1])[2]
  reached[champ].champ = 1
  return reached
}

export function runMonteCarlo(results, N = 2000) {
  const agg = {}
  Object.keys(TEAMS).forEach(t => agg[t] = { r32: 0, r16: 0, qf: 0, sf: 0, final: 0, champ: 0 })
  for (let i = 0; i < N; i++) {
    const r = simOnce(results)
    for (const t in r) {
      agg[t].r32 += r[t].r32
      agg[t].r16 += r[t].r16
      agg[t].qf += r[t].qf
      agg[t].sf += r[t].sf
      agg[t].final += r[t].final
      agg[t].champ += r[t].champ
    }
  }
  Object.keys(agg).forEach(t => {
    agg[t].r32 /= N; agg[t].r16 /= N; agg[t].qf /= N
    agg[t].sf /= N; agg[t].final /= N; agg[t].champ /= N
  })
  return agg
}

// Compute deterministic bracket from user-entered scores (used for Bracket view)
export function computeBracket(results, koResults) {
  const standings = allGroupStandings(results)
  const advancing = advancingTeams(standings)
  const r32Pairs = buildBracketPairs(advancing)
  // winnerOf only honors stored entry if it matches current pair (else stale).
  const winnerOf = (round, idx, expHome, expAway) => {
    if (!expHome || !expAway) return null
    const r = koResults[`${round}-${idx}`]
    if (!r) return null
    if (r.homeId !== expHome || r.awayId !== expAway) return null
    if (r.home == null || r.away == null) return null
    if (r.home > r.away) return r.homeId
    if (r.away > r.home) return r.awayId
    if (r.penWinner === r.homeId || r.penWinner === r.awayId) return r.penWinner
    return TEAMS[r.homeId].elo >= TEAMS[r.awayId].elo ? r.homeId : r.awayId
  }
  // Build round-by-round using winners of prior round as next pair members.
  const buildNext = (prevPairs, prevRoundName) => {
    const next = []
    for (let i = 0; i < prevPairs.length; i += 2) {
      const w1 = winnerOf(prevRoundName, i, prevPairs[i][0], prevPairs[i][1])
      const w2 = winnerOf(prevRoundName, i + 1, prevPairs[i + 1][0], prevPairs[i + 1][1])
      next.push([w1, w2])
    }
    return next
  }
  const r16Pairs = buildNext(r32Pairs, 'r32')
  const qfPairs = buildNext(r16Pairs, 'r16')
  const sfPairs = buildNext(qfPairs, 'qf')
  const finalPair = [
    winnerOf('sf', 0, sfPairs[0][0], sfPairs[0][1]),
    winnerOf('sf', 1, sfPairs[1][0], sfPairs[1][1])
  ]
  const champ = winnerOf('final', 0, finalPair[0], finalPair[1])
  return { r32Pairs, r16Pairs, qfPairs, sfPairs, finalPair, champ, advancing, standings }
}
