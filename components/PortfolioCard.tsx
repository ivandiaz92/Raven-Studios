'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import VisitSiteLink from '@/components/VisitSiteLink'
import type { Project } from '@/lib/content'

gsap.registerPlugin(ScrollTrigger)

interface PortfolioCardProps {
  project: Project
  index?: number
}

export default function PortfolioCard({ project, index = 0 }: PortfolioCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 80%',
          },
        }
      )
    }
  }, [index])

  const imageUrl = project.coverImage
  const name = project.title
  const overview = project.overview ?? ''
  const liveUrl = project.liveUrl?.trim()

  return (
    <div
      ref={cardRef}
      className="group overflow-hidden rounded-lg border border-gray-800 bg-gray-900/80 transition-all duration-300 hover:border-[#7dd3fc]/50"
    >
      <Link href={`/portfolio/${project.slug}`} className="block">
        {imageUrl ? (
          <div className="relative h-64 overflow-hidden">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        ) : (
          <div className="relative flex h-64 items-center justify-center border-b border-gray-800 bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="font-mono text-xs text-gray-500">Proyecto</span>
          </div>
        )}
        <div className="p-6">
          <h3 className="mb-2 font-display text-xl font-light text-white transition-colors group-hover:text-[#7dd3fc]">
            {name}
          </h3>
          {overview && (
            <p className="mb-4 line-clamp-2 text-sm text-white/70">{overview}</p>
          )}
        </div>
      </Link>
      {liveUrl && (
        <div className="border-t border-gray-800/80 px-6 pb-5 pt-0">
          <VisitSiteLink href={liveUrl} className="mt-1" />
        </div>
      )}
    </div>
  )
}
