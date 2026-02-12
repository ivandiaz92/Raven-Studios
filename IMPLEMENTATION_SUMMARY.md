# Implementation Summary

Current state of the Raven Studios Next.js site (as of the latest updates).

---

## Design System

- **Background:** Single full-page layer: black base + subtle noise (`/images/dynamic_noise.png`). No gradient; shared across all pages.
- **Content width:** `w-[90%] max-w-[90vw] mx-auto` with `px-4 sm:px-6 lg:px-8` for main sections.
- **Typography:** 
  - **Display (headings):** Roslindale Display (`font-display`) from `/public/fonts/roslindale/` (TTF).
  - **Body:** Hanken Grotesk (Google Fonts).
  - **Mono (labels, CTAs):** Kode Mono (Google Fonts).
- **Accent:** Cyan `#7dd3fc` for links, hover states, borders, and highlights. No purple gradients on main titles.
- **Section spacing:** `py-16 sm:py-20 lg:py-24`; page top padding `pt-20` for fixed header.

---

## Fonts

- **Hanken Grotesk** – body and UI.
- **Kode Mono** – monospace (buttons, labels, “Get in touch”).
- **Roslindale Display** – hero and section headings; loaded via `@font-face` from `public/fonts/roslindale/Roslindale-DisplayCondensedRegular-Testing.ttf`.

---

## Header & Navigation

- **Layout:** RAVEN (left) + center logo (`/images/raven-logo.avif`) + Menu (right). Sizes scale (e.g. `text-3xl`–`text-4xl`, logo `h-12`–`h-14`).
- **Side menu (SideMenu.tsx):**
  - Opens from the right with GSAP; **smooth close** (panel slides out, overlay fades).
  - Nav links (Home, Portfolio, Blog, Contact) + “Get in touch” + email + **logo bottom-right**.
  - Active route highlighted in cyan.

---

## Home Page

### Hero
- Headline: “Digital crafts” / “for ambitious brands” (display font, cyan on second line).
- Subtext + **CTA:** “Start your project” → `/contact` with **slot-machine hover** (letters cycle then land).
- **Asteroid image** (`/images/asteroid.avif`), slightly raised; **breathing** scale animation on asteroid only (GSAP).
- **Project carousel** below hero: Strapi projects, auto-scroll, grayscale → color on hover, “View project” → `/portfolio/[id]`.

### Strategy / Services
- Three cards (Digital Development, Visual Design & Narrative, Performance & Growth) with hover backgrounds and **circuit** line animation (SVG stroke along border).
- **CTA:** “Let’s align on your objectives” → `/contact` (same style as hero CTA).

### Portfolio (vertical scroll)
- **PortfolioScrollSection:** Sticky left (“Portfolio” + “Selected work”), right column one project per viewport; image, client name, description, “View project” → `/portfolio/[id]`.

### Our Approach
- **OurApproachSection:** Two columns: left = step list (001–004), right = content (image + description + “How we help”). Steps: Discovery & Research, Strategy, UX/UI Design, Custom Development.
- **CTA:** “Begin with discovery” → `/contact` in the content area.

### Latest Insights
- Heading + “Read All Posts” → `/blog`.

### Contact (before footer)
- **ContactSection:** Dark rounded panel, two columns: left = “Ready to elevate your brand?” + copy; right = form (Name, Email, Service dropdown, Message, Send). Styling matches design system; form submit is client-side (TODO: wire to API/form service).

---

## Other Pages

- **Portfolio listing (`/portfolio`):** Same width/typography as home; left-aligned “Our Portfolio” + grid of **PortfolioCard** (hover cyan border, display font title).
- **Project detail (`/portfolio/[slug]):** Back link (mono, border), hero image (constrained height), client name (display), description. Uses project `id` as slug (e.g. `/portfolio/1`).
- **Blog, Contact:** Present; contact page can mirror or link to home contact section.

---

## Strapi Integration

- **Projects API:** `client_name`, `project_description`, `main_mockup` (image). Used by carousel, portfolio scroll, portfolio listing, and project detail.
- **Helpers:** `getProjects()`, `getProjectById(id)`, `getProjectImageUrl(project)` in `lib/strapi.ts`. Errors from Strapi are caught so the site works without a running backend.
- **Setup:** See `STRAPI_SETUP.md`; ensure Projects content type matches the fields above and permissions are set.

---

## Key Components

| Component | Purpose |
|----------|---------|
| `Header.tsx` | Fixed header: RAVEN, logo, Menu (opens SideMenu) |
| `SideMenu.tsx` | Slide-out nav + get in touch + logo; smooth close |
| `ProjectCarousel.tsx` | Hero carousel of Strapi projects |
| `PortfolioScrollSection.tsx` | Vertical scroll portfolio on home |
| `ServiceCard.tsx` | Strategy cards with circuit animation, hover bg image |
| `OurApproachSection.tsx` | Two-column approach steps + CTAs |
| `ContactSection.tsx` | Contact form panel (home, before footer) |
| `PortfolioCard.tsx` | Card for `/portfolio` grid |
| `Footer.tsx` | Site footer |

---

## Git & Repo

- **Repository:** [github.com/ivandiaz92/Raven-Studios](https://github.com/ivandiaz92/Raven-Studios)
- **Branch:** `main`
- **Hook:** `.git/hooks/commit-msg` strips “Co-authored-by: Cursor” from commit messages (local only; not in repo).

---

## Config & Assets

- **Next:** `next.config.js` (e.g. `assetPrefix: '/next'` if needed for Cursor/embedded browser).
- **Middleware:** Handles rewrites for `/_next/static` where required.
- **Images:** `public/images/` (asteroid, logo, noise, service backgrounds, etc.). Project images come from Strapi.

---

## Possible Next Steps

- Wire contact form to an API or form service (e.g. Resend, Formspree, Strapi).
- Add project-specific images for Our Approach steps (`approach-001.jpg` etc.) if desired.
- Optional retouches to portfolio scroll section.
- Add CTAs to portfolio listing/detail if desired (e.g. “Start a similar project” → contact).

---

## Files Overview

**New/notable:**  
`app/HomeClient.tsx`, `components/SideMenu.tsx`, `components/ProjectCarousel.tsx`, `components/PortfolioScrollSection.tsx`, `components/OurApproachSection.tsx`, `components/ContactSection.tsx`, `components/ServiceCard.tsx`, `components/PortfolioCard.tsx`, `app/portfolio/page.tsx`, `app/portfolio/[slug]/page.tsx`, `lib/strapi.ts`, `types/strapi.ts`, `middleware.ts`, `app/globals.css` (circuit keyframes, fonts).

**Layout/global:**  
`app/layout.tsx` (fonts, shared background), `app/page.tsx` (fetches projects, renders HomeClient).
