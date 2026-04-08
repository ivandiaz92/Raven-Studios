'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import SideMenu from './SideMenu'
import { SITE_NAME_MARK, LOGO_WHITE } from '@/lib/site-branding'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [logoError, setLogoError] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    gsap.fromTo(
      '.header-item',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.2 }
    )
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <nav className="w-[90%] max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex items-center justify-between relative">
            {/* Left: wordmark — sans (Hanken), not display serif */}
            <Link
              href="/"
              className="header-item text-xl sm:text-2xl font-sans font-semibold tracking-[0.18em] text-white z-10"
            >
              {SITE_NAME_MARK}
            </Link>

            {/* Center: logo SVG (wide wordmark — height-led sizing, not a tiny square) */}
            <Link
              href="/"
              className="header-item absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center max-w-[55vw]"
              aria-label={`${SITE_NAME_MARK} — home`}
            >
              {!logoError ? (
                <Image
                  src={LOGO_WHITE}
                  alt=""
                  width={320}
                  height={96}
                  className="h-11 sm:h-14 md:h-16 w-auto max-h-[4rem] sm:max-h-[4.5rem] object-contain object-center"
                  unoptimized
                  priority
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="h-14 w-32 rounded-md bg-white/10" aria-hidden />
              )}
            </Link>

            {/* Right: Menu button */}
            <button
              className="header-item font-mono text-sm tracking-widest text-white border border-[#7dd3fc] px-5 py-2.5 hover:bg-[#7dd3fc]/10 transition-all uppercase"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              Menu
            </button>
          </div>
        </nav>
      </header>

      {/* Side Menu */}
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}

