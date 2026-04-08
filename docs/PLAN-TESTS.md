# @mostajs/weather — Plan de tests
// Author: Dr Hamid MADANI drmdh@msn.com
// Date: 2026-04-07

---

## 1. Tests unitaires (sans API, sans reseau)

### T1 — Conditions et flyability
- [ ] `msToKmh(0)` === 0
- [ ] `msToKmh(1)` === 4 (3.6 arrondi)
- [ ] `msToKmh(6.94)` === 25
- [ ] `msToKmh(10)` === 36
- [ ] `isFlyable(15, 'Clear')` === true
- [ ] `isFlyable(26, 'Clear')` === false (> 25 km/h)
- [ ] `isFlyable(15, 'Rain')` === false (forbidden)
- [ ] `isFlyable(15, 'Thunderstorm')` === false
- [ ] `isFlyable(15, 'Snow')` === false
- [ ] `isFlyable(15, 'Clouds')` === true
- [ ] `isFlyable(15, 'Clear', { maxWindKmh: 10, minVisibilityKm: 3, forbiddenConditions: [] })` === false (custom criteria)
- [ ] `getConditionIcon('Clear')` === emoji soleil
- [ ] `getConditionIcon('Unknown')` === emoji par defaut

### T2 — Mock data
- [ ] `getMockWeather({ location: { lat: 36.75, lon: 3.06, label: 'Alger' } })` → WeatherData
- [ ] `isRealData === false`
- [ ] `forecast.length === 5`
- [ ] Location label utilise dans `location`
- [ ] Contient au moins 1 alerte (demo mode)

### T3 — Default criteria
- [ ] `DEFAULT_CRITERIA.maxWindKmh === 25`
- [ ] `DEFAULT_CRITERIA.minVisibilityKm === 3`
- [ ] `DEFAULT_CRITERIA.forbiddenConditions` contient Rain, Thunderstorm, Snow

---

## 2. Tests API (avec cle OpenWeatherMap)

### T4 — Fetch weather reel
- [ ] `fetchWeather({ apiKey: OPENWEATHER_KEY, location: { lat: 48.85, lon: 2.35, label: 'Paris' } })` → WeatherData
- [ ] `isRealData === true`
- [ ] `current.temp` est un nombre
- [ ] `current.wind` est un nombre >= 0
- [ ] `forecast.length >= 3`
- [ ] Chaque forecast a un champ `flyable` boolean

### T5 — Demo mode (pas de cle)
- [ ] `fetchWeather({ location: { lat: 48.85, lon: 2.35 } })` → WeatherData
- [ ] `isRealData === false`
- [ ] Retourne les memes donnees que getMockWeather

---

## 3. Matrice de couverture

| Test | Type | Script |
|---|---|---|
| T1 Conditions | Unitaire | test-unit.sh |
| T2 Mock data | Unitaire | test-unit.sh |
| T3 Default criteria | Unitaire | test-unit.sh |
| T4 API reelle | Integration | test-api.sh (necessite OPENWEATHER_KEY) |
| T5 Demo mode | Unitaire | test-unit.sh |
