import React, { useState, useEffect, useMemo } from 'react'
import { TEAMS, GROUPS, GROUP_KEYS, groupMatches, groupSchedule, VENUES, KO_SCHEDULE } from './data.js'
import { allGroupStandings, advancingTeams, computeBracket, runMonteCarlo } from './sim.js'

const STORE_KEY = 'fifawc26-v3'

const DATE_FMT = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
function fmtDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return DATE_FMT.format(new Date(y, m - 1, d))
}

const EMPTY_EXPECT = { results: {}, ko: {} }
function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return { results: {}, ko: {}, expect: { ...EMPTY_EXPECT } }
    const s = JSON.parse(raw)
    return { results: {}, ko: {}, expect: { ...EMPTY_EXPECT }, ...s, expect: { ...EMPTY_EXPECT, ...(s.expect || {}) } }
  } catch { return { results: {}, ko: {}, expect: { ...EMPTY_EXPECT } } }
}
function saveState(s) { localStorage.setItem(STORE_KEY, JSON.stringify(s)) }

function TeamLabel({ id, mute, hideName }) {
  if (!id) return <span className="muted small">— TBD —</span>
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
        return (
          <div className="card" key={g}>
            <h3>Group {g}</h3>
            <table className="standings">
              <thead>
                <tr><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr>
              </thead>
              <tbody>
                {s.map((row, i) => (
                  <tr key={row.team} className={i < 2 ? 'qual' : i === 2 ? 'qual-third' : ''}>
                    <td><TeamLabel id={row.team} /></td>
                    <td>{row.P}</td><td>{row.W}</td><td>{row.D}</td><td>{row.L}</td>
                    <td>{row.GD > 0 ? `+${row.GD}` : row.GD}</td>
                    <td><b>{row.Pts}</b></td>
                  </tr>
                ))}
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
                      <span>{fmtDate(date)}</span>
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
        )
      })}
    </div>
  )
}

function KoMatch({ round, idx, homeId, awayId, ko, setKo, allowQuickPick, density = 'full' }) {
  const key = `${round}-${idx}`
  const stored = ko[key]
  // Stale guard: only use stored entry when its teams match current pair.
  const r = (stored && stored.homeId === homeId && stored.awayId === awayId) ? stored : {}
  const setScore = (side, val) => {
    const v = val === '' ? null : Math.max(0, parseInt(val, 10) || 0)
    setKo({ ...ko, [key]: { ...r, homeId, awayId, [side]: v } })
  }
  const setPenWinner = id => setKo({ ...ko, [key]: { ...r, homeId, awayId, penWinner: id } })
  const quickPick = id => {
    if (id === homeId) setKo({ ...ko, [key]: { homeId, awayId, home: 1, away: 0 } })
    else setKo({ ...ko, [key]: { homeId, awayId, home: 0, away: 1 } })
  }
  const winnerSide = (() => {
    if (r.home == null || r.away == null) return null
    if (r.home > r.away) return 'h'
    if (r.away > r.home) return 'a'
    return r.penWinner === homeId ? 'h' : r.penWinner === awayId ? 'a' : null
  })()
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
          <span>{fmtDate(meta.date)}</span>
          <span className="muted">{meta.city}{showStadium && VENUES[meta.city] ? ` · ${VENUES[meta.city]}` : ''}</span>
        </div>
      )}
      {!showMeta && meta && (
        <div className="matchmeta" style={{ marginBottom: 4, justifyContent: 'center' }}>
          <span>{fmtDate(meta.date)}</span>
        </div>
      )}
      <div className={`row ${homeCls}`}>
        <span>
          {allowQuickPick && homeId && (
            <button className={`picktiny ${winnerSide === 'h' ? 'on' : ''}`}
              onClick={() => quickPick(homeId)} title="Pick winner">{winnerSide === 'h' ? '✓' : ''}</button>
          )}
          <TeamLabel id={homeId} hideName={flagsOnly} />
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
          <TeamLabel id={awayId} hideName={flagsOnly} />
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
            {b.r32Pairs.map((p, i) => km('r32', i, p))}
          </div>
          <div className="round">
            <h4>Round of 16</h4>
            {b.r16Pairs.map((p, i) => km('r16', i, p))}
          </div>
          <div className="round">
            <h4>Quarterfinals</h4>
            {b.qfPairs.map((p, i) => km('qf', i, p))}
          </div>
          <div className="round">
            <h4>Semifinals</h4>
            {b.sfPairs.map((p, i) => km('sf', i, p))}
          </div>
          <div className="round">
            <h4>Final</h4>
            {km('final', 0, b.finalPair)}
            {ChampCard}
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
                  {b.r32Pairs.slice(0, 8).map((p, i) => km('r32', i, p))}
                </div>
                <div className="round">
                  <h4>Round of 16</h4>
                  {b.r16Pairs.slice(0, 4).map((p, i) => km('r16', i, p))}
                </div>
                <div className="round">
                  <h4>Quarterfinals</h4>
                  {b.qfPairs.slice(0, 2).map((p, i) => km('qf', i, p))}
                </div>
                <div className="round">
                  <h4>Semifinal</h4>
                  {km('sf', 0, b.sfPairs[0])}
                </div>
                <div className="round center-col">
                  <h4 style={{ textAlign: 'center' }}>Final</h4>
                  {km('final', 0, b.finalPair)}
                  {ChampCard}
                </div>
                <div className="round">
                  <h4>Semifinal</h4>
                  {km('sf', 1, b.sfPairs[1])}
                </div>
                <div className="round">
                  <h4>Quarterfinals</h4>
                  {b.qfPairs.slice(2, 4).map((p, i) => km('qf', i + 2, p))}
                </div>
                <div className="round">
                  <h4>Round of 16</h4>
                  {b.r16Pairs.slice(4, 8).map((p, i) => km('r16', i + 4, p))}
                </div>
                <div className="round">
                  <h4>Round of 32</h4>
                  {b.r32Pairs.slice(8, 16).map((p, i) => km('r32', i + 8, p))}
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
          Sim respects entered Groups results; unplayed matches randomized via Elo.
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

