#!/usr/bin/env bash
# Run the Next.js dev server; exit with a clear message if Node is missing.

set -e
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found. Install from https://nodejs.org (LTS), then restart the terminal and run this again."
  exit 1
fi

npm run dev
