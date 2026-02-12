'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const pathname = usePathname()
  const isClosingRef = useRef(false)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ]

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
      <div className="side-menu-panel fixed top-0 right-0 h-full w-full sm:w-96 bg-black border-l border-gray-800 z-50 transform translate-x-full">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-8 right-8 text-white hover:text-cyan-400 transition-colors"
          aria-label="Close menu"
        >
          <svg
            className="w-8 h-8"
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
        <nav className="flex flex-col items-start justify-center h-full px-12 space-y-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleClose}
              className={`side-menu-item text-4xl sm:text-5xl font-light tracking-wide transition-colors ${
                pathname === link.href
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
                href="mailto:hello@raven.studio"
                className="block hover:text-cyan-400 transition-colors"
              >
                hello@raven.studio
              </a>
            </div>
            <Link href="/" onClick={handleClose} className="flex-shrink-0" aria-label="RAVEN Home">
              <Image
                src="/images/raven-logo.avif"
                alt=""
                width={56}
                height={56}
                className="h-12 w-12 sm:h-14 sm:w-14 object-contain opacity-90"
                unoptimized
              />
            </Link>
          </div>
        </nav>
      </div>
    </>
  )
}
