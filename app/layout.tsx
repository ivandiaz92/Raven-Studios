import './globals.css'
import type { Metadata } from 'next'
import { Hanken_Grotesk, Kode_Mono } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  SITE_NAME,
  SITE_NAME_MARK,
  SITE_TAGLINE,
  SITE_EDGE_LABEL,
  LOGO_DARK,
  DEFAULT_SITE_URL,
} from '@/lib/site-branding'

const hankenGrotesk = Hanken_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
})

const kodeMono = Kode_Mono({ 
  subsets: ['latin'],
  variable: '--font-kode',
  display: 'swap',
  adjustFontFallback: false,
})

// Roslindale Display will be added when font files are provided
// For now, we'll use a fallback serif font
const displayFontClass = 'font-serif'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME_MARK} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'We design and develop clear, functional, and well-structured digital experiences. Strategy, design and performance aligned with your objectives.',
  keywords: [
    'web development',
    'design',
    'portfolio',
    'digital agency',
    'next.js',
    'react',
    'branding',
    'UX',
    'UI',
  ],
  authors: [{ name: SITE_NAME, url: siteUrl }],
  creator: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: SITE_NAME,
    title: `${SITE_NAME_MARK} — ${SITE_TAGLINE}`,
    description:
      'We design and develop clear, functional, and well-structured digital experiences.',
    images: [
      {
        url: LOGO_DARK,
        width: 512,
        height: 512,
        alt: SITE_NAME_MARK,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME_MARK} — ${SITE_TAGLINE}`,
    description:
      'We design and develop clear, functional, and well-structured digital experiences.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: LOGO_DARK,
    apple: LOGO_DARK,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${hankenGrotesk.variable} ${kodeMono.variable}`}>
      <body className={`${hankenGrotesk.className} relative`}>
        {/* Single shared background for the whole page — dark base + subtle noise */}
        <div className="fixed inset-0 z-0" aria-hidden>
          <div className="absolute inset-0 bg-black" />
          <div
            className="absolute inset-0 bg-repeat opacity-[0.08]"
            style={{ backgroundImage: 'url(/images/dynamic_noise.png)', backgroundSize: 'auto' }}
          />
        </div>
        {/* Vertical branding on right edge (prototype-style) */}
        <div
          className="fixed right-4 sm:right-6 top-0 bottom-0 z-[1] w-6 flex items-center justify-center pointer-events-none"
          aria-hidden
        >
          <span
            className="font-mono text-[10px] sm:text-sm tracking-[0.12em] sm:tracking-[0.15em] text-white/30 uppercase whitespace-nowrap"
            style={{ transform: 'rotate(-90deg)' }}
          >
            {SITE_EDGE_LABEL}
          </span>
        </div>

        <Header />
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
        <Footer />
        {/* Only on `npm run dev` — if you don’t see this on localhost, you’re not on the dev server (or it’s stale: stop it, run: rm -rf .next && npm run dev) */}
        {process.env.NODE_ENV === 'development' && (
          <div
            className="fixed bottom-3 right-3 z-[100] max-w-[min(90vw,20rem)] rounded-md bg-emerald-950/95 text-emerald-200 text-[10px] sm:text-[11px] px-2.5 py-1.5 font-mono leading-snug border border-emerald-600/50 shadow-lg"
            title="Restart dev after next.config.js changes: Ctrl+C then rm -rf .next && npm run dev"
          >
            Local dev — restart server after config changes
          </div>
        )}
      </body>
    </html>
  )
}

