import './alliance-fonts.css'
import './globals.css'
import type { Metadata, Viewport } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  SITE_NAME,
  SITE_NAME_MARK,
  SITE_TAGLINE,
  SITE_EDGE_LABEL,
  LOGO_DARK,
} from '@/lib/site-branding'
import { getSiteUrl, getMetadataBaseUrl } from '@/lib/site-url'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: getMetadataBaseUrl(),
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="relative">
        {/* Single shared background for the whole page — dark base + subtle noise */}
        <div className="fixed inset-0 z-0" aria-hidden>
          <div className="absolute inset-0 bg-black" />
          <div className="page-bg-orbits pointer-events-none absolute inset-0 overflow-hidden">
            <div className="page-bg-orb page-bg-orb--1" />
            <div className="page-bg-orb page-bg-orb--2" />
            <div className="page-bg-orb page-bg-orb--3" />
            <div className="page-bg-orb page-bg-orb--4" />
            <div className="page-bg-orb page-bg-orb--5" />
          </div>
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
        <main className="relative z-10 min-h-screen w-full min-w-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

