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

Edit `.env.local` and set your Strapi API URL:

```env
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337/api
```

### 3. Set Up Strapi Backend

Follow the instructions in `STRAPI_SETUP.md` to:
- Install and configure Strapi
- Create Portfolio and Blog Post content types
- Set up permissions
- Add your content

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

## Project Structure

```
ravenstudios-next/
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
├── lib/                   # Utilities
│   └── strapi.ts          # Strapi API client
├── types/                 # TypeScript types
│   └── strapi.ts          # Strapi type definitions
└── public/                # Static assets
```

## Features

✅ **Modern Design**: Dark theme with gradient accents
✅ **GSAP Animations**: Smooth scroll-triggered animations
✅ **Responsive**: Mobile-first design
✅ **Portfolio**: Dynamic portfolio pages with Strapi
✅ **Blog**: Dynamic blog pages with Strapi
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

All content is managed through Strapi CMS. See `STRAPI_SETUP.md` for content type configuration.

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

### Strapi Connection Issues

- Verify `NEXT_PUBLIC_STRAPI_API_URL` is correct
- Check Strapi permissions (Public role should have find/findOne)
- Ensure Strapi is running and accessible

### Images Not Loading

- Check Strapi media library permissions
- Verify image URLs in Strapi response
- Check Next.js image configuration in `next.config.js`

### Build Errors

- Ensure all dependencies are installed
- Check TypeScript errors: `npm run lint`
- Verify environment variables are set

## Next Steps

1. Set up your Strapi backend
2. Add your portfolio items
3. Create blog posts
4. Customize the design to match your brand
5. Deploy!

