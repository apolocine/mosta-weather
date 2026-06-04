// @mostajs/weather — Weather module for @mostajs
// OpenWeatherMap, flyability criteria, alerts, demo mode
// Author: Dr Hamid MADANI drmdh@msn.com

// Types
export type {
  WeatherConfig,
  FlyabilityCriteria,
  CurrentWeather,
  Forecast,
  WeatherAlert,
  WeatherData,
} from './types/index.js'

// Client
export { fetchWeather } from './lib/weather-client.js'

// Géocodage de lieu → météo (compose @mostajs/geo)
export { fetchWeatherByPlace, resolveLabel, type PlaceWeatherConfig } from './lib/geo-bridge.js'

// Utilities
export { isFlyable, msToKmh, getConditionIcon, CONDITION_ICONS, DEFAULT_CRITERIA } from './lib/conditions.js'
export { getMockWeather } from './lib/mock-data.js'

// Components
export { WeatherPage } from './components/WeatherPage.js'

// Registration
export { weatherModuleRegistration } from './register.js'
