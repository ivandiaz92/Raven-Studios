'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ServicesMarquee from '@/components/ServicesMarquee'
import HeroRotatingWord from '@/components/HeroRotatingWord'
import HeroFloatingPhones from '@/components/HeroFloatingPhones'
import PortfolioScrollSection from '@/components/PortfolioScrollSection'
import OurApproachSection from '@/components/OurApproachSection'
import ContactSection from '@/components/ContactSection'
import ServiceCard from '@/components/ServiceCard'
import ExternalLinkIcon from '@/components/ExternalLinkIcon'
import { getBlogPostImageUrl } from '@/lib/strapi-helpers'
import type { StrapiProject, StrapiBlogPost } from '@/types/strapi'

gsap.registerPlugin(ScrollTrigger)

interface HomeClientProps {
  projects: StrapiProject[]
  blogPosts: StrapiBlogPost[]
}

const HERO_CTA_TEXT = 'Agenda una llamada'
const SLOT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export default function HomeClient({ projects, blogPosts = [] }: HomeClientProps) {
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
    // Hero entrance (same blur + fade + rise as section titles)
    gsap.fromTo(
      '.hero-title',
      { opacity: 0, y: 28, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power2.out' }
    )
    gsap.fromTo(
      '.hero-subtitle',
      { opacity: 0, y: 28, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, delay: 0.28, ease: 'power2.out' }
    )
    gsap.fromTo(
      '.hero-cta',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, delay: 0.6, ease: 'back.out(1.7)' }
    )

    // Hero phones + stella float — see HeroFloatingPhones.tsx

    // Section body / content: fade + rise
    gsap.utils.toArray('.fade-in-up').forEach((element: any) => {
      const delay = parseFloat(element.getAttribute?.('data-delay')) || 0
      gsap.fromTo(
        element,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
          },
        }
      )
    })

    // Section titles: blur + fade + rise (cooler entrance)
    gsap.utils.toArray('.title-entrance').forEach((element: any) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 28, filter: 'blur(10px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
          },
        }
      )
    })
  }, [])

  return (
    <div className="pt-[4.5rem] sm:pt-20">
      {/* flex-1 + justify-center: hero sits mid-band; marquee follows with modest gap */}
      <section className="relative flex min-h-[calc(100dvh-4.5rem)] flex-col overflow-visible sm:min-h-[calc(100dvh-5rem)]">
        <div className="flex min-h-0 flex-1 flex-col justify-center px-4 pb-2 sm:px-5 sm:pb-3 lg:px-7 lg:pb-4">
          <div className="relative z-10 mx-auto flex w-[92%] max-w-[92vw] flex-col gap-10 lg:flex-row lg:items-center lg:justify-start lg:gap-8 xl:gap-10 2xl:gap-12 pt-6 sm:pt-8 md:pt-9 lg:pt-10 xl:pt-11 2xl:pt-12">
          {/* Wider copy column so H1 can sit on ~2 lines; phones capped separately on xl+ */}
          <div className="w-full min-w-0 overflow-visible text-center lg:flex-[1.2] lg:basis-0 lg:min-w-0 lg:text-left xl:flex-[1.25]">
            <h1 className="hero-title text-balance text-4xl sm:text-6xl lg:text-7xl xl:text-7xl 2xl:text-8xl font-display font-light mb-2 sm:mb-3 text-white leading-[1.08] tracking-tight">
              Creamos páginas web
            </h1>
            <h2 className="hero-subtitle text-balance overflow-visible text-4xl sm:text-6xl lg:text-7xl xl:text-7xl 2xl:text-8xl font-display font-light mb-6 sm:mb-8 leading-[1.08] text-[#7dd3fc] text-center lg:text-left">
              <HeroRotatingWord />
            </h2>
            <p className="mx-auto max-w-2xl px-0 text-sm leading-relaxed sm:text-base lg:mx-0 lg:text-lg text-white/90 mb-8 sm:mb-12">
              Diseños personalizados a tu marca para máxima retención de usuarios
            </p>
            <div className="hero-cta flex justify-center lg:justify-start">
              <Link
                href="/agenda"
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
                <ExternalLinkIcon className="text-base ml-0.5" />
              </Link>
            </div>
          </div>

          {/* Phones: flex-1 + vw caps only on very wide screens — not miniature on laptop */}
          <div className="relative mx-auto flex w-full min-w-0 max-w-[min(100%,560px)] items-center justify-center pointer-events-none px-1 sm:px-2 lg:mx-0 lg:max-w-none lg:flex-1 lg:justify-start xl:max-w-[min(100%,min(52vw,640px))] min-[1920px]:max-w-[min(100%,min(48vw,600px))]">
            <HeroFloatingPhones />
          </div>
          </div>
        </div>

        {/* transform shifts the bar up visually; flex gap above is unchanged so this is the only lever without editing the hero flex */}
        <div className="relative z-10 w-full shrink-0 -translate-y-8 will-change-transform sm:-translate-y-10 md:-translate-y-12 lg:-translate-y-14">
          <ServicesMarquee />
        </div>
      </section>

      {/* Strategy / Services — desktop: full viewport below header, flex-distributed; mobile: natural height + scroll in grid if needed */}
      <section
        id="soluciones"
        className="mb-12 flex min-h-0 flex-col overflow-hidden pt-[5.25rem] pb-6 sm:mb-16 sm:pt-28 sm:pb-8 max-lg:min-h-0 lg:mb-20 lg:h-[100svh] lg:max-h-[100svh] lg:pb-8 xl:mb-24"
      >
        <div className="mx-auto flex w-full min-h-0 max-w-[min(100%,90vw)] flex-1 flex-col px-4 min-[480px]:px-5 sm:px-6 lg:px-8 lg:h-full">
          <div className="shrink-0 text-balance sm:mb-1 lg:mb-5">
            <h2 className="title-entrance text-soluciones-heading font-display font-light text-[#7dd3fc]">
              Soluciones digitales y estratégicas
            </h2>
            <p
              className="fade-in-up text-soluciones-sub mt-2 max-w-3xl font-display font-light text-white/90 lg:mt-3"
              data-delay="0.12"
            >
              Integrando diseño, tecnología y visión de negocio
            </p>
          </div>
          <div className="mt-3 flex min-h-0 flex-1 flex-col sm:mt-4 max-lg:max-h-[min(72svh,720px)] max-lg:overflow-y-auto max-lg:overscroll-y-contain max-lg:pr-0.5 [-ms-overflow-style:none] [scrollbar-width:thin] lg:mt-0 lg:min-h-0 lg:overflow-hidden">
            <div
              className="grid h-full min-h-0 w-full grid-cols-2 auto-rows-min gap-2.5 min-[480px]:gap-3 sm:gap-3.5
              max-lg:content-start
              lg:min-h-0 lg:grid-cols-3 lg:grid-rows-2 [&>*]:min-h-0
              lg:gap-x-4 lg:gap-y-3 xl:gap-x-5 xl:gap-y-4"
            >
              {[
                {
                  title: 'Diseño Web Personalizado',
                  description:
                    'Reflejamos la esencia de tu marca a través de un sitio web adaptado a tu estilo y a tu mercado.',
                  bgImage: '/images/visual_bg.avif',
                },
                {
                  title: 'Desarrollo a la medida',
                  description:
                    'Construimos funcionalidades y experiencias digitales hechas para ti: código limpio, integraciones sólidas y una base técnica que escala con tu negocio.',
                  bgImage: '/images/digital_bg.avif',
                },
                {
                  title: 'Tiendas Virtuales',
                  description:
                    'Gestiona, posiciona y vende tus productos a través de una tienda virtual que cautive el interés de tu audiencia.',
                  bgImage: '/images/performance_bg.avif',
                },
                {
                  title: 'Optimización SEO',
                  description:
                    'Que tu marca se posicione orgánicamente a través de una estrategia de posicionamiento SEO.',
                  bgImage: '/images/digital_bg.avif',
                },
                {
                  title: 'Investigación de marca y redacción creativa',
                  description:
                    'Traducimos tus ideas a textos persuasivos que generen impacto y empaticen con tu audiencia.',
                  bgImage: '/images/visual_bg.avif',
                },
                {
                  title: 'Web Hosting y Mantenimiento',
                  description:
                    'Hosting confiable, actualizaciones, respaldos y soporte continuo para que tu sitio esté siempre en línea, seguro y al día.',
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
          </div>
          <div className="fade-in-up mt-5 shrink-0 sm:mt-6 lg:mt-5">
            <Link
              href="/agenda"
              className="text-soluciones-cta inline-flex min-h-12 items-center gap-2 border-b border-white/70 pb-1 font-mono uppercase tracking-[0.18em] text-white transition-colors hover:border-[#7dd3fc] hover:text-[#7dd3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Agenda una llamada
              <ExternalLinkIcon className="ml-0.5 text-base min-[480px]:text-lg" />
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio — vertical scroll: sticky title left, projects right (one per viewport) */}
      <PortfolioScrollSection projects={projects} />

      {/* Our Approach — two columns: step list left, content (image + text) right */}
      <OurApproachSection />

      {/* Latest Insights */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="w-[90%] max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-12 sm:mb-16">
            <h2 className="title-entrance text-4xl sm:text-5xl lg:text-6xl font-display font-light text-white leading-tight mb-4">
              Latest Insights
            </h2>
            <p className="fade-in-up text-white/80 text-base sm:text-lg max-w-2xl leading-relaxed" data-delay="0.1">
              Thoughts, tutorials, and insights on web development and design
            </p>
          </header>
          {blogPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
                {blogPosts.map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    className="fade-in-up group block"
                    data-delay={index * 0.08}
                  >
                    <article className="h-full rounded-lg border border-gray-800 bg-gray-900/80 overflow-hidden hover:border-[#7dd3fc]/50 transition-all duration-300">
                      {post.attributes.main_image?.data?.attributes?.url && (
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <Image
                            src={getBlogPostImageUrl(post)}
                            alt={post.attributes.post_title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        </div>
                      )}
                      <div className="p-5 sm:p-6">
                        <p className="font-mono text-xs text-white/60 mb-2">
                          {new Date(post.attributes.date_created).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        <h3 className="font-display font-light text-lg sm:text-xl text-white group-hover:text-[#7dd3fc] transition-colors line-clamp-2">
                          {post.attributes.post_title}
                        </h3>
                        {post.attributes.author && (
                          <p className="text-white/60 text-sm mt-2">By {post.attributes.author}</p>
                        )}
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
              <div className="fade-in-up">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-white font-mono text-xs sm:text-sm tracking-[0.2em] uppercase hover:text-[#7dd3fc] transition-colors border-b border-white/60 pb-1.5 hover:border-[#7dd3fc]"
                >
                  Read All Posts
                  <ExternalLinkIcon className="text-base ml-0.5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="fade-in-up">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-white font-mono text-xs sm:text-sm tracking-[0.2em] uppercase hover:text-[#7dd3fc] transition-colors border-b border-white/60 pb-1.5 hover:border-[#7dd3fc]"
              >
                Read All Posts
                <ExternalLinkIcon className="text-base ml-0.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Contact — before footer */}
      <ContactSection />
    </div>
  )
}
