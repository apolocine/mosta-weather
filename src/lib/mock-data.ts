// @mostajs/weather — Mock data for demo mode
// Extracted from booking-baloon /weather/page.tsx
// Author: Dr Hamid MADANI drmdh@msn.com
import type { WeatherData, WeatherConfig } from '../types/index.js'

/**
 * Generate mock weather data for demo mode (no API key).
 */
export function getMockWeather(config: WeatherConfig): WeatherData {
  const label = config.location.label ?? `${config.location.lat}, ${config.location.lon}`

  return {
    location: label,
    lat: config.location.lat,
    lon: config.location.lon,
    isRealData: false,
    current: {
      temp: 22,
      humidity: 45,
      wind: 12,
      visibility: 10,
      condition: 'Clear',
      icon: '\u2600\uFE0F',
    },
    forecast: [
      { day: 'Lun', temp: 24, wind: 10, condition: 'Clear', icon: '\u2600\uFE0F', flyable: true },
      { day: 'Mar', temp: 21, wind: 18, condition: 'Clouds', icon: '\u26C5', flyable: true },
      { day: 'Mer', temp: 19, wind: 28, condition: 'Rain', icon: '\uD83C\uDF27\uFE0F', flyable: false },
      { day: 'Jeu', temp: 23, wind: 8, condition: 'Clear', icon: '\u2600\uFE0F', flyable: true },
      { day: 'Ven', temp: 25, wind: 15, condition: 'Clouds', icon: '\u26C5', flyable: true },
    ],
    alerts: [
      { type: 'info', message: 'Donnees de demonstration — configurez apiKey pour les donnees reelles', severity: 'warn' },
    ],
  }
}
