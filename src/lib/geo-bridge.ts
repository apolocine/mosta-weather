// @mostajs/weather — Pont vers @mostajs/geo (géocodage de lieu → météo)
// Author: Dr Hamid MADANI drmdh@msn.com
//
// Compose @mostajs/geo (DEVRULES §0 : ne pas réimplémenter le géocodage).
// N'altère PAS l'API existante : ajoute seulement des fonctions « by place ».

import { geocode, reverseGeocode } from '@mostajs/geo'
import type { GeoConfig } from '@mostajs/geo'
import type { WeatherConfig, WeatherData } from '../types/index.js'
import { fetchWeather } from './weather-client.js'

/** Config météo « par lieu » : comme WeatherConfig mais sans `location` (résolue par geo). */
export interface PlaceWeatherConfig extends Omit<WeatherConfig, 'location'> {
  /** Config du fournisseur @mostajs/geo (provider, apiKey, lang…). Défaut: osm. */
  geo?: GeoConfig
}

/**
 * Géocode une requête texte via @mostajs/geo puis récupère la météo du 1er résultat.
 * Ex.: fetchWeatherByPlace('Alger', { geo: { provider: 'osm' } })
 */
export async function fetchWeatherByPlace(
  query: string,
  config: PlaceWeatherConfig = {},
): Promise<WeatherData> {
  const { geo, ...weather } = config
  const r = await geocode(query, geo)
  const first = r.results[0]
  if (!first) {
    throw new Error(`@mostajs/weather: aucun lieu trouvé pour « ${query} »`)
  }
  return fetchWeather({
    ...weather,
    location: { lat: first.lat, lon: first.lon, label: first.label ?? query },
  })
}

/**
 * Complète le libellé d'une position via reverse-geocoding si absent.
 * Renvoie `label` tel quel s'il est fourni, sinon l'adresse résolue, sinon "lat, lon".
 */
export async function resolveLabel(
  location: { lat: number; lon: number; label?: string },
  geo?: GeoConfig,
): Promise<string> {
  if (location.label) return location.label
  try {
    const r = await reverseGeocode({ lat: location.lat, lon: location.lon }, geo)
    return r.results[0]?.label ?? `${location.lat}, ${location.lon}`
  } catch {
    return `${location.lat}, ${location.lon}`
  }
}
