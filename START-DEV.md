# Start the app (one server, one port)

Do this when 3000/3001 feel broken or you see 404s.

## 1. Use only one dev server

- Close any terminal that’s running `npm run dev` (Ctrl+C).
- If you’re not sure, use only one terminal from now on.

## 2. Clean and start

In a terminal, from the project folder:

```bash
cd /Users/ivandiaz/Documents/Development/ravenstudios-next
rm -rf .next
npm run dev
```

Wait until you see **Ready** and **Local: http://localhost:3000**.

## 3. Open in a normal browser

- Open **Chrome**, **Safari**, or **Firefox** (not Cursor’s built-in browser).
- Go to: **http://localhost:3000**
- Do a hard refresh: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows).

Use only port **3000**. Don’t open 3001 unless you intentionally started the app with `npm run dev -- -p 3001`.
