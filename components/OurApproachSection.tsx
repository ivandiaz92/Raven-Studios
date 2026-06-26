'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ExternalLinkIcon from '@/components/ExternalLinkIcon'

const STEPS = [
  {
    id: '001',
    title: 'Descubrimiento e investigación',
    image: '/images/approach-discovery-3x1.jpg',
    description:
      'Entendemos el valor real de tu marca, identificamos tu ventaja competitiva, la promesa auténtica que transmites y el posicionamiento al que queremos llevarte.',
    howWeHelp: 'Cómo lo hacemos',
    details:
      'Investigación de mercado con contexto. Análisis competitivo y benchmark digital. Tendencias relevantes para el negocio. Revisión de datos y analítica para convertir información en decisiones.',
  },
  {
    id: '002',
    title: 'Estrategia',
    image: '/images/approach-strategy-3x1.jpg',
    description:
      'Definimos objetivos claros, prioridades y una hoja de ruta para que cada decisión esté alineada con tu negocio y tu audiencia.',
    howWeHelp: 'Cómo lo hacemos',
    details:
      'Estrategia de marca y posicionamiento. Insights de usuario y mercado. Estrategia de contenido y canales. Métricas de éxito y KPIs.',
  },
  {
    id: '003',
    title: 'Diseño UX/UI',
    image: '/images/approach-design-3x1.jpg',
    description:
      'Damos forma a un producto intuitivo y coherente: que se sienta bien de usar y funcione como debe.',
    howWeHelp: 'Cómo lo hacemos',
    details:
      'Flujos de usuario y wireframes. Sistemas de diseño visual. Prototipado y pruebas. Interfaces responsivas y accesibles.',
  },
  {
    id: '004',
    title: 'Desarrollo a medida',
    image: '/images/approach-development-3x1.jpg',
    description:
      'Construimos productos digitales rápidos y estables, con arquitectura limpia y control total sobre la plataforma.',
    howWeHelp: 'Cómo lo hacemos',
    details:
      'Stacks modernos (React, Next.js, etc.). APIs e integraciones. Rendimiento y SEO. Lanzamiento e iteración.',
  },
] as const

export default function OurApproachSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const step = STEPS[activeIndex]

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="w-[90%] max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="title-entrance text-4xl sm:text-5xl lg:text-6xl font-display font-light text-white mb-12 sm:mb-16">
          Cómo trabajamos
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: step list */}
          <div className="lg:col-span-4 space-y-0">
            {STEPS.map((s, index) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`w-full text-left flex items-center gap-4 sm:gap-6 py-4 sm:py-5 border-b border-gray-800/70 transition-colors ${
                  activeIndex === index
                    ? 'border-[#7dd3fc] text-white'
                    : 'text-white/70 hover:text-white hover:border-gray-700'
                }`}
              >
                <span className="font-mono text-sm sm:text-base text-inherit opacity-80 w-10 flex-shrink-0">
                  {s.id}
                </span>
                <span className="font-sans text-lg sm:text-xl lg:text-2xl font-normal">
                  {s.title}
                </span>
              </button>
            ))}
          </div>

          {/* Right: content for selected step */}
          <div className="lg:col-span-8 lg:pl-8">
            <div key={step.id} className="transition-opacity duration-300">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-light text-white mb-6 sm:mb-8">
                {step.title}
              </h3>

              <div className="relative w-full aspect-[3/1] rounded-lg overflow-hidden bg-gray-900 mb-6 sm:mb-8">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className={
                    activeIndex === 0
                      ? 'object-cover z-0 our-approach-step1-cool'
                      : 'object-cover z-0'
                  }
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  unoptimized
                />
                {activeIndex === 0 && (
                  <>
                    {/* Blue “lamp” light — top-right, same photo; CSS only */}
                    <div
                      className="our-approach-step1-lamp pointer-events-none absolute inset-0 z-[1]"
                      aria-hidden
                    />
                    {/* Scene-wide light balance so highlights match steps 2–4 */}
                    <div
                      className="our-approach-step1-scene-cool pointer-events-none absolute inset-0 z-[1]"
                      aria-hidden
                    />
                  </>
                )}
              </div>

              <p className="text-white/90 text-lg sm:text-xl leading-relaxed mb-6">
                {step.description}
              </p>
              <p className="text-white font-medium text-sm sm:text-base mb-2">
                {step.howWeHelp}
              </p>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                {step.details}
              </p>
              <Link
                href="/agenda"
                className="inline-flex items-center gap-2 text-[#7dd3fc] font-mono text-xs sm:text-sm tracking-[0.2em] uppercase hover:text-white transition-colors border-b border-[#7dd3fc]/60 pb-1.5 mt-8 hover:border-white"
              >
                Agenda una llamada
                <ExternalLinkIcon className="text-base ml-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
