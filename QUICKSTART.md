# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` only if you need contact/booking variables:

```env
NEXT_PUBLIC_CALCOM_BOOKING_URL=https://cal.com/aspect/15min
```

### 3. Add Content

Projects are JSON files in `content/projects/`; blog posts are Markdown files in `content/blog/`.
See `content/README.md` for examples.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

## Project Structure

```
aspect-digital/   # or your local clone folder name
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage
│   ├── portfolio/         # Portfolio pages
│   ├── blog/              # Blog pages
│   ├── contact/           # Contact page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Site footer
│   ├── PortfolioCard.tsx  # Portfolio card component
│   └── BlogCard.tsx       # Blog card component
├── content/               # Local projects and blog posts
├── lib/                   # Utilities and content loaders
└── public/                # Static assets
```

## Features

✅ **Modern Design**: Dark theme with gradient accents
✅ **GSAP Animations**: Smooth scroll-triggered animations
✅ **Responsive**: Mobile-first design
✅ **Portfolio**: Static portfolio pages from local JSON
✅ **Blog**: Static blog pages from local Markdown
✅ **SEO Optimized**: Metadata and static generation
✅ **Type Safe**: Full TypeScript support

## Customization

### Colors

Edit `tailwind.config.ts` to customize the color scheme. The current theme uses:
- Purple (#a855f7) and Pink (#ec4899) gradients
- Dark background (#0a0a0a)

### Animations

GSAP animations are configured in:
- `components/Header.tsx`
- `components/Footer.tsx`
- `app/page.tsx`
- Individual card components

### Content

All content is managed in Git through `content/projects/*.json` and `content/blog/*.md`.

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Deploy to Digital Ocean

1. Build the project: `npm run build`
2. Use PM2 or Docker to run the production server
3. Set up reverse proxy (nginx) if needed
4. Configure environment variables

## Troubleshooting

### Content Not Showing

- Verify project files are valid JSON in `content/projects/`
- Verify blog posts have frontmatter in `content/blog/`
- Restart the dev server after adding new files

### Images Not Loading

- Verify image paths start with `/` and point to files under `public/`
- Check Next.js image configuration in `next.config.js`

### Build Errors

- Ensure all dependencies are installed
- Check TypeScript errors: `npm run lint`
- Verify environment variables are set

## Next Steps

1. Add your portfolio items in `content/projects`
2. Create blog posts in `content/blog`
4. Customize the design to match your brand
5. Deploy!

