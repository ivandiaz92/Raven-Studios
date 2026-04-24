'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { LOGO_WHITE, LOGO_SVG_INTRINSIC } from '@/lib/site-branding'
import { NAV_LINKS, navLinkIsActive } from '@/lib/nav-links'

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const pathname = usePathname()
  const isClosingRef = useRef(false)

  useEffect(() => {
    if (!isOpen) return
    if (isClosingRef.current) return

    // Animate menu in
    gsap.to('.side-menu-overlay', { opacity: 1, duration: 0.3 })
    gsap.fromTo(
      '.side-menu-panel',
      { x: '100%' },
      { x: '0%', duration: 0.4, ease: 'power3.out' }
    )
    gsap.fromTo(
      '.side-menu-item',
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, delay: 0.2, ease: 'power2.out' }
    )
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  function handleClose() {
    if (isClosingRef.current) return
    isClosingRef.current = true

    gsap.to('.side-menu-overlay', {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
    })
    gsap.to('.side-menu-panel', {
      x: '100%',
      duration: 0.35,
      ease: 'power3.in',
      onComplete: () => {
        isClosingRef.current = false
        onClose()
      },
    })
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="side-menu-overlay fixed inset-0 bg-black/80 z-40 opacity-0"
        onClick={handleClose}
      />

      {/* Side Panel */}
      <div className="side-menu-panel fixed top-0 right-0 z-50 h-full max-h-[100dvh] w-full overflow-y-auto overflow-x-hidden border-l border-gray-800 bg-black sm:max-w-md sm:w-96">
        {/* Close Button — min 48×48 tap target */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-md text-white transition-colors hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black min-[480px]:right-6 min-[480px]:top-6"
          aria-label="Close menu"
        >
          <svg
            className="h-8 w-8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation Links */}
        <nav className="flex min-h-0 flex-col items-start justify-center gap-6 px-8 py-20 min-[480px]:gap-8 min-[480px]:px-12 sm:py-24">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={link.href === '/contact' ? false : undefined}
              onClick={handleClose}
              className={`side-menu-item rounded-sm text-3xl min-[480px]:text-4xl sm:text-5xl font-light leading-tight tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                navLinkIsActive(pathname, link.href)
                  ? 'text-cyan-400'
                  : 'text-white hover:text-cyan-400'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Contact Info + Logo */}
          <div className="side-menu-item pt-12 w-full flex flex-wrap items-end justify-between gap-6">
            <div className="space-y-4 text-sm text-gray-400">
              <p className="font-mono text-xs tracking-wider uppercase text-gray-500">Get in touch</p>
              <a
                href="mailto:hello@aspect.studio"
                className="inline-flex min-h-11 min-w-0 max-w-full items-center break-all rounded-sm py-1 text-left hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black [overflow-wrap:anywhere]"
              >
                hello@aspect.studio
              </a>
            </div>
            <Link href="/" onClick={handleClose} className="flex-shrink-0" aria-label="Home">
              <Image
                src={LOGO_WHITE}
                alt=""
                width={LOGO_SVG_INTRINSIC.width}
                height={LOGO_SVG_INTRINSIC.height}
                className="h-10 sm:h-11 w-auto max-w-[min(70vw,220px)] object-contain opacity-90"
                style={{ aspectRatio: `${LOGO_SVG_INTRINSIC.width} / ${LOGO_SVG_INTRINSIC.height}` }}
                unoptimized
              />
            </Link>
          </div>
        </nav>
      </div>
    </>
  )
}
