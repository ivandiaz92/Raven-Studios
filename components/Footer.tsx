'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { SITE_NAME, LOGO_WHITE, LOGO_SVG_INTRINSIC } from '@/lib/site-branding'

export default function Footer() {
  const pathname = usePathname()
  const revealedRef = useRef(false)

  useEffect(() => {
    revealedRef.current = false
    const footer = document.querySelector('footer')
    if (!footer) return

    const items = gsap.utils.toArray<HTMLElement>('.footer-item')

    const reveal = () => {
      if (revealedRef.current) return
      revealedRef.current = true
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
      })
    }

    /** True if any part of the footer is already in the viewport */
    const footerIntersectsViewport = () => {
      const rect = footer.getBoundingClientRect()
      return rect.top < window.innerHeight && rect.bottom > 0
    }

    // Already on screen (short pages like project detail, or client nav + scroll position):
    // ScrollTrigger’s “top 80%” never fires, so items used to stay at opacity 0 forever.
    if (footerIntersectsViewport()) {
      reveal()
      return
    }

    gsap.set(items, { opacity: 0, y: 20 })

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          reveal()
          io.disconnect()
        }
      },
      { root: null, rootMargin: '0px 0px 10% 0px', threshold: 0.05 }
    )

    io.observe(footer)

    return () => io.disconnect()
  }, [pathname])

  const currentYear = new Date().getFullYear()
  const { width: logoW, height: logoH } = LOGO_SVG_INTRINSIC

  return (
    <footer className="relative z-20 bg-black/50 border-t border-gray-800">
        <div className="mx-auto w-full max-w-[min(100%,90vw)] px-4 py-12 min-[480px]:px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="footer-item">
            <Link href="/" className="inline-block mb-4" aria-label="Home">
              <Image
                src={LOGO_WHITE}
                alt=""
                width={logoW}
                height={logoH}
                className="h-9 sm:h-10 w-auto max-w-[min(85vw,240px)] object-contain object-left"
                style={{ aspectRatio: `${logoW} / ${logoH}` }}
                unoptimized
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed [overflow-wrap:anywhere]">
              We design and develop clear, functional, and well-structured digital experiences.
            </p>
          </div>

          <div className="footer-item">
            <h4 className="text-lg font-semibold mb-4 text-white leading-snug">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/portfolio"
                  className="inline-flex min-h-11 items-center text-gray-400 hover:text-purple-400 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="inline-flex min-h-11 items-center text-gray-400 hover:text-purple-400 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/agenda"
                  className="inline-flex min-h-11 items-center text-gray-400 hover:text-purple-400 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Agenda una llamada
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  prefetch={false}
                  className="inline-flex min-h-11 items-center text-gray-400 hover:text-purple-400 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-item">
            <h4 className="text-lg font-semibold mb-4 text-white leading-snug">Connect</h4>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-gray-400 hover:text-purple-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-label="Twitter"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-gray-400 hover:text-purple-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-label="LinkedIn"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400 footer-item">
          <p>&copy; {currentYear} {SITE_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

