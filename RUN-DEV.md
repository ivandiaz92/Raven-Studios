# Run the dev server (and fix 404 for CSS/JS)

If you see **404** for `layout.css`, `main-app.js`, or other `_next/static` files, the wrong server is on port 3000 or the app wasn’t started from this folder.

## 1. Use the project folder

Always run commands **inside** the Next.js project:

```bash
cd /Users/ivandiaz/Documents/Development/ravenstudios-next
```

Check you’re in the right place:

```bash
pwd
# Should end with: .../ravenstudios-next
ls package.json
# Should show: package.json
```

## 2. Free port 3000 and start Next

**Option A – Same terminal**

```bash
cd /Users/ivandiaz/Documents/Development/ravenstudios-next
rm -rf .next
npm run dev
```

**Option B – If 3000 might be in use (another app, old process)**

Run on another port:

```bash
cd /Users/ivandiaz/Documents/Development/ravenstudios-next
rm -rf .next
npm run dev -- -p 3001
```

Then open **http://localhost:3001** (not 3000).

## 3. Confirm it’s Next.js

In the terminal you should see something like:

- `▲ Next.js 14.x.x`
- `- Local: http://localhost:3000` (or 3001)
- `✓ Ready in ...`

If you don’t see that, you’re not running Next in this project.

## 4. Open the app in a new tab

- Wait until it says **Ready** (and any “Compiling…” finishes).
- Open a **new** browser tab (or an incognito window).
- Go to **http://localhost:3000** (or **http://localhost:3001** if you used `-p 3001`).

Do **not** use an old tab that was open before you restarted the server.

## 5. If you still get 404

- Quit Cursor’s “Run Task” or any other runner that might start a server.
- In Terminal, run **only**:

  ```bash
  cd /Users/ivandiaz/Documents/Development/ravenstudios-next
  rm -rf .next
  npm run dev
  ```

- In the browser, use a **new** tab and go to **http://localhost:3000**.

If 404 persists, another process is probably using port 3000. Then use:

```bash
npm run dev -- -p 3001
```

and open **http://localhost:3001**.
