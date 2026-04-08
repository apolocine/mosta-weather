// @mostajs/weather — Weather API client (OpenWeatherMap)
// Extracted and generalized from booking-baloon /weather/page.tsx
// Author: Dr Hamid MADANI drmdh@msn.com
import type { WeatherConfig, WeatherData, WeatherAlert } from '../types/index.js'
import { getMockWeather } from './mock-data.js'
import { msToKmh, getConditionIcon, isFlyable, DEFAULT_CRITERIA } from './conditions.js'

const BASE_URL = 'https://api.openweathermap.org/data/2.5'

/**
 * Fetch current weather + 5-day forecast.
 * Returns mock data if no API key is configured.
 */
export async function fetchWeather(config: WeatherConfig): Promise<WeatherData> {
  if (!config.apiKey) {
    return getMockWeather(config)
  }

  const { lat, lon, label } = config.location
  const lang = config.lang ?? 'fr'
  const units = config.units ?? 'metric'
  const criteria = config.flyabilityCriteria ?? DEFAULT_CRITERIA
  const locationLabel = label ?? `${lat}, ${lon}`

  const params = `lat=${lat}&lon=${lon}&units=${units}&lang=${lang}&appid=${config.apiKey}`

  const [currentRes, forecastRes] = await Promise.all([
    fetch(`${BASE_URL}/weather?${params}`),
    fetch(`${BASE_URL}/forecast?${params}`),
  ])

  const currentJson = await currentRes.json() as {
    main: { temp: number; humidity: number }
    wind: { speed: number }
    visibility: number
    weather: { main: string }[]
  }

  const forecastJson = await forecastRes.json() as {
    list: {
      dt_txt: string
      main: { temp: number }
      wind: { speed: number }
      weather: { main: string }[]
    }[]
  }

  // Parse current weather
  const windKmh = msToKmh(currentJson.wind.speed)
  const condition = currentJson.weather[0]?.main ?? 'Clear'

  const current = {
    temp: Math.round(currentJson.main.temp),
    humidity: currentJson.main.humidity,
    wind: windKmh,
    visibility: Math.round(currentJson.visibility / 1000),
    condition,
    icon: getConditionIcon(condition),
  }

  // Parse 5-day forecast (1 entry per day from 3-hour intervals)
  const seen = new Set<string>()
  const forecast = forecastJson.list
    .filter(item => {
      const day = new Date(item.dt_txt).toLocaleDateString(lang, { weekday: 'short' })
      if (seen.has(day)) return false
      seen.add(day)
      return true
    })
    .slice(0, 5)
    .map(item => {
      const fCondition = item.weather[0]?.main ?? 'Clear'
      const fWind = msToKmh(item.wind.speed)
      return {
        day: new Date(item.dt_txt).toLocaleDateString(lang, { weekday: 'short' }),
        temp: Math.round(item.main.temp),
        wind: fWind,
        condition: fCondition,
        icon: getConditionIcon(fCondition),
        flyable: isFlyable(fWind, fCondition, criteria),
      }
    })

  // Generate alerts
  const alerts: WeatherAlert[] = []
  if (windKmh > criteria.maxWindKmh) {
    alerts.push({ type: 'wind', message: `Vent fort : ${windKmh} km/h`, severity: 'danger' })
  } else if (windKmh > criteria.maxWindKmh * 0.8) {
    alerts.push({ type: 'wind', message: `Vent modere : ${windKmh} km/h`, severity: 'warn' })
  }

  const badDays = forecast.filter(f => !f.flyable)
  if (badDays.length > 0) {
    alerts.push({
      type: 'forecast',
      message: `${badDays.length} jour(s) defavorable(s) dans les 5 prochains jours`,
      severity: 'warn',
    })
  }

  return {
    location: locationLabel,
    lat,
    lon,
    current,
    forecast,
    alerts,
    isRealData: true,
  }
}
