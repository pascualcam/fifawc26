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

export function groupMatches(groupKey) {
  return SCHEDULE.filter(m => m.group === groupKey).map(m => [m.home, m.away])
}

export function groupSchedule(groupKey) {
  return SCHEDULE.filter(m => m.group === groupKey)
}

export const GROUP_KEYS = Object.keys(GROUPS)

// Knockout schedule (per ESPN/FIFA). Indices align with bracket arrays in sim.js.
// Sequential mapping — actual seed-to-match assignment by FIFA not used here.
export const KO_SCHEDULE = {
  r32: [
    { date: '2026-06-28', city: 'Inglewood' },
    { date: '2026-06-29', city: 'Houston' },
    { date: '2026-06-29', city: 'Foxborough' },
    { date: '2026-06-29', city: 'Guadalupe' },
    { date: '2026-06-30', city: 'Arlington' },
    { date: '2026-06-30', city: 'East Rutherford' },
    { date: '2026-06-30', city: 'Mexico City' },
    { date: '2026-07-01', city: 'Atlanta' },
    { date: '2026-07-01', city: 'Seattle' },
    { date: '2026-07-01', city: 'Santa Clara' },
    { date: '2026-07-02', city: 'Inglewood' },
    { date: '2026-07-02', city: 'Toronto' },
    { date: '2026-07-02', city: 'Vancouver' },
    { date: '2026-07-03', city: 'Arlington' },
    { date: '2026-07-03', city: 'Miami Gardens' },
    { date: '2026-07-03', city: 'Kansas City' }
  ],
  r16: [
    { date: '2026-07-04', city: 'Houston' },
    { date: '2026-07-04', city: 'Philadelphia' },
    { date: '2026-07-05', city: 'East Rutherford' },
    { date: '2026-07-05', city: 'Mexico City' },
    { date: '2026-07-06', city: 'Arlington' },
    { date: '2026-07-06', city: 'Seattle' },
    { date: '2026-07-07', city: 'Atlanta' },
    { date: '2026-07-07', city: 'Vancouver' }
  ],
  qf: [
    { date: '2026-07-09', city: 'Foxborough' },
    { date: '2026-07-10', city: 'Inglewood' },
    { date: '2026-07-11', city: 'Miami Gardens' },
    { date: '2026-07-11', city: 'Kansas City' }
  ],
  sf: [
    { date: '2026-07-14', city: 'Arlington' },
    { date: '2026-07-15', city: 'Atlanta' }
  ],
  final: [
    { date: '2026-07-19', city: 'East Rutherford' }
  ]
}
