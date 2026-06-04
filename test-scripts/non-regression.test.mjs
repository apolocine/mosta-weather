// @mostajs/weather — Test de NON-RÉGRESSION après migration vers @mostajs/geo
// Author: Dr Hamid MADANI drmdh@msn.com
//
// Vérifie que :
//  (A) l'API existante est INCHANGÉE (utilitaires + fetchWeather mode démo),
//  (B) la nouvelle voie « par lieu » (compose @mostajs/geo) fonctionne hors-ligne.
// Import depuis dist/lib/* (pas index.js) pour ne PAS charger WeatherPage (React).
// Pré-requis : `npm run build` (+ @mostajs/geo résolvable). Aucune clé, aucun réseau (provider demo).

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { fetchWeather } from '../dist/lib/weather-client.js'
import { getMockWeather } from '../dist/lib/mock-data.js'
import { msToKmh, isFlyable } from '../dist/lib/conditions.js'
import { fetchWeatherByPlace, resolveLabel } from '../dist/lib/geo-bridge.js'

const cfg = { location: { lat: 36.7538, lon: 3.0588, label: 'Alger' } } // pas d'apiKey → démo

// ── (A) NON-RÉGRESSION : utilitaires inchangés ──
test('NR1 utilitaires (msToKmh / isFlyable)', () => {
  assert.equal(msToKmh(6.94), 25)
  assert.equal(isFlyable(15, 'Clear'), true)
  assert.equal(isFlyable(26, 'Clear'), false)
  assert.equal(isFlyable(15, 'Rain'), false)
})

// ── (A) NON-RÉGRESSION : fetchWeather mode démo identique à getMockWeather ──
test('NR2 fetchWeather (démo) == getMockWeather (comportement inchangé)', async () => {
  const viaFetch = await fetchWeather(cfg)
  const viaMock = getMockWeather(cfg)
  assert.equal(viaFetch.isRealData, false)
  assert.deepEqual(viaFetch, viaMock)
})

// ── (A) NON-RÉGRESSION : forme WeatherData + label de localisation ──
test('NR3 forme WeatherData préservée', async () => {
  const w = await fetchWeather(cfg)
  assert.equal(w.location, 'Alger')
  assert.equal(typeof w.current.temp, 'number')
  assert.equal(w.forecast.length, 5)
  assert.ok(Array.isArray(w.alerts))
})

// ── (B) NOUVEAU : fetchWeatherByPlace via @mostajs/geo (provider demo, hors-ligne) ──
test('NR4 fetchWeatherByPlace("Alger", geo:demo)', async () => {
  const w = await fetchWeatherByPlace('Alger', { geo: { provider: 'demo' } })
  assert.equal(w.isRealData, false)          // pas de clé météo → démo
  assert.match(w.location, /Alger/)
  assert.equal(w.forecast.length, 5)
})

// ── (B) NOUVEAU : resolveLabel ──
test('NR5 resolveLabel (label fourni vs reverse-geocode demo)', async () => {
  assert.equal(await resolveLabel({ lat: 1, lon: 2, label: 'Déjà' }), 'Déjà')
  const lbl = await resolveLabel({ lat: 36.7538, lon: 3.0588 }, { provider: 'demo' })
  assert.equal(typeof lbl, 'string')
  assert.ok(lbl.length > 0)
})
