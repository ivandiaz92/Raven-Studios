#!/usr/bin/env bash
# Run on the droplet to match GitHub, build, and restart.
# Usage: ./scripts/deploy.sh   (from repo root on the server)
#
# Uses git reset --hard to origin so:
# - Uncommitted edits on the server (e.g. from scp) never block deploy
# - The running app always matches what you pushed to Git
#
# Only .env.production and other gitignored files are kept. Set DEPLOY_GIT_BRANCH
# if you deploy from a branch other than main.
# Override PM2 name: PM2_APP_NAME=my-app ./scripts/deploy.sh
set -e
cd "$(dirname "$0")/.."
BRANCH="${DEPLOY_GIT_BRANCH:-main}"
PM2_NAME="${PM2_APP_NAME:-aspect-digital}"
LEGACY_PM2="${LEGACY_PM2_NAME:-ravenstudios}"

echo "Fetching origin/$BRANCH and syncing (discards local changes to tracked files)..."
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

echo "Installing dependencies..."
npm ci

echo "Building... (SKIP_STRAPI_BUILD=1 so Strapi 503s don't fail the build; data loads at runtime)"
SKIP_STRAPI_BUILD=1 npm run build

echo "Restarting PM2..."
if pm2 describe "$LEGACY_PM2" &>/dev/null; then
  echo "Removing legacy PM2 process: $LEGACY_PM2"
  pm2 delete "$LEGACY_PM2" || true
fi
pm2 restart "$PM2_NAME" 2>/dev/null || pm2 start npm --name "$PM2_NAME" -- start
pm2 save

echo "Done. Site should match commit: $(git rev-parse --short HEAD) (PM2: $PM2_NAME)"