function Expectations({ state, setState }) {
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
      <div className="small muted" style={{ marginBottom: 12 }}>
       Enter your predictions to simulate your bracket.
      </div>
      <div className="actions">
        <button className={sub === 'groups' ? 'primary' : ''} onClick={() => setSub('groups')}>Group picks ({groupDone}/72)</button>
        <button className={sub === 'bracket' ? 'primary' : ''} onClick={() => setSub('bracket')}>My bracket{b.champ ? ` · 🏆 ${TEAMS[b.champ].flag}` : ''}</button>
        <button onClick={() => { if (confirm('Clear all expectations?')) setState({ ...state, expect: { results: {}, ko: {} } }) }}>Clear expectations</button>
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

export default function App() {
  const [state, setState] = useState(loadState)
  const [tab, setTab] = useState('results')
  const [resultsSub, setResultsSub] = useState('groups')

  useEffect(() => { saveState(state) }, [state])

  const resetAll = () => {
    if (confirm('Reset actual results & bracket? (Expectations untouched)')) {
      setState({ ...state, results: {}, ko: {} })
    }
  }

  const autoFill = () => {
    if (!confirm('Auto-fill all actual group results with Elo-based simulation?')) return
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
        <span className="sub">🇺🇸 🇨🇦 🇲🇽 · 48 teams · 12 groups</span>
      </header>
      <nav className="tabs">
        <button className={tab === 'results' ? 'active' : ''} onClick={() => setTab('results')}>Results</button>
        <button className={tab === 'probs' ? 'active' : ''} onClick={() => setTab('probs')}>Probabilities</button>
        <button className={tab === 'predict' ? 'active' : ''} onClick={() => setTab('predict')}>My Predictions</button>
      </nav>
      {tab === 'results' && (
        <>
          <div className="small muted" style={{ marginBottom: 24 }}>
            Enter actual game results here as matches are played. For your own picks, use the My Predictions tab.
          </div>
          <nav className="tabs sub">
            <button className={resultsSub === 'groups' ? 'active' : ''} onClick={() => setResultsSub('groups')}>Groups</button>
            <button className={resultsSub === 'bracket' ? 'active' : ''} onClick={() => setResultsSub('bracket')}>Bracket</button>
          </nav>
          {resultsSub === 'groups' && (
            <>
              <div className="actions">
                <button onClick={autoFill}>Auto-fill actual results</button>
                <button onClick={resetAll}>Reset actual</button>
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
        </>
      )}
      {tab === 'probs' && <Probabilities results={state.results} />}
      {tab === 'predict' && <Expectations state={state} setState={setState} />}
    </div>
  )
}
