'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const BORDER_RADIUS = 8 // matches rounded-lg

interface ServiceCardProps {
  title: string
  description: string
  bgImage: string
  index: number
}

export default function ServiceCard({ title, description, bgImage, index }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 320, h: 320 })

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const update = () => {
      const { width, height } = el.getBoundingClientRect()
      setSize({ w: Math.round(width), h: Math.round(height) })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { w, h } = size
  const inset = 1
  const r = Math.min(BORDER_RADIUS, w / 4, h / 4)

  return (
    <div
      ref={cardRef}
      className="fade-in-up group relative overflow-hidden rounded-lg min-h-[280px] sm:min-h-[320px] border border-gray-500/70 hover:border-[#7dd3fc] transition-all duration-300 hover:shadow-[0_0_28px_rgba(125,211,252,0.22)]"
    >
      {/* Default dark background */}
      <div className="absolute inset-0 bg-black group-hover:opacity-0 transition-opacity duration-500" />
      {/* Hover background image */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <Image
          src={bgImage}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      {/* Thin blue line traveling the border — path matches card corners via measured viewBox */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
      >
        <rect
          x={inset}
          y={inset}
          width={w - inset * 2}
          height={h - inset * 2}
          rx={r}
          ry={r}
          fill="none"
          stroke="#7dd3fc"
          strokeWidth="0.5"
          pathLength="1"
          strokeDasharray="0.055 1"
          style={{
            animation: 'circuit-travel 7s linear infinite',
            animationDelay: `${-index * (7 / 3)}s`,
          }}
        />
      </svg>
      {/* Content — adjust title/description size via the classes below */}
      <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full">
        <h3 className="text-xl sm:text-3xl lg:text-4xl font-display font-normal text-white mb-4">
          {title}
        </h3>
        <p className="text-base sm:text-lg text-white/90 leading-relaxed mt-auto max-w-md">
          {description}
        </p>
      </div>
    </div>
  )
}
