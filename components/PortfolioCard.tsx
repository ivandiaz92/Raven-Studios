'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getProjectImageUrl } from '@/lib/strapi'
import type { StrapiProject } from '@/types/strapi'

gsap.registerPlugin(ScrollTrigger)

interface PortfolioCardProps {
  project: StrapiProject
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

  const imageUrl = getProjectImageUrl(project)
  const name = project.attributes.project_name
  const overview = project.attributes.project_overview ?? ''

  return (
    <Link href={`/portfolio/${project.id}`}>
      <div
        ref={cardRef}
        className="group relative overflow-hidden rounded-lg border border-gray-800 bg-gray-900/80 hover:border-[#7dd3fc]/50 transition-all duration-300"
      >
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
          <div className="relative h-64 bg-gray-900 flex items-center justify-center">
            <span className="text-gray-600 font-mono text-sm">No image</span>
          </div>
        )}
        <div className="p-6">
          <h3 className="text-xl font-display font-light mb-2 text-white group-hover:text-[#7dd3fc] transition-colors">
            {name}
          </h3>
          {overview && (
            <p className="text-white/70 text-sm mb-4 line-clamp-2">
              {overview}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

