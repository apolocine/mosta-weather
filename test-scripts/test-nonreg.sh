#!/usr/bin/env bash
# @mostajs/weather — non-régression après migration @mostajs/geo.
# Author: Dr Hamid MADANI drmdh@msn.com
# Pré-requis : deps installées (npm i) dont @mostajs/geo. Aucune clé/réseau (provider demo).
set -euo pipefail
cd "$(dirname "$0")/.."

echo "🔧 build..."
npm run build

echo "🧪 non-régression (NR1–NR5)..."
node --test test-scripts/non-regression.test.mjs
echo "✅ non-régression OK"
