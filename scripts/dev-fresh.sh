#!/usr/bin/env bash
# Clean Next cache and start dev (use after next.config.js or dependency changes)
set -e
cd "$(dirname "$0")/.."
rm -rf .next node_modules/.cache
echo "Starting dev server (one terminal only; stop others with Ctrl+C first)..."
exec npm run dev
# Always uses port 3000 (see package.json). Open http://localhost:3000 — not 3001.
