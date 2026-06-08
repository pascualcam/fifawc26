import React, { useState, useEffect, useMemo, useRef } from 'react'
import { TEAMS, GROUPS, GROUP_KEYS, groupMatches, groupSchedule, VENUES, KO_SCHEDULE, allMatchesSequential, koSlotLabel } from './data.js'
import { allGroupStandings, advancingTeams, computeBracket, runMonteCarlo } from './sim.js'
import { EMPTY_STATE, loadAuth, saveAuth, fetchState, putState, verifyAuth } from './store.js'

const DATE_FMT = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
function fmtDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return DATE_FMT.format(new Date(y, m - 1, d))
}

function TeamLabel({ id, mute, hideName, fallback }) {
  if (!id) return <span className="muted small">{fallback || '— TBD —'}</span>
  const t = TEAMS[id]
  return (
    <span style={{ opacity: mute ? 0.6 : 1 }} title={t.name}>
      <span className="flag">{t.flag}</span>{!hideName && t.name}{hideName && <span className="muted small">{id}</span>}
    </span>
  )
}

// Generic Groups view. mode='score' shows numeric inputs only.
// mode='pick' shows W/D/L buttons + optional score inputs.
function GroupsView({ results, setResults, mode = 'score' }) {
  const standings = useMemo(() => allGroupStandings(results), [results])
  // 8 best-3rd qualifiers, only resolved when all 12 groups complete.
  const qualifiedThirds = useMemo(() => {
    const adv = advancingTeams(standings)
    const set = new Set()
    if (adv.length === 32) adv.slice(24).forEach(t => set.add(t.team))
    return set
  }, [standings])
  // Collapsed groups (mobile UX). Default: all collapsed. CSS forces body
  // visible on desktop regardless.
  const [closed, setClosed] = useState(() => new Set(GROUP_KEYS))
  const toggle = g => setClosed(prev => {
    const next = new Set(prev)
    if (next.has(g)) next.delete(g); else next.add(g)
    return next
  })
  const setScore = (key, side, val) => {
    const v = val === '' ? null : Math.max(0, parseInt(val, 10) || 0)
    const cur = results[key] || { home: null, away: null }
    setResults({ ...results, [key]: { ...cur, [side]: v } })
  }
  const setOutcome = (key, h, a, outcome) => {
    let home, away
    if (outcome === 'H') { home = 1; away = 0 }
    else if (outcome === 'A') { home = 0; away = 1 }
    else { home = 1; away = 1 }
    setResults({ ...results, [key]: { home, away } })
  }
  return (
    <div className="grid">
      {GROUP_KEYS.map(g => {
        const sched = groupSchedule(g)
        const s = standings[g]
        const isClosed = closed.has(g)
        return (
          <div className={`card group-card ${isClosed ? 'closed' : ''}`} key={g}>
            <button className="group-header" onClick={() => toggle(g)} aria-expanded={!isClosed}>
              <h3>Group {g}</h3>
              <div className="group-flags">
                {GROUPS[g].map(t => <span key={t} className="flag">{TEAMS[t].flag}</span>)}
              </div>
              <span className="group-chevron">{isClosed ? '▸' : '▾'}</span>
            </button>
            <div className="group-body">
            <table className="standings">
              <thead>
                <tr><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr>
              </thead>
              <tbody>
                {s.map((row, i) => {
                  const cls = i < 2 ? 'qual'
                    : (i === 2 && qualifiedThirds.has(row.team)) ? 'qual-third'
                    : ''
                  return (
                  <tr key={row.team} className={cls}>
                    <td><TeamLabel id={row.team} /></td>
                    <td>{row.P}</td><td>{row.W}</td><td>{row.D}</td><td>{row.L}</td>
                    <td>{row.GD > 0 ? `+${row.GD}` : row.GD}</td>
                    <td><b>{row.Pts}</b></td>
                  </tr>
                )})}
              </tbody>
            </table>
            <div style={{ marginTop: 12 }}>
              {sched.map((m, idx) => {
                const { home: h, away: a, date, city } = m
                const key = `${g}-${idx}`
                const r = results[key] || {}
                const outcome = r.home == null || r.away == null ? null
                  : r.home > r.away ? 'H' : r.home < r.away ? 'A' : 'D'
                return (
                  <div key={key} style={{ paddingBottom: 8, borderBottom: '1px solid var(--line)', marginBottom: 8 }}>
                    <div className="matchmeta">
                      <span><span className="muted small">M{m.match}</span> · {fmtDate(date)}</span>
                      <span className="muted">{city}{VENUES[city] ? ` · ${VENUES[city]}` : ''}</span>
                    </div>
                    <div className="match" style={{ border: 'none', padding: 0 }}>
                      <div className="home"><TeamLabel id={h} /></div>
                      <div className="score">
                        <input type="number" min="0" value={r.home ?? ''}
                          onChange={e => setScore(key, 'home', e.target.value)} />
                        <span className="dash">–</span>
                        <input type="number" min="0" value={r.away ?? ''}
                          onChange={e => setScore(key, 'away', e.target.value)} />
                      </div>
                      <div className="away"><TeamLabel id={a} /></div>
                    </div>
                    {mode === 'pick' && (
                      <div style={{ display: 'flex', gap: 4, marginTop: 4, justifyContent: 'center' }}>
                        <button className={`pickbtn ${outcome === 'H' ? 'on' : ''}`} onClick={() => setOutcome(key, h, a, 'H')}>{TEAMS[h].flag} win</button>
                        <button className={`pickbtn ${outcome === 'D' ? 'on' : ''}`} onClick={() => setOutcome(key, h, a, 'D')}>Draw</button>
                        <button className={`pickbtn ${outcome === 'A' ? 'on' : ''}`} onClick={() => setOutcome(key, h, a, 'A')}>{TEAMS[a].flag} win</button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ScheduleView({ results, ko }) {
  const list = useMemo(() => allMatchesSequential(), [])
  const [filter, setFilter] = useState('all') // 'all' | 'group' | 'ko'
  const getScore = m => {
    if (m.home && m.away) {
      // group-stage; look up via per-group idx
      const sched = groupSchedule(m.round.slice(-1))
      const idx = sched.findIndex(s => s.match === m.match)
      const r = results[`${m.round.slice(-1)}-${idx}`]
      return r && r.home != null && r.away != null ? `${r.home}-${r.away}` : ''
    }
    // KO: koResults keyed by round-idx. Determine round + idx from match number.
    const n = m.match
    let round, idx
    if (n >= 73 && n <= 88) { round = 'r32'; idx = n - 73 }
    else if (n >= 89 && n <= 96) { round = 'r16'; idx = n - 89 }
    else if (n >= 97 && n <= 100) { round = 'qf'; idx = n - 97 }
    else if (n >= 101 && n <= 102) { round = 'sf'; idx = n - 101 }
    else if (n === 103) { round = 'bronze'; idx = 0 }
    else if (n === 104) { round = 'final'; idx = 0 }
    else return ''
    const r = ko[`${round}-${idx}`]
    return r && r.home != null && r.away != null ? `${r.home}-${r.away}` : ''
  }
  const rows = list.filter(m => {
    if (filter === 'group') return m.match <= 72
    if (filter === 'ko') return m.match > 72
    return true
  })
  return (
    <div>
      <div className="actions">
        <button className={filter === 'all' ? 'primary' : ''} onClick={() => setFilter('all')}>All ({list.length})</button>
        <button className={filter === 'group' ? 'primary' : ''} onClick={() => setFilter('group')}>Group (72)</button>
        <button className={filter === 'ko' ? 'primary' : ''} onClick={() => setFilter('ko')}>Knockout (32)</button>
      </div>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="standings" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>#</th>
              <th style={{ textAlign: 'left' }}>Date</th>
              <th style={{ textAlign: 'left' }}>Round</th>
              <th style={{ textAlign: 'right' }}>Home</th>
              <th>Score</th>
              <th style={{ textAlign: 'left' }}>Away</th>
              <th style={{ textAlign: 'left' }}>Venue</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(m => (
              <tr key={m.match}>
                <td><b>M{m.match}</b></td>
                <td>{fmtDate(m.date)}</td>
                <td className="muted small">{m.round}</td>
                <td style={{ textAlign: 'right' }}>
                  {m.home ? <TeamLabel id={m.home} /> : <span className="muted small">{m.homeLabel}</span>}
                </td>
                <td style={{ textAlign: 'center', fontFamily: 'monospace' }}>{getScore(m) || '—'}</td>
                <td>
                  {m.away ? <TeamLabel id={m.away} /> : <span className="muted small">{m.awayLabel}</span>}
                </td>
                <td className="muted small">{m.city}{VENUES[m.city] ? ` · ${VENUES[m.city]}` : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function KoMatch({ round, idx, homeId, awayId, homeLabel, awayLabel, ko, setKo, allowQuickPick, density = 'full' }) {
  const key = `${round}-${idx}`
  const stored = ko[key]
  // Stale guard: only use stored entry when its teams match current pair.
  const r = (stored && stored.homeId === homeId && stored.awayId === awayId) ? stored : {}
  const setScore = (side, val) => {
    const v = val === '' ? null : Math.max(0, parseInt(val, 10) || 0)
    setKo({ ...ko, [key]: { ...r, homeId, awayId, [side]: v } })
  }
  const setPenWinner = id => setKo({ ...ko, [key]: { ...r, homeId, awayId, penWinner: id } })
  const winnerSide = (() => {
    if (r.home == null || r.away == null) return null
    if (r.home > r.away) return 'h'
    if (r.away > r.home) return 'a'
    return r.penWinner === homeId ? 'h' : r.penWinner === awayId ? 'a' : null
  })()
  const quickPick = id => {
    const side = id === homeId ? 'h' : 'a'
    // Toggle off: clicking ✓ on the currently-winning side clears the match
    // entirely (scores + penWinner), reverting to unselected state.
    if (winnerSide === side) {
      const next = { ...ko }
      delete next[key]
      setKo(next)
      return
    }
    if (id === homeId) setKo({ ...ko, [key]: { homeId, awayId, home: 1, away: 0 } })
    else setKo({ ...ko, [key]: { homeId, awayId, home: 0, away: 1 } })
  }
  const meta = KO_SCHEDULE[round]?.[idx]
  const homeCls = winnerSide === 'h' ? 'winner' : winnerSide === 'a' ? 'loser' : ''
  const awayCls = winnerSide === 'a' ? 'winner' : winnerSide === 'h' ? 'loser' : ''
  const showMeta = density !== 'minimal'
  const showStadium = density === 'full'
  const flagsOnly = density === 'minimal'
  return (
    <div className="koMatch">
      {showMeta && meta && (
        <div className="matchmeta" style={{ marginBottom: 6 }}>
          <span>{meta.match ? <><span className="muted small">M{meta.match}</span> · </> : null}{fmtDate(meta.date)}</span>
          <span className="muted">{meta.city}{showStadium && VENUES[meta.city] ? ` · ${VENUES[meta.city]}` : ''}</span>
        </div>
      )}
      {!showMeta && meta && (
        <div className="matchmeta" style={{ marginBottom: 4 }}>
          <span>{meta.match ? <><span className="muted small">M{meta.match}</span> · </> : null}{fmtDate(meta.date)}</span>
        </div>
      )}
      <div className={`row ${homeCls}`}>
        <span>
          {allowQuickPick && homeId && (
            <button className={`picktiny ${winnerSide === 'h' ? 'on' : ''}`}
              onClick={() => quickPick(homeId)} title="Pick winner">{winnerSide === 'h' ? '✓' : ''}</button>
          )}
          <TeamLabel id={homeId} hideName={flagsOnly} fallback={homeLabel} />
        </span>
        <input type="number" min="0" disabled={!homeId} value={r.home ?? ''}
          onChange={e => setScore('home', e.target.value)} />
      </div>
      <div className={`row ${awayCls}`}>
        <span>
          {allowQuickPick && awayId && (
            <button className={`picktiny ${winnerSide === 'a' ? 'on' : ''}`}
              onClick={() => quickPick(awayId)} title="Pick winner">{winnerSide === 'a' ? '✓' : ''}</button>
          )}
          <TeamLabel id={awayId} hideName={flagsOnly} fallback={awayLabel} />
        </span>
        <input type="number" min="0" disabled={!awayId} value={r.away ?? ''}
          onChange={e => setScore('away', e.target.value)} />
      </div>
      {r.home != null && r.away != null && r.home === r.away && homeId && awayId && (
        <div className="small muted" style={{ marginTop: 4 }}>
          PK winner:
          <button style={{ marginLeft: 4, padding: '1px 6px', fontSize: 11 }} onClick={() => setPenWinner(homeId)}>{TEAMS[homeId].flag}</button>
          <button style={{ marginLeft: 2, padding: '1px 6px', fontSize: 11 }} onClick={() => setPenWinner(awayId)}>{TEAMS[awayId].flag}</button>
        </div>
      )}
    </div>
  )
}

const DENSITY_OPTIONS = [
  { value: 'full', title: 'Full view', caption: 'Date, city and stadium' },
  { value: 'compact', title: 'Compact view', caption: 'Date and city' },
  { value: 'minimal', title: 'Minimal view', caption: 'Date and flags only' }
]

function DensityDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = React.useRef(null)
  useEffect(() => {
    if (!open) return
    const onClick = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])
  const current = DENSITY_OPTIONS.find(o => o.value === value) || DENSITY_OPTIONS[0]
  return (
    <div className="dd" ref={ref}>
      <button className="dd-trigger" onClick={() => setOpen(o => !o)}>
        {current.title} <span className="dd-arrow">▾</span>
      </button>
      {open && (
        <div className="dd-menu">
          {DENSITY_OPTIONS.map(o => (
            <button key={o.value} className={`dd-item ${o.value === value ? 'active' : ''}`}
              onClick={() => { onChange(o.value); setOpen(false) }}>
              <div className="dd-item-title">{o.title}</div>
              <div className="dd-item-caption">{o.caption}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function BracketView({ results, ko, setKo, allowQuickPick = false, blurb }) {
  const b = useMemo(() => computeBracket(results, ko), [results, ko])
  const [density, setDensity] = useState('compact')
  const [fullscreen, setFullscreen] = useState(false)
  useEffect(() => {
    if (!fullscreen) return
    const onKey = e => { if (e.key === 'Escape') setFullscreen(false) }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [fullscreen])
  const km = (round, i, p) => (
    <KoMatch key={`${round}-${i}`} round={round} idx={i} homeId={p[0]} awayId={p[1]}
      homeLabel={koSlotLabel(round, i, 0)} awayLabel={koSlotLabel(round, i, 1)}
      ko={ko} setKo={setKo} allowQuickPick={allowQuickPick} density={density} />
  )
  const ChampCard = b.champ ? (
    <div className="card" style={{ marginTop: 8, textAlign: 'center' }}>
      <h3>Champion</h3>
      <div style={{ fontSize: 18, fontWeight: 600 }}>
        <TeamLabel id={b.champ} />
      </div>
    </div>
  ) : null

  return (
    <div>
      <div className="actions" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        {blurb ? <span className="small muted" style={{ flex: 1, textAlign: 'left' }}>{blurb}</span> : <span style={{ flex: 1 }} />}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <DensityDropdown value={density} onChange={setDensity} />
          <button className="icon-btn" onClick={() => setFullscreen(true)} title="Open centered bracket fullscreen" aria-label="Open centered bracket fullscreen">⤢</button>
        </div>
      </div>

      <div className="bracket-wrap">
        <div className="bracket">
          <div className="round">
            <h4>Round of 32</h4>
            <div className="round-body round-r32">{b.r32Pairs.map((p, i) => km('r32', i, p))}</div>
          </div>
          <div className="round">
            <h4>Round of 16</h4>
            <div className="round-body round-r16">{b.r16Pairs.map((p, i) => km('r16', i, p))}</div>
          </div>
          <div className="round">
            <h4>Quarterfinals</h4>
            <div className="round-body round-qf">{b.qfPairs.map((p, i) => km('qf', i, p))}</div>
          </div>
          <div className="round">
            <h4>Semifinals</h4>
            <div className="round-body round-sf">{b.sfPairs.map((p, i) => km('sf', i, p))}</div>
          </div>
          <div className="round">
            <h4>Final</h4>
            <div className="round-body round-final">
              {km('final', 0, b.finalPair)}
              {ChampCard}
              <div className="bronze-sep">3rd-place</div>
              {km('bronze', 0, b.bronzePair)}
              {b.bronze && (
                <div className="bronze-chip"><span className="muted small">🥉</span> <TeamLabel id={b.bronze} /></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {fullscreen && (
        <div className="bracket-modal" onClick={e => { if (e.target === e.currentTarget) setFullscreen(false) }}>
          <div className="bracket-modal-inner">
            <div className="bracket-modal-header">
              <h2>Centered Bracket — {b.champ ? <>🏆 <TeamLabel id={b.champ} /></> : 'TBD'}</h2>
              <button className="close-btn" onClick={() => setFullscreen(false)}>Close (Esc)</button>
            </div>
            <div className="bracket-modal-body">
              <div className="bracket centered">
                <div className="round">
                  <h4>Round of 32</h4>
                  <div className="round-body">{b.r32Pairs.slice(0, 8).map((p, i) => km('r32', i, p))}</div>
                </div>
                <div className="round">
                  <h4>Round of 16</h4>
                  <div className="round-body">{b.r16Pairs.slice(0, 4).map((p, i) => km('r16', i, p))}</div>
                </div>
                <div className="round">
                  <h4>Quarterfinals</h4>
                  <div className="round-body">{b.qfPairs.slice(0, 2).map((p, i) => km('qf', i, p))}</div>
                </div>
                <div className="round">
                  <h4>Semifinal</h4>
                  <div className="round-body">{km('sf', 0, b.sfPairs[0])}</div>
                </div>
                <div className="round center-col">
                  <h4 style={{ textAlign: 'center' }}>Final</h4>
                  <div className="round-body">
                    {km('final', 0, b.finalPair)}
                    {ChampCard}
                    <div className="bronze-sep">3rd-place</div>
                    {km('bronze', 0, b.bronzePair)}
                    {b.bronze && (
                      <div className="bronze-chip"><span className="muted small">🥉</span> <TeamLabel id={b.bronze} /></div>
                    )}
                  </div>
                </div>
                <div className="round">
                  <h4>Semifinal</h4>
                  <div className="round-body">{km('sf', 1, b.sfPairs[1])}</div>
                </div>
                <div className="round">
                  <h4>Quarterfinals</h4>
                  <div className="round-body">{b.qfPairs.slice(2, 4).map((p, i) => km('qf', i + 2, p))}</div>
                </div>
                <div className="round">
                  <h4>Round of 16</h4>
                  <div className="round-body">{b.r16Pairs.slice(4, 8).map((p, i) => km('r16', i + 4, p))}</div>
                </div>
                <div className="round">
                  <h4>Round of 32</h4>
                  <div className="round-body">{b.r32Pairs.slice(8, 16).map((p, i) => km('r32', i + 8, p))}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Probabilities({ results }) {
  const [probs, setProbs] = useState(null)
  const [running, setRunning] = useState(false)
  const [N, setN] = useState(2000)
  const run = () => {
    setRunning(true)
    setTimeout(() => {
      const p = runMonteCarlo(results, N)
      setProbs(p)
      setRunning(false)
    }, 20)
  }
  const rows = probs
    ? Object.entries(probs)
        .map(([id, v]) => ({ id, ...v }))
        .sort((a, b) => b.champ - a.champ || b.final - a.final)
    : null
  return (
    <div>
      <div className="actions">
        <button className="primary" onClick={run} disabled={running}>
          {running ? 'Simulating…' : `Run ${N.toLocaleString()} simulations`}
        </button>
        <select value={N} onChange={e => setN(parseInt(e.target.value, 10))}
          style={{ padding: '6px 8px', border: '1px solid var(--line)', borderRadius: 6, background: 'var(--card)' }}>
          <option value={500}>500</option>
          <option value={2000}>2,000</option>
          <option value={5000}>5,000</option>
          <option value={10000}>10,000</option>
        </select>
        <span className="small muted" style={{ alignSelf: 'center' }}>
          Sim respects entered Groups results; unplayed matches randomized via simulation.
        </span>
      </div>
      {!rows && <div className="muted">Run simulation to see win probabilities.</div>}
      {rows && (
        <div className="card">
          <table className="prob-table">
            <thead>
              <tr><th>Team</th><th>R16</th><th>QF</th><th>SF</th><th>Final</th><th>Champion</th></tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td><TeamLabel id={r.id} /></td>
                  <td>{(r.r16 * 100).toFixed(1)}%</td>
                  <td>{(r.qf * 100).toFixed(1)}%</td>
                  <td>{(r.sf * 100).toFixed(1)}%</td>
                  <td>{(r.final * 100).toFixed(1)}%</td>
                  <td>
                    <span className="bar" style={{ width: Math.max(2, r.champ * 200) }}></span>
                    {(r.champ * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function Expectations({ state, setState, saveStatus, doSave }) {
  const [sub, setSub] = useState('groups') // 'groups' | 'bracket'
  const setExpectResults = r => setState({ ...state, expect: { ...state.expect, results: r } })
  const setExpectKo = k => setState({ ...state, expect: { ...state.expect, ko: k } })
  const b = useMemo(() => computeBracket(state.expect.results, state.expect.ko), [state.expect])
  const groupDone = Object.keys(state.expect.results).filter(k => {
    const r = state.expect.results[k]
    return r && r.home != null && r.away != null
  }).length
  return (
    <div>
      <TabBar saveStatus={saveStatus} doSave={doSave}>
        <span className="small muted">Enter your predictions to simulate your bracket.</span>
      </TabBar>
      <div className="actions">
        <button className={sub === 'groups' ? 'primary' : ''} onClick={() => setSub('groups')}>Group picks ({groupDone}/72)</button>
        <button className={sub === 'bracket' ? 'primary' : ''} onClick={() => setSub('bracket')}>My bracket{b.champ ? ` · 🏆 ${TEAMS[b.champ].flag}` : ''}</button>
        <button onClick={() => { if (confirm('Clear group-stage predictions?')) setState({ ...state, expect: { ...state.expect, results: {} } }) }}>Clear group picks</button>
        <button onClick={() => { if (confirm('Clear bracket predictions?')) setState({ ...state, expect: { ...state.expect, ko: {} } }) }}>Clear bracket picks</button>
      </div>
      {sub === 'groups' && (
        <GroupsView results={state.expect.results} setResults={setExpectResults} mode="pick" />
      )}
      {sub === 'bracket' && (
        <BracketView
          results={state.expect.results}
          ko={state.expect.ko}
          setKo={setExpectKo}
          allowQuickPick={true}
          blurb="Auto-built from your group picks. Click ✓ next to a team to pick KO winners, or enter scorelines."
        />
      )}
    </div>
  )
}

function Advancing({ results }) {
  const standings = useMemo(() => allGroupStandings(results), [results])
  const adv = useMemo(() => advancingTeams(standings), [standings])
  if (adv.length === 0) return null
  return (
    <div className="card" style={{ marginTop: 20 }}>
      <h3>Advancing ({adv.length}/32)</h3>
      <div className="small" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 4 }}>
        {adv.map((a, i) => (
          <div key={a.team}><span className="muted">{i + 1}.</span> <TeamLabel id={a.team} /> <span className="muted">({a.Pts}pts)</span></div>
        ))}
      </div>
    </div>
  )
}

function SaveControl({ status, onSave }) {
  const label = {
    idle: '✓ Saved',
    dirty: 'Save progress',
    saving: 'Saving…',
    saved: '✓ Saved',
    error: '✗ Retry save'
  }[status]
  const disabled = status === 'idle' || status === 'saving' || status === 'saved'
  return (
    <button onClick={onSave} disabled={disabled}
      className={`save-btn save-${status}`}
      title={status === 'dirty' ? 'Unsaved changes — click to save now (auto-saves in 8s)' : status === 'error' ? 'Last save failed — click to retry' : 'All changes saved'}
    >
      {label}
    </button>
  )
}

function TabBar({ children, saveStatus, doSave }) {
  return (
    <div className="tab-bar">
      <div className="tab-bar-left">{children}</div>
      <SaveControl status={saveStatus} onSave={doSave} />
    </div>
  )
}

function Login({ onLogin }) {
  const [name, setName] = useState('')
  const [passcode, setPasscode] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const submit = async e => {
    e.preventDefault()
    setErr(null)
    setBusy(true)
    const auth = { name: name.trim(), passcode: passcode.trim() }
    const ok = await verifyAuth(auth)
    setBusy(false)
    if (!ok) { setErr('Invalid name or passcode.'); return }
    saveAuth(auth)
    onLogin(auth)
  }
  return (
    <div className="app" style={{ maxWidth: 380, marginTop: 80 }}>
      <header className="top" style={{ display: 'block', textAlign: 'center', borderBottom: 'none' }}>
        <h1 style={{ fontSize: 22 }}>FIFA World Cup 2026</h1>
        <div className="sub" style={{ marginTop: 4 }}>🇺🇸 🇨🇦 🇲🇽 Tracker</div>
      </header>
      <form onSubmit={submit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
        <h3>Sign in</h3>
        <label className="small muted">Your name
          <input value={name} onChange={e => setName(e.target.value)} required autoFocus
            style={{ width: '100%', padding: 8, border: '1px solid var(--line)', borderRadius: 6, marginTop: 4, fontFamily: 'inherit', fontSize: 14 }} />
        </label>
        <label className="small muted">Passcode
          <input type="password" value={passcode} onChange={e => setPasscode(e.target.value)} required
            style={{ width: '100%', padding: 8, border: '1px solid var(--line)', borderRadius: 6, marginTop: 4, fontFamily: 'inherit', fontSize: 14 }} />
        </label>
        {err && <div className="small" style={{ color: 'var(--bad)' }}>{err}</div>}
        <button type="submit" className="primary" disabled={busy}
          style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, marginTop: 4 }}>
          {busy ? 'Checking…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

export default function App() {
  const [auth, setAuth] = useState(loadAuth)
  const [state, setState] = useState(EMPTY_STATE)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('results')
  const [resultsSub, setResultsSub] = useState('groups')
  const [saveStatus, setSaveStatus] = useState('idle') // 'idle' | 'dirty' | 'saving' | 'saved' | 'error'
  const skipNextSave = useRef(true)
  const saveTimer = useRef(null)

  const doSave = async () => {
    if (!auth) return
    setSaveStatus('saving')
    try {
      await putState(auth, state)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(s => s === 'saved' ? 'idle' : s), 2000)
    } catch (err) {
      console.error('save failed', err)
      setSaveStatus('error')
    }
  }

  // Load state on auth change
  useEffect(() => {
    if (!auth) { setLoading(false); return }
    let cancelled = false
    setLoading(true)
    fetchState(auth).then(s => {
      if (cancelled) return
      skipNextSave.current = true
      setState(s)
      setLoading(false)
    }).catch(() => {
      if (cancelled) return
      // Auth failed — clear and re-prompt
      saveAuth(null)
      setAuth(null)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [auth])

  // Debounced auto-save (safety net) — long delay since manual Save is primary.
  useEffect(() => {
    if (!auth || loading) return
    if (skipNextSave.current) { skipNextSave.current = false; return }
    setSaveStatus('dirty')
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => { doSave() }, 8000)
    return () => clearTimeout(saveTimer.current)
  }, [state, auth, loading])

  // Warn on tab close if unsaved.
  useEffect(() => {
    if (saveStatus !== 'dirty' && saveStatus !== 'saving') return
    const handler = e => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [saveStatus])

  if (!auth) return <Login onLogin={setAuth} />
  if (loading) return <div className="app"><div className="muted">Loading…</div></div>

  const signOut = () => { saveAuth(null); setAuth(null); setState(EMPTY_STATE) }

  const resetAll = () => {
    if (confirm('Reset actual results & bracket? (Expectations untouched)')) {
      setState({ ...state, results: {}, ko: {} })
    }
  }

  const autoFill = () => {
    if (!confirm('Auto-fill all actual group results with simulation?')) return
    const next = { ...state.results }
    GROUP_KEYS.forEach(k => {
      groupMatches(k).forEach(([h, a], idx) => {
        const key = `${k}-${idx}`
        if (!next[key] || next[key].home == null) {
          const dh = TEAMS[h].elo, da = TEAMS[a].elo
          const d = dh - da
          const lh = Math.max(0.3, 1.45 + d / 220)
          const la = Math.max(0.3, 1.45 - d / 220)
          const sample = lam => {
            let L = Math.exp(-lam), p = 1, k = 0
            do { k++; p *= Math.random() } while (p > L)
            return k - 1
          }
          next[key] = { home: sample(lh), away: sample(la) }
        }
      })
    })
    setState({ ...state, results: next })
  }

  const setResults = r => setState({ ...state, results: r })
  const setKo = k => setState({ ...state, ko: k })

  return (
    <div className="app">
      <header className="top">
        <h1>FIFA World Cup 2026</h1>
        <span className="sub" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>🇺🇸 🇨🇦 🇲🇽</span>
          <span>·</span>
          <span>{auth.name}</span>
          <button onClick={signOut}
            style={{ background: 'none', border: '1px solid var(--line)', padding: '2px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer', color: 'var(--muted)', fontFamily: 'inherit' }}>
            Sign out
          </button>
        </span>
      </header>
      <nav className="tabs">
        <button className={tab === 'results' ? 'active' : ''} onClick={() => setTab('results')}>Results</button>
        <button className={tab === 'probs' ? 'active' : ''} onClick={() => setTab('probs')}>Probabilities</button>
        <button className={tab === 'predict' ? 'active' : ''} onClick={() => setTab('predict')}>My Predictions</button>
      </nav>
      {tab === 'results' && (
        <>
          <TabBar saveStatus={saveStatus} doSave={doSave}>
            <span className="small muted">Enter actual game results here as matches are played. For your own picks, use the My Predictions tab.</span>
          </TabBar>
          <nav className="tabs sub">
            <button className={resultsSub === 'groups' ? 'active' : ''} onClick={() => setResultsSub('groups')}>Groups</button>
            <button className={resultsSub === 'bracket' ? 'active' : ''} onClick={() => setResultsSub('bracket')}>Bracket</button>
            <button className={resultsSub === 'schedule' ? 'active' : ''} onClick={() => setResultsSub('schedule')}>All Matches</button>
          </nav>
          {resultsSub === 'groups' && (
            <>
              <div className="actions">
                <button onClick={autoFill}>Auto-fill with simulation</button>
                <button onClick={resetAll}>Reset</button>
              </div>
              <GroupsView results={state.results} setResults={setResults} mode="score" />
            </>
          )}
          {resultsSub === 'bracket' && (
            <BracketView
              results={state.results}
              ko={state.ko}
              setKo={setKo}
              allowQuickPick={true}
              blurb="Bracket fills as actual Groups results are entered. Click ✓ to advance via knockout."
            />
          )}
          {resultsSub === 'schedule' && (
            <ScheduleView results={state.results} ko={state.ko} />
          )}
        </>
      )}
      {tab === 'probs' && <Probabilities results={state.results} />}
      {tab === 'predict' && <Expectations state={state} setState={setState} saveStatus={saveStatus} doSave={doSave} />}
    </div>
  )
}
