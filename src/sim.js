import {
  TEAMS, GROUPS, GROUP_KEYS, groupMatches,
  R32_SPEC, R16_SPEC, QF_SPEC, SF_SPEC, FINAL_SPEC
} from './data.js'
import { THIRD_PLACE_MATRIX } from './thirdMatrix.js'

function poisson(lambda) {
  const L = Math.exp(-lambda)
  let p = 1, k = 0
  do { k++; p *= Math.random() } while (p > L)
  return k - 1
}

function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)) }

function sampleScore(homeId, awayId) {
  const d = TEAMS[homeId].elo - TEAMS[awayId].elo
  const lh = clamp(1.45 + d / 220, 0.25, 4.2)
  const la = clamp(1.45 - d / 220, 0.25, 4.2)
  return [poisson(lh), poisson(la)]
}

function sampleKO(homeId, awayId) {
  let [h, a] = sampleScore(homeId, awayId)
  if (h !== a) return [h, a, h > a ? homeId : awayId]
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

// Identify the 8 best third-place teams across the 12 groups.
function bestThirds(standings) {
  const thirds = []
  GROUP_KEYS.forEach(k => {
    const s = standings[k]
    if (s[2]) thirds.push({ group: k, ...s[2] })
  })
  thirds.sort((a, b) => b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF || (TEAMS[b.team].elo - TEAMS[a.team].elo))
  return thirds.slice(0, 8)
}

// Is a group's full slate of 6 matches scored? Used to gate KO resolution
// so the bracket view doesn't display Elo-tiebreaker placeholders before any
// actual results are entered.
function groupComplete(groupKey, results) {
  const ms = groupMatches(groupKey)
  for (let i = 0; i < ms.length; i++) {
    const r = results[`${groupKey}-${i}`]
    if (!r || r.home == null || r.away == null) return false
  }
  return true
}

// Resolve R32_SPEC into 16 concrete [homeTeamId, awayTeamId] pairs.
// Uses standings + Annex C third-place matrix. Requires results to know which
// groups are fully decided.
export function resolveR32Pairs(standings, results = {}) {
  const isDone = {}
  GROUP_KEYS.forEach(g => { isDone[g] = groupComplete(g, results) })
  const allDone = GROUP_KEYS.every(g => isDone[g])
  const thirds = allDone ? bestThirds(standings) : []
  if (thirds.length < 8) {
    // Pre-tournament / incomplete: only fill winner/runnerup for groups that are
    // actually decided. Third-place slots stay null until all 12 groups complete.
    return R32_SPEC.map(spec => {
      const teamFor = ref => {
        if (!isDone[ref.group] && (ref.kind === 'winner' || ref.kind === 'runnerup')) return null
        if (ref.kind === 'winner') return standings[ref.group]?.[0]?.team
        if (ref.kind === 'runnerup') return standings[ref.group]?.[1]?.team
        return null // third unresolved
      }
      return [teamFor(spec.home), teamFor(spec.away)]
    })
  }
  const groupsKey = thirds.map(t => t.group).sort().join('')
  const assignment = THIRD_PLACE_MATRIX[groupsKey]
  // Map of "1A" / "1B" / "1D" / "1E" / "1G" / "1I" / "1K" / "1L" → "3X"
  // Header order in matrix: 1A, 1B, 1D, 1E, 1G, 1I, 1K, 1L
  const headerSlots = ['1A', '1B', '1D', '1E', '1G', '1I', '1K', '1L']
  const slotToThird = {}
  if (assignment) {
    headerSlots.forEach((slot, i) => { slotToThird[slot] = assignment[i] })
  }
  // R32 matches involving a third-placed team are those whose winner's group is in headerSlots.
  return R32_SPEC.map(spec => {
    const teamFor = (ref, otherRef) => {
      if (ref.kind === 'winner') return standings[ref.group][0].team
      if (ref.kind === 'runnerup') return standings[ref.group][1].team
      if (ref.kind === 'third') {
        // Identify slot via the OPPONENT (the group winner this 3rd team faces).
        if (otherRef.kind === 'winner') {
          const slot = `1${otherRef.group}`
          const thirdLabel = slotToThird[slot] // e.g. "3E"
          if (!thirdLabel) return null
          const grp = thirdLabel[1]
          return standings[grp]?.[2]?.team || null
        }
        return null
      }
      return null
    }
    return [teamFor(spec.home, spec.away), teamFor(spec.away, spec.home)]
  })
}

// Determine 32 advancing teams (for Probabilities/Advancing UI). Order: 12 winners, 12 runners-up, 8 best thirds.
export function advancingTeams(standings) {
  const list = []
  GROUP_KEYS.forEach(k => { if (standings[k][0]) list.push(standings[k][0]) })
  GROUP_KEYS.forEach(k => { if (standings[k][1]) list.push(standings[k][1]) })
  bestThirds(standings).forEach(t => list.push(t))
  return list
}

function simOnce(results) {
  const simResults = { ...results }
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
  const r32Pairs = resolveR32Pairs(standings, simResults)
  const reached = {}
  r32Pairs.forEach(([h, a]) => {
    if (h) reached[h] = reached[h] || { r32: 1, r16: 0, qf: 0, sf: 0, final: 0, champ: 0 }
    if (a) reached[a] = reached[a] || { r32: 1, r16: 0, qf: 0, sf: 0, final: 0, champ: 0 }
  })

  // R32 winners: 16 winners indexed by match number minus 73
  const r32Winners = r32Pairs.map(([h, a]) => h && a ? sampleKO(h, a)[2] : null)

  // R16 from R16_SPEC.feeds (match numbers → r32 winner indices)
  const r16Winners = R16_SPEC.map(spec => {
    const h = r32Winners[spec.feeds[0] - 73]
    const a = r32Winners[spec.feeds[1] - 73]
    if (h) reached[h].r16 = 1
    if (a) reached[a].r16 = 1
    if (!h || !a) return null
    return sampleKO(h, a)[2]
  })

  const qfWinners = QF_SPEC.map(spec => {
    const h = r16Winners[spec.feeds[0] - 89]
    const a = r16Winners[spec.feeds[1] - 89]
    if (h) reached[h].qf = 1
    if (a) reached[a].qf = 1
    if (!h || !a) return null
    return sampleKO(h, a)[2]
  })

  const sfWinners = SF_SPEC.map(spec => {
    const h = qfWinners[spec.feeds[0] - 97]
    const a = qfWinners[spec.feeds[1] - 97]
    if (h) reached[h].sf = 1
    if (a) reached[a].sf = 1
    if (!h || !a) return null
    return sampleKO(h, a)[2]
  })

  if (sfWinners[0] && sfWinners[1]) {
    reached[sfWinners[0]].final = 1
    reached[sfWinners[1]].final = 1
    const champ = sampleKO(sfWinners[0], sfWinners[1])[2]
    reached[champ].champ = 1
  }
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

// Compute deterministic bracket from user-entered scores (used for Bracket view).
export function computeBracket(results, koResults) {
  const standings = allGroupStandings(results)
  const r32Pairs = resolveR32Pairs(standings, results)
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
  const r32Winners = r32Pairs.map(([h, a], i) => winnerOf('r32', i, h, a))
  const r16Pairs = R16_SPEC.map(spec => [r32Winners[spec.feeds[0] - 73], r32Winners[spec.feeds[1] - 73]])
  const r16Winners = r16Pairs.map(([h, a], i) => winnerOf('r16', i, h, a))
  const qfPairs = QF_SPEC.map(spec => [r16Winners[spec.feeds[0] - 89], r16Winners[spec.feeds[1] - 89]])
  const qfWinners = qfPairs.map(([h, a], i) => winnerOf('qf', i, h, a))
  const sfPairs = SF_SPEC.map(spec => [qfWinners[spec.feeds[0] - 97], qfWinners[spec.feeds[1] - 97]])
  const sfWinners = sfPairs.map(([h, a], i) => winnerOf('sf', i, h, a))
  const finalPair = [sfWinners[0], sfWinners[1]]
  const champ = winnerOf('final', 0, finalPair[0], finalPair[1])
  const advancing = advancingTeams(standings)
  return { r32Pairs, r16Pairs, qfPairs, sfPairs, finalPair, champ, advancing, standings }
}
