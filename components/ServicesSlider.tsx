'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'

const BORDER_RADIUS = 12
const CIRCUIT_DURATION_S = 9

export const SOLUCIONES_SERVICES = [
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
] as const

function CircuitFrame({
  width,
  height,
  active,
}: {
  width: number
  height: number
  active: boolean
}) {
  const inset = 1.5
  const r = Math.min(BORDER_RADIUS, width / 5, height / 5)

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[3] h-full w-full"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <rect
        x={inset}
        y={inset}
        width={width - inset * 2}
        height={height - inset * 2}
        rx={r}
        ry={r}
        fill="none"
        stroke="rgba(148,163,184,0.35)"
        strokeWidth="0.75"
      />
      <rect
        x={inset}
        y={inset}
        width={width - inset * 2}
        height={height - inset * 2}
        rx={r}
        ry={r}
        fill="none"
        stroke="#7dd3fc"
        strokeWidth={active ? 1 : 0.75}
        pathLength="1"
        strokeDasharray="0.07 1"
        opacity={active ? 1 : 0.55}
        style={{
          animation: active ? `circuit-travel ${CIRCUIT_DURATION_S}s linear infinite` : 'none',
        }}
      />
    </svg>
  )
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {direction === 'left' ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  )
}

export default function ServicesSlider() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [frameSize, setFrameSize] = useState({ w: 960, h: 480 })
  const frameRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)

  const total = SOLUCIONES_SERVICES.length
  const activeService = SOLUCIONES_SERVICES[activeIndex]

  const goTo = useCallback(
    (index: number) => {
      const next = ((index % total) + total) % total
      setActiveIndex(next)
    },
    [total]
  )

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const update = () => {
      const { width, height } = frame.getBoundingClientRect()
      setFrameSize({ w: Math.round(width), h: Math.round(height) })
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(frame)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    gsap.fromTo(
      content,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }
    )
  }, [activeIndex])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goPrev, goNext])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return
    const endX = e.changedTouches[0]?.clientX
    if (endX == null) return
    const delta = touchStartX.current - endX
    if (Math.abs(delta) > 48) {
      if (delta > 0) goNext()
      else goPrev()
    }
    touchStartX.current = null
  }

  return (
    <div className="services-slider flex min-h-0 w-full flex-1 flex-col">
      <div
        ref={frameRef}
        className="services-slider-frame fade-in-up relative min-h-[min(58vh,540px)] w-full overflow-hidden rounded-xl border border-gray-600/40 sm:min-h-[min(52vh,500px)] sm:rounded-2xl lg:min-h-[min(56vh,580px)]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="region"
        aria-roledescription="carrusel"
        aria-label="Soluciones digitales"
      >
        <CircuitFrame width={frameSize.w} height={frameSize.h} active />

        {/* Background layers — crossfade per slide */}
        {SOLUCIONES_SERVICES.map((service, index) => (
          <div
            key={service.title}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              index === activeIndex ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-hidden={index !== activeIndex}
          >
            <Image
              src={service.bgImage}
              alt=""
              fill
              className="object-cover opacity-35 sm:opacity-40"
              sizes="90vw"
              unoptimized
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-black/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
          </div>
        ))}

        {/* Slide content */}
        <div className="relative z-[2] flex h-full min-h-[inherit] flex-col justify-between p-5 min-[480px]:p-6 sm:p-8 lg:p-10">
          <div className="flex items-start justify-between gap-4">
            <p className="text-service-slide-index font-mono text-xs uppercase tracking-[0.22em] text-[#7dd3fc]/90 min-[480px]:text-sm">
              {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </p>
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={goPrev}
                className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-[#7dd3fc]/60 hover:text-[#7dd3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-label="Solución anterior"
              >
                <ChevronIcon direction="left" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-[#7dd3fc]/60 hover:text-[#7dd3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-label="Siguiente solución"
              >
                <ChevronIcon direction="right" />
              </button>
            </div>
          </div>

          <div ref={contentRef} className="my-auto max-w-3xl py-6 sm:py-8 lg:max-w-4xl lg:py-10">
            <h3 className="text-service-slide-title mb-4 font-display font-light text-white sm:mb-5">
              {activeService.title}
            </h3>
            <p className="text-service-slide-body text-pretty text-white/88 [overflow-wrap:anywhere]">
              {activeService.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5" role="tablist" aria-label="Soluciones">
              {SOLUCIONES_SERVICES.map((service, index) => {
                const isActive = index === activeIndex
                return (
                  <button
                    key={service.title}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={service.title}
                    onClick={() => goTo(index)}
                    className={`relative inline-flex min-h-12 min-w-12 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                      isActive ? 'text-[#7dd3fc]' : 'text-white/45 hover:text-white/75'
                    }`}
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        isActive
                          ? 'h-2.5 w-2.5 bg-[#7dd3fc] shadow-[0_0_12px_rgba(125,211,252,0.55)]'
                          : 'h-2 w-2 bg-white/30'
                      }`}
                    />
                    {isActive && (
                      <svg
                        className="pointer-events-none absolute inset-0 h-full w-full animate-spin"
                        style={{ animationDuration: `${CIRCUIT_DURATION_S}s` }}
                        viewBox="0 0 48 48"
                        aria-hidden
                      >
                        <circle
                          cx="24"
                          cy="24"
                          r="22"
                          fill="none"
                          stroke="#7dd3fc"
                          strokeWidth="0.75"
                          strokeDasharray="8 120"
                          opacity="0.85"
                        />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-2 sm:hidden">
              <button
                type="button"
                onClick={goPrev}
                className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-[#7dd3fc]/60 hover:text-[#7dd3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc]"
                aria-label="Solución anterior"
              >
                <ChevronIcon direction="left" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-[#7dd3fc]/60 hover:text-[#7dd3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc]"
                aria-label="Siguiente solución"
              >
                <ChevronIcon direction="right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
