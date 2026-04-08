// @mostajs/weather — WeatherPage component
// Generalized from booking-baloon /weather/page.tsx
// Author: Dr Hamid MADANI drmdh@msn.com
'use client'

import { useEffect, useState } from 'react'
import type { WeatherConfig, WeatherData } from '../types/index.js'
import { fetchWeather } from '../lib/weather-client.js'

interface WeatherPageProps {
  /** Weather configuration (location, API key, criteria) */
  config: WeatherConfig
  /** Callback for back navigation */
  onBack?: () => void
  /** Title override */
  title?: string
}

export function WeatherPage({ config, onBack, title }: WeatherPageProps) {
  const [data, setData] = useState<WeatherData | null>(null)

  useEffect(() => {
    fetchWeather(config).then(setData).catch(console.error)
  }, [config.apiKey, config.location.lat, config.location.lon])

  if (!data) {
    return <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>Chargement meteo...</div>
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold' }}>{title ?? `Meteo — ${data.location}`}</h1>
        {onBack && <button onClick={onBack} style={{ padding: '6px 16px', cursor: 'pointer' }}>Retour</button>}
      </div>

      {/* Demo mode banner */}
      {!data.isRealData && (
        <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 14 }}>
          Mode demo — configurez <code>apiKey</code> pour les donnees reelles
        </div>
      )}

      {/* Alerts */}
      {data.alerts.map((alert, i) => (
        <div key={i} style={{
          background: alert.severity === 'danger' ? '#fef2f2' : '#fffbeb',
          border: `1px solid ${alert.severity === 'danger' ? '#ef4444' : '#f59e0b'}`,
          borderRadius: 8, padding: 12, marginBottom: 8, fontSize: 14,
          color: alert.severity === 'danger' ? '#991b1b' : '#92400e',
        }}>
          {alert.severity === 'danger' ? '\u26A0\uFE0F' : '\u2139\uFE0F'} {alert.message}
        </div>
      ))}

      {/* Current weather */}
      <div style={{
        background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', borderRadius: 12,
        padding: 24, color: '#fff', marginBottom: 24, textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, fontWeight: 'bold' }}>{data.current.temp}&deg;C</div>
        <div style={{ fontSize: 32 }}>{data.current.icon}</div>
        <div style={{ fontSize: 16, opacity: 0.9, marginTop: 4 }}>{data.current.condition}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16, fontSize: 14 }}>
          <span>Vent : {data.current.wind} km/h</span>
          <span>Humidite : {data.current.humidity}%</span>
          <span>Visibilite : {data.current.visibility} km</span>
        </div>
      </div>

      {/* 5-day forecast */}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Previsions 5 jours</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
        {data.forecast.map((day, i) => (
          <div key={i} style={{
            border: `2px solid ${day.flyable ? '#22c55e' : '#ef4444'}`,
            borderRadius: 8, padding: 12, textAlign: 'center',
            background: day.flyable ? '#f0fdf4' : '#fef2f2',
          }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{day.day}</div>
            <div style={{ fontSize: 24 }}>{day.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 'bold' }}>{day.temp}&deg;C</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{day.wind} km/h</div>
            <div style={{ fontSize: 12, marginTop: 4, fontWeight: 500, color: day.flyable ? '#16a34a' : '#dc2626' }}>
              {day.flyable ? '\u2705 Vol OK' : '\u274C Vol risque'}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 24, fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>
        Coordonnees : {data.lat}, {data.lon} | {data.isRealData ? 'Donnees OpenWeatherMap' : 'Donnees de demonstration'}
      </div>
    </div>
  )
}
