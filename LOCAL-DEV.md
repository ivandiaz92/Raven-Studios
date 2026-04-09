# Local development

## “missing required error components, refreshing…” or `Cannot find module './276.js'`

This almost always means **webpack’s dev cache (`.next`) is corrupted** or **several `next dev` processes** are fighting (ports 3000, 3001, 3002…).

### Fix (do this in order)

1. **Stop every** dev server: **Ctrl+C** in every terminal running Next.
2. Kill stray processes on common ports:
   ```bash
   npm run kill-ports
   ```
3. Clean and start with **Turbopack** (default now — avoids the broken webpack chunk issue in dev):
   ```bash
   npm run dev:fresh
   ```
4. Open **`http://localhost:3000`** only.  
   **Do not use `localhost:3001` in your bookmarks** — when 3000 was busy, Next used to fall back to 3001 and leave a **second, broken** server running. Dev is now **pinned to 3000** so this happens less often.

If Turbopack ever misbehaves, use webpack instead:

```bash
rm -rf .next node_modules/.cache && npm run dev:webpack
```

### Stable local preview (no dev HMR)

If dev keeps acting up, use a production-style run:

```bash
npm run build && npm run start
```

Then open **`http://localhost:3000`**.

### Don’t

- Run **`npm run build`** and **`npm run dev`** at the same time in the same folder.
- Delete **`.next`** while **`npm run dev`** is still running (stop the server first).

### `.env.local`

Use a full URL for `NEXT_PUBLIC_SITE_URL`, e.g. `http://localhost:3000`.
