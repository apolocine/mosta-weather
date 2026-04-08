// @mostajs/weather — Conditions & flyability logic
// Extracted from booking-baloon /weather/page.tsx
// Author: Dr Hamid MADANI drmdh@msn.com
import type { FlyabilityCriteria } from '../types/index.js'

export const CONDITION_ICONS: Record<string, string> = {
  Clear: '\u2600\uFE0F',         // ☀️
  Clouds: '\u26C5',              // ⛅
  Rain: '\uD83C\uDF27\uFE0F',   // 🌧️
  Drizzle: '\uD83C\uDF26\uFE0F',// 🌦️
  Thunderstorm: '\u26C8\uFE0F', // ⛈️
  Snow: '\u2744\uFE0F',         // ❄️
  Mist: '\uD83C\uDF2B\uFE0F',  // 🌫️
  Fog: '\uD83C\uDF2B\uFE0F',   // 🌫️
  Haze: '\uD83C\uDF2B\uFE0F',  // 🌫️
}

export const DEFAULT_CRITERIA: FlyabilityCriteria = {
  maxWindKmh: 25,
  minVisibilityKm: 3,
  forbiddenConditions: ['Rain', 'Thunderstorm', 'Snow'],
}

/**
 * Determine if weather conditions allow flight.
 */
export function isFlyable(
  windKmh: number,
  condition: string,
  criteria?: FlyabilityCriteria,
): boolean {
  const c = criteria ?? DEFAULT_CRITERIA
  return windKmh < c.maxWindKmh && !c.forbiddenConditions.includes(condition)
}

/**
 * Convert wind speed from m/s to km/h.
 */
export function msToKmh(ms: number): number {
  return Math.round(ms * 3.6)
}

/**
 * Get emoji icon for a weather condition.
 */
export function getConditionIcon(condition: string): string {
  return CONDITION_ICONS[condition] || '\uD83C\uDF24\uFE0F' // 🌤️
}
