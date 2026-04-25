# Aspect Digital — Next.js portfolio site

A modern portfolio and blog website built with Next.js, local file-based content, and GSAP animations.

## Features

- 🎨 Modern, responsive design
- 📱 Mobile-first approach
- 🚀 Fast performance with Next.js
- ✨ Smooth animations with GSAP
- 📝 Blog functionality
- 💼 Portfolio showcase
- 🗂️ Local JSON/Markdown content for projects and blog posts

## Getting Started

### One-command setup (recommended)

From the project root, run:

```bash
chmod +x setup.sh && ./setup.sh
```

Then start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

**Dev / “missing required error components, refreshing” / no CSS / spam `GET /contact 404`:** This comes from a **buggy or half-written dev cache** in Next (and was worse with **Turbopack**). A corrupt `.next` can make **real routes 404 in dev** even though `npm run build` works — so `/contact` keeps failing while lots of `Link` components try to prefetch it. **Fix: Ctrl+C** → **`npm run dev:reset`**. The repo also sets **`prefetch={false}`** on most `/contact` links to **reduce** duplicate requests (does not replace a cache reset if dev is broken). This repo’s **`npm run dev` uses Webpack only**; **`dev:turbo` was removed**. **Never run** `npx next dev --turbo` here unless you accept repeated dev glitches.

**Site looks unstyled, no Tailwind, or red errors?** Same as above: bad `.next` cache. Use **`npm run dev:reset`**. Production **`npm run build` + `npm start`** is not affected. **`globals.css` is fine** if the build passes.

**Note:** `setup.sh` uses nvm to install Node.js 20 if needed. If you don't have nvm, install it first: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash`, then reopen your terminal and run `./setup.sh` again.

### Manual installation

**Prerequisites:** Node.js 18+ (or use nvm + `setup.sh` above).

1. Install dependencies: `npm install`
2. Copy `.env.local.example` to `.env.local` if you need contact/booking variables.
3. Run: `npm run dev` → open [http://localhost:3000](http://localhost:3000)

## Content

Projects live in `content/projects/*.json`; blog posts live in `content/blog/*.md`.
See `content/README.md` for the field format and examples.

## Project Structure

```
aspect-digital/        # local folder name (may differ)
├── app/              # Next.js app directory
├── components/       # React components
├── content/          # Local projects and blog posts
├── lib/             # Utilities and API clients
└── public/          # Static assets
```

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **GSAP** - Animations

