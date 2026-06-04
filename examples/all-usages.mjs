// @mostajs/weather — Exemple : TOUTES les possibilités d'utilisation
// Author: Dr Hamid MADANI <drmdh@msn.com>
//
// Lance : node examples/all-usages.mjs
// Clé OWM lue depuis examples/.env (gitignoré). Sans clé → sections "réelles" en mode démo.
// Démontre @mostajs/weather (météo) ET @mostajs/geo (géoloc), via self-reference de package.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// ── chargement .env minimal (sans dépendance) ──
const here = dirname(fileURLToPath(import.meta.url))
try {
  for (const line of readFileSync(join(here, '.env'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
} catch { /* pas de .env → mode démo */ }

const KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY
const GEO_GOOGLE_KEY = process.env.GEO_GOOGLE_KEY
const line = (t) => console.log(`\n=== ${t} ===`)

// ── imports (self-reference @mostajs/weather + dépendance @mostajs/geo) ──
import {
  fetchWeather, fetchWeatherByPlace, resolveLabel,
  getMockWeather, isFlyable, msToKmh, getConditionIcon,
  DEFAULT_CRITERIA, CONDITION_ICONS,
} from '@mostajs/weather'
import {
  distance, bearing, nearest, isWithin, boundingBox,
  geohashEncode, geocode, reverseGeocode,
} from '@mostajs/geo'

const Alger = { lat: 36.7538, lon: 3.0588, label: 'Alger' }
const Oran = { lat: 35.6969, lon: -0.6331 }

async function main() {
  console.log(KEY ? '🔑 Clé OWM détectée → sections réelles ACTIVES' : '⚠ Pas de clé OWM → sections météo réelles en démo')

  // ── 1. Utilitaires (purs) ──
  line('1. Utilitaires flyability')
  console.log('msToKmh(7.2) =', msToKmh(7.2), 'km/h')
  console.log("isFlyable(15,'Clear') =", isFlyable(15, 'Clear'))
  console.log("isFlyable(26,'Clear') =", isFlyable(26, 'Clear'), '(> 25 km/h)')
  console.log("isFlyable(15,'Rain') =", isFlyable(15, 'Rain'), '(condition interdite)')
  console.log('getConditionIcon("Clear") =', getConditionIcon('Clear'))
  console.log('DEFAULT_CRITERIA =', DEFAULT_CRITERIA)
  console.log('CONDITION_ICONS (clés) =', Object.keys(CONDITION_ICONS).join(', '))

  // ── 2. Mode démo (sans réseau) ──
  line('2. getMockWeather (démo, sans clé)')
  const mock = getMockWeather({ location: Alger })
  console.log('isRealData =', mock.isRealData, '| forecast =', mock.forecast.length, 'jours | temp =', mock.current.temp)

  // ── 3. fetchWeather par coordonnées (réel si clé) ──
  line('3. fetchWeather({ location: {lat,lon} })')
  const w3 = await fetchWeather({ apiKey: KEY, location: Alger, lang: 'fr', units: 'metric' })
  console.log(`${w3.location} → ${w3.current.temp}°C, ${w3.current.condition} ${w3.current.icon}, vent ${w3.current.wind} km/h | réel=${w3.isRealData}`)
  console.log('alertes:', w3.alerts.map((a) => `${a.severity}:${a.message}`).join(' ; ') || '(aucune)')

  // ── 4. fetchWeather avec critères de vol personnalisés ──
  line('4. fetchWeather + flyabilityCriteria personnalisés')
  const w4 = await fetchWeather({
    apiKey: KEY, location: Alger,
    flyabilityCriteria: { maxWindKmh: 10, minVisibilityKm: 5, forbiddenConditions: ['Rain', 'Snow', 'Clouds'] },
  })
  console.log('jours volables:', w4.forecast.map((f) => `${f.day}:${f.flyable ? '✅' : '❌'}`).join(' '))

  // ── 5. fetchWeatherByPlace — géocodage via @mostajs/geo (OSM réel) ──
  line('5. fetchWeatherByPlace("Oran, Algérie") via geo:osm')
  const w5 = await fetchWeatherByPlace('Oran, Algérie', { apiKey: KEY, geo: { provider: 'osm', lang: 'fr' } })
  console.log(`${w5.location} → ${w5.current.temp}°C, ${w5.current.condition} | réel=${w5.isRealData}`)

  // ── 6. fetchWeatherByPlace — mode démo (hors-ligne) ──
  line('6. fetchWeatherByPlace("Alger") via geo:demo (hors-ligne)')
  const w6 = await fetchWeatherByPlace('Alger', { geo: { provider: 'demo' } })
  console.log(`${w6.location} → réel=${w6.isRealData}, ${w6.forecast.length} jours`)

  // ── 7. resolveLabel ──
  line('7. resolveLabel')
  console.log('label fourni  →', await resolveLabel({ lat: 1, lon: 2, label: 'Mon site' }))
  console.log('reverse osm   →', await resolveLabel({ lat: 36.7538, lon: 3.0588 }, { provider: 'osm', lang: 'fr' }))

  // ── 8. @mostajs/geo — primitives ──
  line('8. @mostajs/geo : distance / bearing / nearest / geofence / bbox / geohash')
  console.log('distance Alger→Oran =', distance(Alger, Oran, 'km').toFixed(1), 'km')
  console.log('bearing Alger→Oran =', bearing(Alger, Oran).toFixed(0), '°')
  console.log('nearest =', nearest(Alger, [Oran, { lat: 36.76, lon: 3.06 }]))
  console.log('isWithin (cercle 1km) =', isWithin(Alger, { id: 'z', center: Alger, radiusM: 1000 }))
  console.log('boundingBox =', boundingBox([Alger, Oran]))
  console.log('geohash(Alger,7) =', geohashEncode(Alger, 7))

  // ── 9. @mostajs/geo — géocodage direct ──
  line('9. @mostajs/geo : geocode / reverseGeocode (OSM réel)')
  const g = await geocode('Constantine, Algérie', { provider: 'osm', lang: 'fr' })
  console.log('geocode →', g.results[0] ? `${g.results[0].label} (${g.results[0].lat.toFixed(3)}, ${g.results[0].lon.toFixed(3)})` : 'aucun', '| réel=', g.isRealData)
  const rg = await reverseGeocode(Alger, { provider: 'osm', lang: 'fr' })
  console.log('reverse →', rg.results[0]?.label ?? 'aucun')

  // ── 10. Composant React (référence — non rendu en Node) ──
  line('10. Composant React (usage)')
  console.log(`import { WeatherPage } from '@mostajs/weather'
<WeatherPage config={{ apiKey, location: { lat: 36.75, lon: 3.06, label: 'Alger' } }} onBack={() => router.back()} />`)

  console.log('\n✅ Tous les exemples ont été exécutés.')
}

main().catch((e) => { console.error('❌', e); process.exit(1) })
