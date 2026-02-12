# Raven Studios - Next.js Portfolio Site

A modern portfolio and blog website built with Next.js, Strapi CMS, and GSAP animations.

## Features

- 🎨 Modern, responsive design
- 📱 Mobile-first approach
- 🚀 Fast performance with Next.js
- ✨ Smooth animations with GSAP
- 📝 Blog functionality
- 💼 Portfolio showcase
- 🔌 Headless CMS with Strapi

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

**Note:** `setup.sh` uses nvm to install Node.js 20 if needed. If you don't have nvm, install it first: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash`, then reopen your terminal and run `./setup.sh` again.

### Manual installation

**Prerequisites:** Node.js 18+ (or use nvm + `setup.sh` above). Strapi is optional for blog/portfolio content.

1. Install dependencies: `npm install`
2. Create `.env.local` with: `NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337/api`
3. Run: `npm run dev` → open [http://localhost:3000](http://localhost:3000)

## Strapi Setup

See `STRAPI_SETUP.md` for detailed instructions on setting up your Strapi backend.

## Project Structure

```
ravenstudios-next/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utilities and API clients
├── types/           # TypeScript types
└── public/          # Static assets
```

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **GSAP** - Animations
- **Strapi** - Headless CMS
- **Axios** - HTTP client

