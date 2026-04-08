// @mostajs/weather — Types
// Author: Dr Hamid MADANI drmdh@msn.com

export interface WeatherConfig {
  /** OpenWeatherMap API key (omit for demo mode with mock data) */
  apiKey?: string
  /** Weather provider (extensible — currently only openweathermap) */
  provider?: 'openweathermap'
  /** Location to fetch weather for */
  location: { lat: number; lon: number; label?: string }
  /** Flyability criteria (optional — defaults provided) */
  flyabilityCriteria?: FlyabilityCriteria
  /** Language for weather descriptions (default: 'fr') */
  lang?: string
  /** Units system (default: 'metric') */
  units?: 'metric' | 'imperial'
}

export interface FlyabilityCriteria {
  /** Max wind speed in km/h for safe flight (default: 25) */
  maxWindKmh: number
  /** Min visibility in km for safe flight (default: 3) */
  minVisibilityKm: number
  /** Weather conditions that prevent flight */
  forbiddenConditions: string[]
}

export interface CurrentWeather {
  temp: number
  humidity: number
  /** Wind speed in km/h */
  wind: number
  /** Visibility in km */
  visibility: number
  /** Main condition (e.g. 'Clear', 'Rain', 'Clouds') */
  condition: string
  /** Emoji icon */
  icon: string
}

export interface Forecast {
  /** Day label (e.g. 'Lun', 'Mar') */
  day: string
  temp: number
  /** Wind speed in km/h */
  wind: number
  condition: string
  icon: string
  flyable: boolean
}

export interface WeatherAlert {
  type: string
  message: string
  severity: 'warn' | 'danger'
}

export interface WeatherData {
  location: string
  lat: number
  lon: number
  current: CurrentWeather
  forecast: Forecast[]
  alerts: WeatherAlert[]
  /** true if data comes from real API, false if mock */
  isRealData: boolean
}
