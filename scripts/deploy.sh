#!/usr/bin/env bash
# Run on the droplet (or via ssh) to pull latest, build, and restart the Next.js app.
# Usage: ./scripts/deploy.sh   (from repo root on the server)
set -e
cd "$(dirname "$0")/.."
echo "Pulling latest..."
git pull
echo "Installing dependencies..."
npm ci
echo "Building... (SKIP_STRAPI_BUILD=1 so Strapi 503s don't fail the build; data loads at runtime)"
SKIP_STRAPI_BUILD=1 npm run build
echo "Restarting PM2..."
pm2 restart ravenstudios || pm2 start npm --name "ravenstudios" -- start
pm2 save
echo "Done."
