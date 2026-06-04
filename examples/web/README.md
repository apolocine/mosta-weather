# Exemple — Application web (page)

Page autonome **sans build** : charge `@mostajs/weather@0.2.0` et `@mostajs/geo@0.1.0` depuis npm (via [esm.sh](https://esm.sh)) + carte **MapLibre**.

## Lancer
```bash
cd examples/web
python3 -m http.server 8080
# puis ouvrir http://localhost:8080
```
(ou `npx serve .`). Un serveur HTTP est recommandé plutôt que `file://` pour le CORS des API.

## Utilisation
1. Saisir un **lieu** (ex. « Oran, Algérie »).
2. Choisir le **fournisseur** : `osm` (géocodage réel gratuit) ou `demo` (hors-ligne).
3. Coller votre **clé OpenWeatherMap** (https://home.openweathermap.org/api_keys) — stockée en `localStorage`, jamais committée. Sans clé → météo en **mode démo**.
4. « Voir la météo » → météo courante + prévisions 5 j (avec volabilité ✅/❌), alertes, **carte centrée + marqueur + geofence 2 km**.

## Ce que la page démontre
- `@mostajs/geo` : `geocode`, `distance`, `isWithin` (geofence dessinée sur la carte).
- `@mostajs/weather` : `fetchWeatherByPlace` (compose geo), `flyable`, alertes, mode démo.
- Carte **MapLibre GL** (fond OSM) — le défaut « zéro lock-in ».

> La clé OWM n'est **pas** dans le code (saisie + `localStorage`). Le dossier `examples/` n'est pas publié sur npm.
