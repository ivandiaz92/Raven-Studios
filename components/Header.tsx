'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import SideMenu from './SideMenu'
import { LOGO_WHITE, LOGO_SVG_INTRINSIC } from '@/lib/site-branding'
import { NAV_LINKS, navLinkIsActive } from '@/lib/nav-links'

/** Pixels of scroll before auto-hide is allowed (keeps bar visible in hero) */
const SCROLL_DOWN_HIDE_AFTER = 72
/** Ignore tiny scroll jitter (device / subpixel) */
const DIRECTION_MIN_DELTA = 6

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const [logoError, setLogoError] = useState(false)
  const lastScrollY = useRef(0)
  const isMenuOpenRef = useRef(isMenuOpen)
  const reduceMotionRef = useRef(false)

  isMenuOpenRef.current = isMenuOpen

  useEffect(() => {
    lastScrollY.current = window.scrollY
  }, [pathname])

  useEffect(() => {
    if (isMenuOpen) {
      setHeaderVisible(true)
    }
  }, [isMenuOpen])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncReduce = () => {
      reduceMotionRef.current = mq.matches
      if (mq.matches) setHeaderVisible(true)
    }
    syncReduce()
    mq.addEventListener('change', syncReduce)
    return () => mq.removeEventListener('change', syncReduce)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setIsScrolled(y > 20)

      if (isMenuOpenRef.current) {
        setHeaderVisible(true)
        lastScrollY.current = y
        return
      }
      if (reduceMotionRef.current) {
        setHeaderVisible(true)
        lastScrollY.current = y
        return
      }

      if (y < 12) {
        setHeaderVisible(true)
        lastScrollY.current = y
        return
      }

      const prev = lastScrollY.current
      const delta = y - prev
      lastScrollY.current = y

      if (Math.abs(delta) < DIRECTION_MIN_DELTA) return

      if (delta > 0) {
        if (y > SCROLL_DOWN_HIDE_AFTER) {
          setHeaderVisible(false)
        }
      } else {
        setHeaderVisible(true)
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
        role="banner"
        className={`group fixed top-0 left-0 right-0 z-40 will-change-transform transition-[transform,background-color,backdrop-filter] duration-300 ease-out ${
          headerVisible
            ? 'translate-y-0'
            : 'pointer-events-none -translate-y-full focus-within:pointer-events-auto focus-within:translate-y-0'
        } ${
          isScrolled && headerVisible
            ? 'bg-black/90 backdrop-blur-md'
            : 'bg-transparent'
        } group-focus-within:bg-black/90 group-focus-within:backdrop-blur-md`}
      >
        <nav className="mx-auto w-[92%] max-w-[92vw] px-4 sm:px-5 lg:px-7 py-5 sm:py-6">
          <div className="relative flex min-h-[3rem] items-center justify-between gap-3 sm:gap-4">
            {/* Logo — left */}
            <div className="header-item relative z-20 shrink-0">
              <Link
                href="/"
                className="flex items-center min-h-12 min-w-12 -ml-2 pl-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-label="Inicio"
              >
                {!logoError ? (
                  <Image
                    src={LOGO_WHITE}
                    alt=""
                    width={logoW}
                    height={logoH}
                    className="h-7 w-auto sm:h-8 md:h-9 max-w-[min(52vw,200px)] object-contain object-left"
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
            </div>

            {/* Desktop — centered nav */}
            <nav
              className="header-item pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
              aria-label="Principal"
            >
              <ul className="pointer-events-auto flex items-center gap-6 xl:gap-10">
                {NAV_LINKS.map((link) => {
                  const active = navLinkIsActive(pathname, link.href)
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        prefetch={link.href === '/contact' ? false : undefined}
                        className={`inline-flex min-h-12 items-center font-mono text-xs xl:text-sm uppercase tracking-[0.12em] xl:tracking-[0.18em] transition-colors whitespace-nowrap rounded-sm px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                          active
                            ? 'text-[#7dd3fc]'
                            : 'text-white/90 hover:text-[#7dd3fc]'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Right — Cotiza + mobile menu */}
            <div className="header-item relative z-20 flex shrink-0 items-center gap-2 sm:gap-3 lg:ml-1 xl:ml-2">
              <Link
                href="/agenda"
                className="inline-flex min-h-12 items-center justify-center rounded-sm bg-[#7dd3fc] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-black transition-colors hover:bg-[#7dd3fc]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:px-5 sm:py-2.5 sm:text-xs sm:tracking-[0.2em] lg:px-6"
              >
                Agenda llamada
              </Link>
              <button
                type="button"
                className="inline-flex min-h-12 min-w-12 items-center justify-center font-mono text-xs uppercase tracking-[0.15em] text-white border border-[#7dd3fc] px-3 py-2 transition-all hover:bg-[#7dd3fc]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:min-w-0 sm:px-4 sm:text-sm sm:tracking-widest lg:hidden"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Abrir menú"
              >
                Menú
              </button>
            </div>
          </div>
        </nav>
      </header>

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}
