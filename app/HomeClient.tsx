'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectCarousel from '@/components/ProjectCarousel'
import PortfolioScrollSection from '@/components/PortfolioScrollSection'
import OurApproachSection from '@/components/OurApproachSection'
import ContactSection from '@/components/ContactSection'
import ServiceCard from '@/components/ServiceCard'
import type { StrapiProject } from '@/types/strapi'

gsap.registerPlugin(ScrollTrigger)

interface HomeClientProps {
  projects: StrapiProject[]
}

const HERO_CTA_TEXT = 'Start your project'
const SLOT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export default function HomeClient({ projects }: HomeClientProps) {
  const asteroidRef = useRef<HTMLDivElement>(null)
  const [ctaHovered, setCtaHovered] = useState(false)
  const [ctaDisplay, setCtaDisplay] = useState(HERO_CTA_TEXT)
  const slotIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Slot-machine effect: on hover, letters cycle through random chars then land one by one
  useEffect(() => {
    if (!ctaHovered) {
      setCtaDisplay(HERO_CTA_TEXT)
      if (slotIntervalRef.current) {
        clearInterval(slotIntervalRef.current)
        slotIntervalRef.current = null
      }
      return
    }
    const len = HERO_CTA_TEXT.length
    const tickMs = 45
    const landDelay = 50
    const start = performance.now()
    slotIntervalRef.current = setInterval(() => {
      const elapsed = performance.now() - start
      let next = ''
      for (let i = 0; i < len; i++) {
        const landAt = 150 + i * landDelay
        if (elapsed >= landAt) {
          next += HERO_CTA_TEXT[i]
        } else {
          next += SLOT_CHARS[Math.floor(Math.random() * SLOT_CHARS.length)]
        }
      }
      setCtaDisplay(next)
      if (elapsed >= 150 + len * landDelay + 50) {
        if (slotIntervalRef.current) clearInterval(slotIntervalRef.current)
        slotIntervalRef.current = null
        setCtaDisplay(HERO_CTA_TEXT)
      }
    }, tickMs)
    return () => {
      if (slotIntervalRef.current) clearInterval(slotIntervalRef.current)
      slotIntervalRef.current = null
    }
  }, [ctaHovered])

  useEffect(() => {
    // Hero entrance
    gsap.fromTo(
      '.hero-title',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    )
    gsap.fromTo(
      '.hero-subtitle',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' }
    )
    gsap.fromTo(
      '.hero-cta',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, delay: 0.6, ease: 'back.out(1.7)' }
    )

    // Asteroid breathing: slow scale in/out loop (target by data so we never animate the wrong element)
    const asteroidEl = document.querySelector('[data-asteroid] .flex')
    if (asteroidEl) {
      gsap.to(asteroidEl, {
        scale: 1.06,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }

    // Section animations
    gsap.utils.toArray('.fade-in-up').forEach((element: any) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
          },
        }
      )
    })
  }, [])

  return (
    <div className="pt-20">
      {/* Hero Section — shared page background shows through; asteroid + heading + CTA + carousel */}
      <section className="relative overflow-hidden min-h-screen flex flex-col">
        <div
          ref={asteroidRef}
          data-asteroid
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1] -translate-y-[18%]"
          aria-hidden
        >
          <div className="w-[min(100vw,1150px)] h-auto flex justify-center items-center">
            <Image
              src="/images/asteroid.avif"
              alt=""
            width={1150}
            height={1150}
              className="w-full h-auto object-contain opacity-90"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* Top: headline + CTA (centered) */}
        <div className="flex-shrink-0 flex items-center justify-center relative z-10 min-h-[60vh] sm:min-h-[65vh]">
          <div className="w-[90%] max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
            <h1 className="hero-title text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-light mb-2 sm:mb-3 text-white leading-tight">
              Digital crafts
            </h1>
            <h2 className="hero-subtitle text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-light mb-6 sm:mb-8 leading-tight text-[#7dd3fc]">
              for ambitious brands
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-8 sm:mb-12 max-w-xl mx-auto leading-relaxed px-4">
              We design and develop clear, functional, and well-structured digital experiences.
            </p>
            <div className="hero-cta">
              <Link
                href="/contact"
                onMouseEnter={() => setCtaHovered(true)}
                onMouseLeave={() => setCtaHovered(false)}
                className="inline-flex items-center gap-2 text-white font-mono text-xs sm:text-sm tracking-[0.2em] uppercase border-b border-white pb-1.5 hover:border-[#7dd3fc] transition-colors"
              >
                <span className="tabular-nums">
                  {ctaDisplay.split('').map((char, i) => (
                    <span key={i} className="inline-block min-w-[0.5em] text-center">
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </span>
                <span className="text-base ml-0.5" aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel inside hero, just below the CTA */}
        <div className="relative z-10 w-full flex-shrink-0 pt-4 sm:pt-6 lg:pt-8 pb-8 sm:pb-12">
          <ProjectCarousel projects={projects} />
        </div>
      </section>

      {/* Strategy / Services Section — circuit borders, hover _bg images */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="w-[90%] max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="fade-in-up mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-6xl lg:text-5xl xl:text-[3.75rem] font-display font-light text-white leading-tight">
              Strategy, <span className="text-[#7dd3fc]">design</span> & <span className="text-[#7dd3fc]">performance</span>
            </h2>
            <p className="text-xl sm:text-6xl font-display font-light text-white/90 mt-2">
              aligned with your objectives
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: 'Digital Development',
                description: 'We build fast, stable, custom platforms with clean architecture and full control.',
                bgImage: '/images/digital_bg.avif',
              },
              {
                title: 'Visual Design & Narrative',
                description: 'We shape your essence into a cohesive, emotional, and strategic visual experience.',
                bgImage: '/images/visual_bg.avif',
              },
              {
                title: 'Performance & Growth',
                description: 'Optimized interactions for conversion, retention, and sustainable growth.',
                bgImage: '/images/performance_bg.avif',
              },
            ].map((service, index) => (
              <ServiceCard
                key={index}
                index={index}
                title={service.title}
                description={service.description}
                bgImage={service.bgImage}
              />
            ))}
          </div>
          <div className="fade-in-up mt-12 sm:mt-16">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-white font-mono text-xs sm:text-sm tracking-[0.2em] uppercase hover:text-[#7dd3fc] transition-colors border-b border-white/70 pb-1.5 hover:border-[#7dd3fc]"
            >
              Let&apos;s align on your objectives
              <span className="text-base ml-0.5" aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio — vertical scroll: sticky title left, projects right (one per viewport) */}
      <PortfolioScrollSection projects={projects} />

      {/* Our Approach — two columns: step list left, content (image + text) right */}
      <OurApproachSection />

      {/* Latest Blog Posts Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="w-[90%] max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="fade-in-up text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-light mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Latest Insights
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              Thoughts, tutorials, and insights on web development and design
            </p>
          </div>
          <div className="fade-in-up text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-semibold text-sm sm:text-base"
            >
              Read All Posts
              <span className="text-lg">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact — before footer */}
      <ContactSection />
    </div>
  )
}
