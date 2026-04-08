#!/usr/bin/env bash
# Clean Next cache and start dev (use after next.config.js or dependency changes)
set -e
cd "$(dirname "$0")/.."
rm -rf .next
echo "Starting dev server..."
exec npm run dev
