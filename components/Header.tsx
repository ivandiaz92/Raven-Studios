'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import SideMenu from './SideMenu'
import { LOGO_WHITE, LOGO_SVG_INTRINSIC } from '@/lib/site-branding'

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

  const { width: logoW, height: logoH } = LOGO_SVG_INTRINSIC

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
          {/* Three columns: balance menu width so logo stays visually centered */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full gap-4">
            <div className="header-item" aria-hidden />

            <Link
              href="/"
              className="header-item justify-self-center flex items-center"
              aria-label="Home"
            >
              {!logoError ? (
                <Image
                  src={LOGO_WHITE}
                  alt=""
                  width={logoW}
                  height={logoH}
                  className="h-7 w-auto sm:h-8 md:h-9 max-w-[min(52vw,200px)] object-contain object-center"
                  style={{ aspectRatio: `${logoW} / ${logoH}` }}
                  unoptimized
                  priority
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span
                  className="block rounded-md bg-white/10 object-contain"
                  style={{
                    aspectRatio: `${logoW} / ${logoH}`,
                    height: '2rem',
                    width: 'auto',
                    minWidth: '6rem',
                  }}
                  aria-hidden
                />
              )}
            </Link>

            <div className="header-item justify-self-end">
              <button
                className="font-mono text-sm tracking-widest text-white border border-[#7dd3fc] px-5 py-2.5 hover:bg-[#7dd3fc]/10 transition-all uppercase"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
              >
                Menu
              </button>
            </div>
          </div>
        </nav>
      </header>

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}
