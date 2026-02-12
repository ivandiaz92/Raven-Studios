'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const STEPS = [
  {
    id: '001',
    title: 'Discovery & Research',
    image: '/images/digital_bg.avif', // replace with approach-001.jpg when you have it
    description: "We uncover your brand's true value, identify your competitive edge, your authentic promise, and the positioning we aim to elevate you to.",
    howWeHelp: 'How we help',
    details: 'Context-driven market research. Competitive analysis and digital benchmarking. Business-relevant trend identification. Data and analytics review to generate actionable insights.',
  },
  {
    id: '002',
    title: 'Strategy',
    image: '/images/visual_bg.avif',
    description: 'We define clear goals, priorities, and a roadmap so every decision is aligned with your business and audience.',
    howWeHelp: 'How we help',
    details: 'Brand and positioning strategy. User and market insights. Content and channel strategy. Success metrics and KPIs.',
  },
  {
    id: '003',
    title: 'UX/UI Design',
    image: '/images/visual_bg.avif',
    description: 'We shape your product into an intuitive, cohesive experience that feels right and performs well.',
    howWeHelp: 'How we help',
    details: 'User flows and wireframes. Visual design systems. Prototyping and testing. Responsive and accessible interfaces.',
  },
  {
    id: '004',
    title: 'Custom Development',
    image: '/images/performance_bg.avif',
    description: 'We build fast, stable digital products with clean architecture and full control over your platform.',
    howWeHelp: 'How we help',
    details: 'Modern stacks (React, Next.js, etc.). APIs and integrations. Performance and SEO. Launch and iteration.',
  },
] as const

export default function OurApproachSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const step = STEPS[activeIndex]

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="w-[90%] max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="title-entrance text-4xl sm:text-5xl lg:text-6xl font-display font-light text-white mb-12 sm:mb-16">
          Our Approach
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
                <span className="font-display text-lg sm:text-xl lg:text-2xl font-normal">
                  {s.title}
                </span>
              </button>
            ))}
          </div>

          {/* Right: content for selected step */}
          <div className="lg:col-span-8 lg:pl-8">
            <div key={step.id} className="transition-opacity duration-300">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-light text-white mb-6 sm:mb-8">
                {step.title}
              </h3>

              <div className="relative w-full h-[200px] sm:h-[240px] lg:h-[280px] rounded-lg overflow-hidden bg-gray-900 mb-6 sm:mb-8">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  unoptimized
                />
              </div>

              <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6">
                {step.description}
              </p>
              <p className="text-white font-medium text-sm sm:text-base mb-2">
                {step.howWeHelp}
              </p>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                {step.details}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-[#7dd3fc] font-mono text-xs sm:text-sm tracking-[0.2em] uppercase hover:text-white transition-colors border-b border-[#7dd3fc]/60 pb-1.5 mt-8 hover:border-white"
              >
                Begin with discovery
                <span className="text-base ml-0.5" aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
