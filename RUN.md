# How to run this project

If you see **"command not found: npm"** in Cursor, the project is set up to fix this. Use the steps below.

---

## Run from Cursor (recommended)

1. **Cmd + Shift + P** (Mac) or **Ctrl + Shift + P** (Windows) → type **Run Task** → choose **Tasks: Run Task**.
2. If this is your first time or you get **"command not found: npm"**, choose **Setup (install Node + deps, then start dev)**. It will install Node via nvm if needed, then start the dev server.
3. Otherwise choose **Start dev server**. (It loads nvm so `npm` is found.)
4. When you see “Ready” in the terminal, open **http://localhost:3000** in your browser.

---

## 1. Install Node.js (if you prefer the terminal)

If you’d rather run commands yourself, install Node first (pick one):

### Option A – Easiest (recommended)

1. Go to **https://nodejs.org**
2. Download the **LTS** version and run the installer.
3. **Close and reopen your terminal** (or Cursor).
4. Run: `node --version` — you should see something like `v20.x.x`.

### Option B – Using Homebrew (if you use brew)

```bash
brew install node
```

Then close/reopen the terminal and run `node --version`.

---

## 2. Run the project

In your terminal, from the project folder:

```bash
cd /Users/ivandiaz/Documents/Development/ravenstudios-next
npm install
npm run dev
```

Then open **http://localhost:3000** in your browser.

**Alternative:** From the project root you can run `bash run-dev.sh` instead of `npm run dev`. The script checks for Node and, if it’s missing, prints a short message telling you to install it from https://nodejs.org (LTS) and restart the terminal.

---

## If you still get "command not found"

- **After installing Node:** always **close and reopen** the terminal (or restart Cursor) so it picks up the new `node` and `npm`.
- **Which command failed?**  
  - `nvm` → you don’t have nvm; use Option A or B above and ignore nvm.  
  - `npm` or `node` → Node isn’t installed or not in PATH; install Node (Option A or B) and reopen the terminal.
