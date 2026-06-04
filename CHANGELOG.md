# Changelog — @mostajs/weather

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) · Versionnage : [SemVer](https://semver.org/lang/fr/).
Auteur : Dr Hamid MADANI <drmdh@msn.com>

## [Non publié] — branche `feat/consume-mostajs-geo`

### Ajouté
- **`fetchWeatherByPlace(query, config?)`** — résout un lieu (texte) via **`@mostajs/geo`** (géocodage) puis récupère la météo. `config.geo` choisit le fournisseur (`osm` par défaut, `demo`, `google`, `mapbox`).
- **`resolveLabel(location, geo?)`** — complète un libellé manquant par reverse-geocoding.
- Dépendance **`@mostajs/geo` ^0.1.0** (composition — DEVRULES §0/§10 ; le géocodage n'est plus à réimplémenter).
- `test-scripts/non-regression.test.mjs` + `test-scripts/test-nonreg.sh` — **non-régression** (NR1–NR5) : API existante inchangée + nouvelle voie « par lieu » hors-ligne (provider `demo`). ✅ 5/5 verts.

### Inchangé (non-régression vérifiée)
- `fetchWeather({ location: { lat, lon } })`, `getMockWeather`, `isFlyable`, `msToKmh`, `WeatherPage` : **API et comportement identiques** (NR1–NR3).

### Note
- Étude de composition stockage/archivage : voir `mosta-geo/docs/COMPOSITION-STORAGE-IXARCHIVE-GEO-WEATHER.md` — `weather` n'a aucun besoin `storage`/`ixarchive` (stateless).
