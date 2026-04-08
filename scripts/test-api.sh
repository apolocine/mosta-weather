#!/bin/bash
# @mostajs/weather — Test API OpenWeatherMap (avec cle reelle)
# Author: Dr Hamid MADANI drmdh@msn.com
# Cle de test depuis booking-baloon/.env.local
# Usage: bash scripts/test-api.sh
set -e

cd "$(dirname "$0")/.."
echo ""
echo "════════════════════════════════════════════════════"
echo "  @mostajs/weather — Test API OpenWeatherMap"
echo "════════════════════════════════════════════════════"
echo ""

export OPENWEATHER_KEY="${OPENWEATHER_KEY:-1c17eddbd109946e1c5b90ec79f8539a}"

echo "▶ API Key: ${OPENWEATHER_KEY:0:10}..."
echo ""

echo "▶ Build..."
npx tsc 2>&1
echo "  ✅ Build OK"
echo ""

npx tsx -e "
import { fetchWeather } from './src/lib/weather-client.js'

let passed = 0
let failed = 0

function assert(condition, label) {
  if (condition) { passed++; console.log('  ✅', label) }
  else { failed++; console.error('  ❌', label) }
}

async function run() {
  // ── T4 — Fetch weather reel ──
  console.log('T4 — fetchWeather avec API key (Paris)')
  const data = await fetchWeather({
    apiKey: process.env.OPENWEATHER_KEY,
    location: { lat: 48.8566, lon: 2.3522, label: 'Paris' },
    lang: 'fr',
    units: 'metric',
  })

  assert(data.isRealData === true, 'isRealData === true')
  assert(data.location === 'Paris', 'location === Paris')
  assert(typeof data.current.temp === 'number', 'current.temp is number')
  assert(data.current.temp > -50 && data.current.temp < 60, 'current.temp in range [-50, 60]')
  assert(typeof data.current.wind === 'number', 'current.wind is number')
  assert(data.current.wind >= 0, 'current.wind >= 0')
  assert(typeof data.current.humidity === 'number', 'current.humidity is number')
  assert(data.current.visibility >= 0, 'current.visibility >= 0')
  assert(data.current.icon.length > 0, 'current.icon not empty')
  assert(data.current.condition.length > 0, 'current.condition not empty')

  console.log('  Temp: ' + data.current.temp + '°C')
  console.log('  Wind: ' + data.current.wind + ' km/h')
  console.log('  Condition: ' + data.current.icon + ' ' + data.current.condition)
  console.log('')

  console.log('T4b — Forecast')
  assert(data.forecast.length >= 3, 'forecast.length >= 3')
  assert(data.forecast.length <= 5, 'forecast.length <= 5')

  for (const f of data.forecast) {
    assert(typeof f.flyable === 'boolean', 'forecast ' + f.day + ' → flyable is boolean')
    assert(typeof f.temp === 'number', 'forecast ' + f.day + ' → temp is number')
    assert(typeof f.wind === 'number', 'forecast ' + f.day + ' → wind is number')
  }

  console.log('  Forecast:')
  for (const f of data.forecast) {
    console.log('    ' + f.day + ': ' + f.icon + ' ' + f.temp + '°C, ' + f.wind + ' km/h → ' + (f.flyable ? 'Vol OK' : 'Risque'))
  }
  console.log('')

  console.log('T4c — Alerts')
  assert(Array.isArray(data.alerts), 'alerts is array')
  if (data.alerts.length > 0) {
    for (const a of data.alerts) {
      assert(['warn', 'danger'].includes(a.severity), 'alert severity valid: ' + a.severity)
      console.log('  Alert: [' + a.severity + '] ' + a.message)
    }
  } else {
    console.log('  (pas d\\'alertes)')
  }
  console.log('')

  // ── T4d — Alger (site original) ──
  console.log('T4d — fetchWeather Alger (site decollage)')
  const alger = await fetchWeather({
    apiKey: process.env.OPENWEATHER_KEY,
    location: { lat: 36.7538, lon: 3.0588, label: 'Alger — Site de decollage' },
    flyabilityCriteria: { maxWindKmh: 25, minVisibilityKm: 3, forbiddenConditions: ['Rain', 'Thunderstorm', 'Snow'] },
  })
  assert(alger.isRealData === true, 'Alger → real data')
  assert(alger.location.includes('Alger'), 'Alger → location contains Alger')
  console.log('  Temp: ' + alger.current.temp + '°C, Wind: ' + alger.current.wind + ' km/h')
  console.log('')

  // ── Summary ──
  console.log('════════════════════════════════════════════════════')
  console.log('  Resultats: ' + passed + ' passed, ' + failed + ' failed')
  console.log('════════════════════════════════════════════════════')
  if (failed > 0) process.exit(1)
}

run().catch(e => { console.error('❌ Fatal:', e.message); process.exit(1) })
"
