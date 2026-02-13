import './globals.css'
import type { Metadata } from 'next'
import { Hanken_Grotesk, Kode_Mono } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ravenstudios.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'RAVEN - Digital Crafts for Ambitious Brands',
    template: '%s | RAVEN',
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
  authors: [{ name: 'Raven Studios', url: siteUrl }],
  creator: 'Raven Studios',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'RAVEN',
    title: 'RAVEN - Digital Crafts for Ambitious Brands',
    description:
      'We design and develop clear, functional, and well-structured digital experiences.',
    images: [
      {
        url: '/images/Raven-white.svg',
        width: 512,
        height: 512,
        alt: 'RAVEN',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RAVEN - Digital Crafts for Ambitious Brands',
    description:
      'We design and develop clear, functional, and well-structured digital experiences.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/images/Raven-white.svg',
    apple: '/images/Raven-white.svg',
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
            RAVEN DIGITAL STUDIO
          </span>
        </div>

        <Header />
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

