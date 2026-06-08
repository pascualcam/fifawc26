// FIFA WC 2026 — 48 teams, 12 groups (A-L) per official Final Draw (Dec 5, 2025).
// Top 2 + 8 best 3rd-place teams advance to Round of 32.

export const TEAMS = {
  ARG: { name: 'Argentina', flag: '🇦🇷', elo: 2140 },
  FRA: { name: 'France', flag: '🇫🇷', elo: 2080 },
  ESP: { name: 'Spain', flag: '🇪🇸', elo: 2070 },
  BRA: { name: 'Brazil', flag: '🇧🇷', elo: 2030 },
  ENG: { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', elo: 2010 },
  POR: { name: 'Portugal', flag: '🇵🇹', elo: 1980 },
  NED: { name: 'Netherlands', flag: '🇳🇱', elo: 1960 },
  GER: { name: 'Germany', flag: '🇩🇪', elo: 1950 },
  BEL: { name: 'Belgium', flag: '🇧🇪', elo: 1900 },
  CRO: { name: 'Croatia', flag: '🇭🇷', elo: 1880 },
  COL: { name: 'Colombia', flag: '🇨🇴', elo: 1860 },
  URU: { name: 'Uruguay', flag: '🇺🇾', elo: 1830 },
  MAR: { name: 'Morocco', flag: '🇲🇦', elo: 1820 },
  SUI: { name: 'Switzerland', flag: '🇨🇭', elo: 1790 },
  MEX: { name: 'Mexico', flag: '🇲🇽', elo: 1780 },
  USA: { name: 'United States', flag: '🇺🇸', elo: 1770 },
  JPN: { name: 'Japan', flag: '🇯🇵', elo: 1760 },
  SEN: { name: 'Senegal', flag: '🇸🇳', elo: 1740 },
  IRN: { name: 'Iran', flag: '🇮🇷', elo: 1720 },
  KOR: { name: 'South Korea', flag: '🇰🇷', elo: 1710 },
  AUT: { name: 'Austria', flag: '🇦🇹', elo: 1700 },
  SCO: { name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', elo: 1690 },
  ECU: { name: 'Ecuador', flag: '🇪🇨', elo: 1670 },
  NOR: { name: 'Norway', flag: '🇳🇴', elo: 1660 },
  TUR: { name: 'Türkiye', flag: '🇹🇷', elo: 1650 },
  ALG: { name: 'Algeria', flag: '🇩🇿', elo: 1640 },
  CZE: { name: 'Czechia', flag: '🇨🇿', elo: 1630 },
  AUS: { name: 'Australia', flag: '🇦🇺', elo: 1625 },
  EGY: { name: 'Egypt', flag: '🇪🇬', elo: 1620 },
  BIH: { name: 'Bosnia & Herzegovina', flag: '🇧🇦', elo: 1610 },
  CAN: { name: 'Canada', flag: '🇨🇦', elo: 1600 },
  SWE: { name: 'Sweden', flag: '🇸🇪', elo: 1595 },
  QAT: { name: 'Qatar', flag: '🇶🇦', elo: 1590 },
  CIV: { name: "Côte d'Ivoire", flag: '🇨🇮', elo: 1570 },
  TUN: { name: 'Tunisia', flag: '🇹🇳', elo: 1560 },
  KSA: { name: 'Saudi Arabia', flag: '🇸🇦', elo: 1550 },
  IRQ: { name: 'Iraq', flag: '🇮🇶', elo: 1540 },
  PAR: { name: 'Paraguay', flag: '🇵🇾', elo: 1530 },
  RSA: { name: 'South Africa', flag: '🇿🇦', elo: 1525 },
  GHA: { name: 'Ghana', flag: '🇬🇭', elo: 1520 },
  UZB: { name: 'Uzbekistan', flag: '🇺🇿', elo: 1510 },
  PAN: { name: 'Panama', flag: '🇵🇦', elo: 1480 },
  CPV: { name: 'Cape Verde', flag: '🇨🇻', elo: 1460 },
  JOR: { name: 'Jordan', flag: '🇯🇴', elo: 1450 },
  NZL: { name: 'New Zealand', flag: '🇳🇿', elo: 1430 },
  COD: { name: 'DR Congo', flag: '🇨🇩', elo: 1410 },
  HAI: { name: 'Haiti', flag: '🇭🇹', elo: 1390 },
  CUW: { name: 'Curaçao', flag: '🇨🇼', elo: 1370 }
}

export const GROUPS = {
  A: ['MEX', 'RSA', 'KOR', 'CZE'],
  B: ['CAN', 'BIH', 'QAT', 'SUI'],
  C: ['BRA', 'MAR', 'HAI', 'SCO'],
  D: ['USA', 'PAR', 'AUS', 'TUR'],
  E: ['GER', 'CUW', 'CIV', 'ECU'],
  F: ['NED', 'JPN', 'SWE', 'TUN'],
  G: ['BEL', 'EGY', 'IRN', 'NZL'],
  H: ['ESP', 'CPV', 'KSA', 'URU'],
  I: ['FRA', 'SEN', 'IRQ', 'NOR'],
  J: ['ARG', 'ALG', 'AUT', 'JOR'],
  K: ['POR', 'COD', 'UZB', 'COL'],
  L: ['ENG', 'CRO', 'GHA', 'PAN']
}

// Venue map: city → stadium
export const VENUES = {
  'Mexico City': 'Estadio Azteca',
  'Zapopan': 'Estadio Akron (Guadalajara)',
  'Guadalupe': 'Estadio BBVA (Monterrey)',
  'Toronto': 'BMO Field',
  'Vancouver': 'BC Place',
  'Atlanta': 'Mercedes-Benz Stadium',
  'East Rutherford': 'MetLife Stadium',
  'Foxborough': 'Gillette Stadium',
  'Philadelphia': 'Lincoln Financial Field',
  'Miami Gardens': 'Hard Rock Stadium',
  'Inglewood': 'SoFi Stadium',
  'Santa Clara': "Levi's Stadium",
  'Seattle': 'Lumen Field',
  'Houston': 'NRG Stadium',
  'Arlington': 'AT&T Stadium',
  'Kansas City': 'Arrowhead Stadium'
}

// Full group-stage schedule (per ESPN/FIFA, official Dec 6, 2025 release).
// Order within each group = chronological. Indices 0..5 used as match keys.
export const SCHEDULE = [
  // Group A
  { group: 'A', home: 'MEX', away: 'RSA', date: '2026-06-11', city: 'Mexico City' },
  { group: 'A', home: 'KOR', away: 'CZE', date: '2026-06-11', city: 'Zapopan' },
  { group: 'A', home: 'CZE', away: 'RSA', date: '2026-06-18', city: 'Atlanta' },
  { group: 'A', home: 'MEX', away: 'KOR', date: '2026-06-18', city: 'Zapopan' },
  { group: 'A', home: 'CZE', away: 'MEX', date: '2026-06-24', city: 'Mexico City' },
  { group: 'A', home: 'RSA', away: 'KOR', date: '2026-06-24', city: 'Guadalupe' },
  // Group B
  { group: 'B', home: 'CAN', away: 'BIH', date: '2026-06-12', city: 'Toronto' },
  { group: 'B', home: 'QAT', away: 'SUI', date: '2026-06-13', city: 'Santa Clara' },
  { group: 'B', home: 'SUI', away: 'BIH', date: '2026-06-18', city: 'Inglewood' },
  { group: 'B', home: 'CAN', away: 'QAT', date: '2026-06-18', city: 'Vancouver' },
  { group: 'B', home: 'SUI', away: 'CAN', date: '2026-06-24', city: 'Vancouver' },
  { group: 'B', home: 'BIH', away: 'QAT', date: '2026-06-24', city: 'Seattle' },
  // Group C
  { group: 'C', home: 'BRA', away: 'MAR', date: '2026-06-13', city: 'East Rutherford' },
  { group: 'C', home: 'HAI', away: 'SCO', date: '2026-06-13', city: 'Foxborough' },
  { group: 'C', home: 'SCO', away: 'MAR', date: '2026-06-19', city: 'Foxborough' },
  { group: 'C', home: 'BRA', away: 'HAI', date: '2026-06-19', city: 'Philadelphia' },
  { group: 'C', home: 'SCO', away: 'BRA', date: '2026-06-24', city: 'Miami Gardens' },
  { group: 'C', home: 'MAR', away: 'HAI', date: '2026-06-24', city: 'Atlanta' },
  // Group D
  { group: 'D', home: 'USA', away: 'PAR', date: '2026-06-12', city: 'Inglewood' },
  { group: 'D', home: 'AUS', away: 'TUR', date: '2026-06-13', city: 'Vancouver' },
  { group: 'D', home: 'USA', away: 'AUS', date: '2026-06-19', city: 'Seattle' },
  { group: 'D', home: 'TUR', away: 'PAR', date: '2026-06-19', city: 'Santa Clara' },
  { group: 'D', home: 'TUR', away: 'USA', date: '2026-06-25', city: 'Inglewood' },
  { group: 'D', home: 'PAR', away: 'AUS', date: '2026-06-25', city: 'Santa Clara' },
  // Group E
  { group: 'E', home: 'GER', away: 'CUW', date: '2026-06-14', city: 'Houston' },
  { group: 'E', home: 'CIV', away: 'ECU', date: '2026-06-14', city: 'Philadelphia' },
  { group: 'E', home: 'GER', away: 'CIV', date: '2026-06-20', city: 'Toronto' },
  { group: 'E', home: 'ECU', away: 'CUW', date: '2026-06-20', city: 'Kansas City' },
  { group: 'E', home: 'ECU', away: 'GER', date: '2026-06-25', city: 'East Rutherford' },
  { group: 'E', home: 'CUW', away: 'CIV', date: '2026-06-25', city: 'Philadelphia' },
  // Group F
  { group: 'F', home: 'NED', away: 'JPN', date: '2026-06-14', city: 'Arlington' },
  { group: 'F', home: 'SWE', away: 'TUN', date: '2026-06-14', city: 'Guadalupe' },
  { group: 'F', home: 'NED', away: 'SWE', date: '2026-06-20', city: 'Houston' },
  { group: 'F', home: 'TUN', away: 'JPN', date: '2026-06-20', city: 'Guadalupe' },
  { group: 'F', home: 'JPN', away: 'SWE', date: '2026-06-25', city: 'Arlington' },
  { group: 'F', home: 'TUN', away: 'NED', date: '2026-06-25', city: 'Kansas City' },
  // Group G
  { group: 'G', home: 'BEL', away: 'EGY', date: '2026-06-15', city: 'Seattle' },
  { group: 'G', home: 'IRN', away: 'NZL', date: '2026-06-15', city: 'Inglewood' },
  { group: 'G', home: 'BEL', away: 'IRN', date: '2026-06-21', city: 'Inglewood' },
  { group: 'G', home: 'NZL', away: 'EGY', date: '2026-06-21', city: 'Vancouver' },
  { group: 'G', home: 'EGY', away: 'IRN', date: '2026-06-26', city: 'Seattle' },
  { group: 'G', home: 'NZL', away: 'BEL', date: '2026-06-26', city: 'Vancouver' },
  // Group H
  { group: 'H', home: 'ESP', away: 'CPV', date: '2026-06-15', city: 'Atlanta' },
  { group: 'H', home: 'KSA', away: 'URU', date: '2026-06-15', city: 'Miami Gardens' },
  { group: 'H', home: 'ESP', away: 'KSA', date: '2026-06-21', city: 'Atlanta' },
  { group: 'H', home: 'URU', away: 'CPV', date: '2026-06-21', city: 'Miami Gardens' },
  { group: 'H', home: 'CPV', away: 'KSA', date: '2026-06-26', city: 'Houston' },
  { group: 'H', home: 'URU', away: 'ESP', date: '2026-06-26', city: 'Zapopan' },
  // Group I
  { group: 'I', home: 'FRA', away: 'SEN', date: '2026-06-16', city: 'East Rutherford' },
  { group: 'I', home: 'IRQ', away: 'NOR', date: '2026-06-16', city: 'Foxborough' },
  { group: 'I', home: 'FRA', away: 'IRQ', date: '2026-06-22', city: 'Philadelphia' },
  { group: 'I', home: 'NOR', away: 'SEN', date: '2026-06-22', city: 'East Rutherford' },
  { group: 'I', home: 'NOR', away: 'FRA', date: '2026-06-26', city: 'Foxborough' },
  { group: 'I', home: 'SEN', away: 'IRQ', date: '2026-06-26', city: 'Toronto' },
  // Group J
  { group: 'J', home: 'ARG', away: 'ALG', date: '2026-06-16', city: 'Kansas City' },
  { group: 'J', home: 'AUT', away: 'JOR', date: '2026-06-16', city: 'Santa Clara' },
  { group: 'J', home: 'ARG', away: 'AUT', date: '2026-06-22', city: 'Arlington' },
  { group: 'J', home: 'JOR', away: 'ALG', date: '2026-06-22', city: 'Santa Clara' },
  { group: 'J', home: 'ALG', away: 'AUT', date: '2026-06-27', city: 'Kansas City' },
  { group: 'J', home: 'JOR', away: 'ARG', date: '2026-06-27', city: 'Arlington' },
  // Group K
  { group: 'K', home: 'POR', away: 'COD', date: '2026-06-17', city: 'Houston' },
  { group: 'K', home: 'UZB', away: 'COL', date: '2026-06-17', city: 'Mexico City' },
  { group: 'K', home: 'POR', away: 'UZB', date: '2026-06-23', city: 'Houston' },
  { group: 'K', home: 'COL', away: 'COD', date: '2026-06-23', city: 'Zapopan' },
  { group: 'K', home: 'COL', away: 'POR', date: '2026-06-27', city: 'Miami Gardens' },
  { group: 'K', home: 'COD', away: 'UZB', date: '2026-06-27', city: 'Atlanta' },
  // Group L
  { group: 'L', home: 'ENG', away: 'CRO', date: '2026-06-17', city: 'Arlington' },
  { group: 'L', home: 'GHA', away: 'PAN', date: '2026-06-17', city: 'Toronto' },
  { group: 'L', home: 'ENG', away: 'GHA', date: '2026-06-23', city: 'Foxborough' },
  { group: 'L', home: 'PAN', away: 'CRO', date: '2026-06-23', city: 'Toronto' },
  { group: 'L', home: 'PAN', away: 'ENG', date: '2026-06-27', city: 'East Rutherford' },
  { group: 'L', home: 'CRO', away: 'GHA', date: '2026-06-27', city: 'Philadelphia' }
]

// Assign official FIFA match numbers M1-M72 to each group-stage match.
// Order verified against ESPN/SI/Wikipedia chronological lists. Index = SCHEDULE position.
// Numbers extracted from the official FIFA "FWC26 Match Schedule" PDF (10 Apr 2026).
// SCHEDULE index order per group is fixed above — these are the M#s for those rows.
const GROUP_MATCH_NUMBERS = [
  1,  2,  25, 28, 53, 54,  // A: MEX-RSA, KOR-CZE, CZE-RSA, MEX-KOR, CZE-MEX, RSA-KOR
  3,  8,  26, 27, 51, 52,  // B: CAN-BIH, QAT-SUI, SUI-BIH, CAN-QAT, SUI-CAN, BIH-QAT
  7,  5,  30, 29, 49, 50,  // C: BRA-MAR, HAI-SCO, SCO-MAR, BRA-HAI, SCO-BRA, MAR-HAI
  4,  6,  32, 31, 59, 60,  // D: USA-PAR, AUS-TUR, USA-AUS, TUR-PAR, TUR-USA, PAR-AUS
  10, 9,  33, 34, 56, 55,  // E: GER-CUW, CIV-ECU, GER-CIV, ECU-CUW, ECU-GER, CUW-CIV
  11, 12, 35, 36, 57, 58,  // F: NED-JPN, SWE-TUN, NED-SWE, TUN-JPN, JPN-SWE, TUN-NED
  16, 15, 39, 40, 63, 64,  // G: BEL-EGY, IRN-NZL, BEL-IRN, NZL-EGY, EGY-IRN, NZL-BEL
  14, 13, 38, 37, 65, 66,  // H: ESP-CPV, KSA-URU, ESP-KSA, URU-CPV, CPV-KSA, URU-ESP
  17, 18, 42, 41, 61, 62,  // I: FRA-SEN, IRQ-NOR, FRA-IRQ, NOR-SEN, NOR-FRA, SEN-IRQ
  19, 20, 43, 44, 69, 70,  // J: ARG-ALG, AUT-JOR, ARG-AUT, JOR-ALG, ALG-AUT, JOR-ARG
  23, 24, 47, 48, 71, 72,  // K: POR-COD, UZB-COL, POR-UZB, COL-COD, COL-POR, COD-UZB
  22, 21, 45, 46, 67, 68   // L: ENG-CRO, GHA-PAN, ENG-GHA, PAN-CRO, PAN-ENG, CRO-GHA
]
SCHEDULE.forEach((m, i) => { m.match = GROUP_MATCH_NUMBERS[i] })

export function groupMatches(groupKey) {
  return SCHEDULE.filter(m => m.group === groupKey).map(m => [m.home, m.away])
}

export function groupSchedule(groupKey) {
  return SCHEDULE.filter(m => m.group === groupKey)
}

export const GROUP_KEYS = Object.keys(GROUPS)

// Official FIFA Round of 32 bracket spec (per Wikipedia/FIFA tournament regs).
// Each entry: match number, home/away as group-position references.
// pos refs: { kind: 'winner'|'runnerup', group: 'A' } or { kind: 'third', from: [groups] }.
// The 'from' array names the 5 candidate groups; the actual 3rd-placed team
// assigned depends on the 495-row Annex C lookup (THIRD_PLACE_MATRIX).
export const R32_SPEC = [
  { match: 73, date: '2026-06-28', city: 'Inglewood',       home: { kind: 'runnerup', group: 'A' }, away: { kind: 'runnerup', group: 'B' } },
  { match: 74, date: '2026-06-29', city: 'Foxborough',      home: { kind: 'winner',   group: 'E' }, away: { kind: 'third', from: ['A','B','C','D','F'] } },
  { match: 75, date: '2026-06-29', city: 'Guadalupe',       home: { kind: 'winner',   group: 'F' }, away: { kind: 'runnerup', group: 'C' } },
  { match: 76, date: '2026-06-29', city: 'Houston',         home: { kind: 'winner',   group: 'C' }, away: { kind: 'runnerup', group: 'F' } },
  { match: 77, date: '2026-06-30', city: 'East Rutherford', home: { kind: 'winner',   group: 'I' }, away: { kind: 'third', from: ['C','D','F','G','H'] } },
  { match: 78, date: '2026-06-30', city: 'Arlington',       home: { kind: 'runnerup', group: 'E' }, away: { kind: 'runnerup', group: 'I' } },
  { match: 79, date: '2026-06-30', city: 'Mexico City',     home: { kind: 'winner',   group: 'A' }, away: { kind: 'third', from: ['C','E','F','H','I'] } },
  { match: 80, date: '2026-07-01', city: 'Atlanta',         home: { kind: 'winner',   group: 'L' }, away: { kind: 'third', from: ['E','H','I','J','K'] } },
  { match: 81, date: '2026-07-01', city: 'Santa Clara',     home: { kind: 'winner',   group: 'D' }, away: { kind: 'third', from: ['B','E','F','I','J'] } },
  { match: 82, date: '2026-07-01', city: 'Seattle',         home: { kind: 'winner',   group: 'G' }, away: { kind: 'third', from: ['A','E','H','I','J'] } },
  { match: 83, date: '2026-07-02', city: 'Toronto',         home: { kind: 'runnerup', group: 'K' }, away: { kind: 'runnerup', group: 'L' } },
  { match: 84, date: '2026-07-02', city: 'Inglewood',       home: { kind: 'winner',   group: 'H' }, away: { kind: 'runnerup', group: 'J' } },
  { match: 85, date: '2026-07-02', city: 'Vancouver',       home: { kind: 'winner',   group: 'B' }, away: { kind: 'third', from: ['E','F','G','I','J'] } },
  { match: 86, date: '2026-07-03', city: 'Miami Gardens',   home: { kind: 'winner',   group: 'J' }, away: { kind: 'runnerup', group: 'H' } },
  { match: 87, date: '2026-07-03', city: 'Kansas City',     home: { kind: 'winner',   group: 'K' }, away: { kind: 'third', from: ['D','E','I','J','L'] } },
  { match: 88, date: '2026-07-03', city: 'Arlington',       home: { kind: 'runnerup', group: 'D' }, away: { kind: 'runnerup', group: 'G' } }
]

// R16-Final bracket flow per Wikipedia/FIFA: each entry refs winners of prior matches.
// Indices reference R32_SPEC (0-based, so r32idx = matchNum - 73).
export const R16_SPEC = [
  { match: 89, date: '2026-07-04', city: 'Philadelphia',    feeds: [74, 77] },
  { match: 90, date: '2026-07-04', city: 'Houston',         feeds: [73, 75] },
  { match: 91, date: '2026-07-05', city: 'East Rutherford', feeds: [76, 78] },
  { match: 92, date: '2026-07-05', city: 'Mexico City',     feeds: [79, 80] },
  { match: 93, date: '2026-07-06', city: 'Arlington',       feeds: [83, 84] },
  { match: 94, date: '2026-07-06', city: 'Seattle',         feeds: [81, 82] },
  { match: 95, date: '2026-07-07', city: 'Atlanta',         feeds: [86, 88] },
  { match: 96, date: '2026-07-07', city: 'Vancouver',       feeds: [85, 87] }
]

export const QF_SPEC = [
  { match: 97,  date: '2026-07-09', city: 'Foxborough',    feeds: [89, 90] },
  { match: 98,  date: '2026-07-10', city: 'Inglewood',     feeds: [91, 92] },
  { match: 99,  date: '2026-07-11', city: 'Miami Gardens', feeds: [93, 94] },
  { match: 100, date: '2026-07-11', city: 'Kansas City',   feeds: [95, 96] }
]

export const SF_SPEC = [
  { match: 101, date: '2026-07-14', city: 'Arlington', feeds: [97, 98] },
  { match: 102, date: '2026-07-15', city: 'Atlanta',   feeds: [99, 100] }
]

export const THIRD_PLACE_SPEC =
  { match: 103, date: '2026-07-18', city: 'Miami Gardens', feeds: [101, 102], loserBracket: true }

export const FINAL_SPEC =
  { match: 104, date: '2026-07-19', city: 'East Rutherford', feeds: [101, 102] }

// Label for an unresolved KO slot (used as bracket placeholder before teams known).
// side: 0 = home, 1 = away.
export function koSlotLabel(round, idx, side) {
  const refLabel = ref => {
    if (ref.kind === 'winner') return `1${ref.group}`
    if (ref.kind === 'runnerup') return `2${ref.group}`
    if (ref.kind === 'third') return `3rd ${ref.from.join('/')}`
    return ''
  }
  if (round === 'r32') {
    const s = R32_SPEC[idx]
    if (!s) return ''
    return refLabel(side === 0 ? s.home : s.away)
  }
  const spec = round === 'r16' ? R16_SPEC[idx]
    : round === 'qf' ? QF_SPEC[idx]
    : round === 'sf' ? SF_SPEC[idx]
    : round === 'final' ? FINAL_SPEC
    : round === 'bronze' ? THIRD_PLACE_SPEC
    : null
  if (!spec) return ''
  const n = spec.feeds[side]
  return spec.loserBracket ? `Loser M${n}` : `Winner M${n}`
}

// Legacy alias preserved for components still indexing 0..15 / 0..7 etc.
export const KO_SCHEDULE = {
  r32:    R32_SPEC.map(s => ({ date: s.date, city: s.city, match: s.match })),
  r16:    R16_SPEC.map(s => ({ date: s.date, city: s.city, match: s.match })),
  qf:     QF_SPEC.map(s  => ({ date: s.date, city: s.city, match: s.match })),
  sf:     SF_SPEC.map(s  => ({ date: s.date, city: s.city, match: s.match })),
  final:  [{ date: FINAL_SPEC.date, city: FINAL_SPEC.city, match: FINAL_SPEC.match }],
  bronze: [{ date: THIRD_PLACE_SPEC.date, city: THIRD_PLACE_SPEC.city, match: THIRD_PLACE_SPEC.match }]
}

// Build a flat M1..M104 sequential list. Knockout entries have symbolic home/away
// strings (e.g. "Winner Group A", "Runner-up Group B", "3rd from C/D/F/G/H", "Winner M73").
export function allMatchesSequential() {
  const list = []
  SCHEDULE.forEach(m => {
    list.push({
      match: m.match,
      round: 'Group ' + m.group,
      date: m.date,
      city: m.city,
      home: m.home,
      away: m.away
    })
  })
  const refLabel = (ref) => {
    if (ref.kind === 'winner') return `Winner Group ${ref.group}`
    if (ref.kind === 'runnerup') return `Runner-up Group ${ref.group}`
    if (ref.kind === 'third') return `3rd from ${ref.from.join('/')}`
    return '?'
  }
  R32_SPEC.forEach(s => list.push({
    match: s.match, round: 'R32', date: s.date, city: s.city,
    homeLabel: refLabel(s.home), awayLabel: refLabel(s.away)
  }))
  ;[...R16_SPEC, ...QF_SPEC, ...SF_SPEC, THIRD_PLACE_SPEC, FINAL_SPEC].forEach(s => {
    const round = s.match >= 104 ? 'Final'
      : s.match === 103 ? '3rd-place'
      : s.match >= 101 ? 'Semifinal'
      : s.match >= 97 ? 'Quarterfinal'
      : 'R16'
    list.push({
      match: s.match, round, date: s.date, city: s.city,
      homeLabel: `Winner M${s.feeds[0]}`,
      awayLabel: s.loserBracket ? `Loser M${s.feeds[0]}` : `Winner M${s.feeds[1]}`,
      ...(s.loserBracket ? { homeLabel: `Loser M${s.feeds[0]}`, awayLabel: `Loser M${s.feeds[1]}` } : {})
    })
  })
  return list.sort((a, b) => a.match - b.match)
}
