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

export const metadata: Metadata = {
  title: 'RAVEN - Digital Crafts for Ambitious Brands',
  description: 'We design and develop clear, functional, and well-structured digital experiences.',
  keywords: ['web development', 'design', 'portfolio', 'digital agency', 'next.js', 'react'],
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
        <Header />
        <main className="relative z-10 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

