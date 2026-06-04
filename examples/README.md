# Exemples — @mostajs/weather

Démonstration de **toutes les possibilités** de `@mostajs/weather` (et de `@mostajs/geo` qu'il compose).

## Prérequis
```bash
# depuis la racine du module
npm install          # installe @mostajs/geo + devDeps
npm run build        # génère dist/ (l'exemple importe le paquet construit)

cp examples/.env.example examples/.env   # puis renseigner la clé
```

`examples/.env` (gitignoré) :
```
NEXT_PUBLIC_OPENWEATHER_KEY=...   # https://home.openweathermap.org/api_keys
# GEO_GOOGLE_KEY=...   GEO_MAPBOX_KEY=...   (optionnels)
```

## Lancer
```bash
node examples/all-usages.mjs
```
Sans clé OWM → les sections météo « réelles » basculent automatiquement en **mode démo** (`isRealData:false`). Le géocodage `osm` reste réel (gratuit) ; `demo` fonctionne hors-ligne.

## Ce qui est démontré
1. Utilitaires : `isFlyable`, `msToKmh`, `getConditionIcon`, `DEFAULT_CRITERIA`, `CONDITION_ICONS`
2. `getMockWeather` (démo)
3. `fetchWeather({ location: {lat,lon} })` (réel)
4. `fetchWeather` + `flyabilityCriteria` personnalisés / `units` / `lang`
5. `fetchWeatherByPlace(query, { geo:{provider:'osm'} })` — géocodage réel via **@mostajs/geo**
6. `fetchWeatherByPlace` en mode `demo` (hors-ligne)
7. `resolveLabel` (libellé fourni vs reverse-geocoding)
8. `@mostajs/geo` : `distance`, `bearing`, `nearest`, `isWithin`, `boundingBox`, `geohashEncode`
9. `@mostajs/geo` : `geocode` / `reverseGeocode` (OSM réel)
10. `WeatherPage` (composant React — extrait d'usage)

> ⚠ La clé dans `examples/.env` ne doit **jamais** être committée (le dossier est couvert par `.gitignore`). Le dossier `examples/` n'est pas publié sur npm (champ `files`).
