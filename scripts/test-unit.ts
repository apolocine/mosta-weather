// @mostajs/weather — Tests unitaires
// Author: Dr Hamid MADANI drmdh@msn.com
import { msToKmh, isFlyable, getConditionIcon, DEFAULT_CRITERIA, CONDITION_ICONS } from '../src/lib/conditions.js'
import { getMockWeather } from '../src/lib/mock-data.js'
import { fetchWeather } from '../src/lib/weather-client.js'

let passed = 0
let failed = 0

function assert(condition: boolean, label: string) {
  if (condition) { passed++; console.log('  ✅', label) }
  else { failed++; console.error('  ❌', label) }
}

// ── T1 — Conditions & flyability ──
console.log('T1 — msToKmh')
assert(msToKmh(0) === 0, 'msToKmh(0) === 0')
assert(msToKmh(1) === 4, 'msToKmh(1) === 4')
assert(msToKmh(6.94) === 25, 'msToKmh(6.94) === 25')
assert(msToKmh(10) === 36, 'msToKmh(10) === 36')
console.log('')

console.log('T1 — isFlyable')
assert(isFlyable(15, 'Clear') === true, 'isFlyable(15, Clear) → true')
assert(isFlyable(26, 'Clear') === false, 'isFlyable(26, Clear) → false (>25)')
assert(isFlyable(15, 'Rain') === false, 'isFlyable(15, Rain) → false')
assert(isFlyable(15, 'Thunderstorm') === false, 'isFlyable(15, Thunderstorm) → false')
assert(isFlyable(15, 'Snow') === false, 'isFlyable(15, Snow) → false')
assert(isFlyable(15, 'Clouds') === true, 'isFlyable(15, Clouds) → true')
assert(isFlyable(15, 'Mist') === true, 'isFlyable(15, Mist) → true')
assert(isFlyable(15, 'Clear', { maxWindKmh: 10, minVisibilityKm: 3, forbiddenConditions: [] }) === false, 'custom maxWind=10, wind=15 → false')
assert(isFlyable(8, 'Clear', { maxWindKmh: 10, minVisibilityKm: 3, forbiddenConditions: [] }) === true, 'custom maxWind=10, wind=8 → true')
console.log('')

console.log('T1 — getConditionIcon')
assert(getConditionIcon('Clear') === CONDITION_ICONS['Clear'], 'icon Clear OK')
assert(getConditionIcon('Rain') === CONDITION_ICONS['Rain'], 'icon Rain OK')
assert(getConditionIcon('Unknown') !== undefined, 'icon Unknown → default')
console.log('')

// ── T2 — Mock data ──
console.log('T2 — getMockWeather')
const mock = getMockWeather({ location: { lat: 36.75, lon: 3.06, label: 'Alger' } })
assert(mock.isRealData === false, 'isRealData === false')
assert(mock.forecast.length === 5, 'forecast.length === 5')
assert(mock.location === 'Alger', 'location label → Alger')
assert(mock.current.temp === 22, 'current.temp === 22')
assert(mock.current.wind === 12, 'current.wind === 12')
assert(mock.alerts.length >= 1, 'has demo alert')

const mock2 = getMockWeather({ location: { lat: 48.85, lon: 2.35 } })
assert(mock2.location === '48.85, 2.35', 'no label → lat, lon string')
console.log('')

// ── T3 — Default criteria ──
console.log('T3 — DEFAULT_CRITERIA')
assert(DEFAULT_CRITERIA.maxWindKmh === 25, 'maxWindKmh === 25')
assert(DEFAULT_CRITERIA.minVisibilityKm === 3, 'minVisibilityKm === 3')
assert(DEFAULT_CRITERIA.forbiddenConditions.includes('Rain'), 'forbids Rain')
assert(DEFAULT_CRITERIA.forbiddenConditions.includes('Thunderstorm'), 'forbids Thunderstorm')
assert(DEFAULT_CRITERIA.forbiddenConditions.includes('Snow'), 'forbids Snow')
assert(DEFAULT_CRITERIA.forbiddenConditions.length === 3, '3 forbidden conditions')
console.log('')

// ── T5 — Demo mode ──
console.log('T5 — fetchWeather demo mode (no apiKey)')
const demo = await fetchWeather({ location: { lat: 48.85, lon: 2.35, label: 'Paris' } })
assert(demo.isRealData === false, 'fetchWeather without key → isRealData false')
assert(demo.forecast.length === 5, 'fetchWeather demo → 5 forecasts')
assert(demo.location === 'Paris', 'fetchWeather demo → location Paris')
console.log('')

// ── Summary ──
console.log('════════════════════════════════════════')
console.log(`  Resultats: ${passed} passed, ${failed} failed`)
console.log('════════════════════════════════════════')
if (failed > 0) process.exit(1)
