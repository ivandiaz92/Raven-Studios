'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import type { StrapiProject } from '@/types/strapi'
import { getProjectImageUrl } from '@/lib/strapi'

const GAP = 32 // gap-8

interface ProjectCarouselProps {
  projects: StrapiProject[]
}

function CarouselCard({
  project,
  index,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  copyIndex,
}: {
  project: StrapiProject
  index: number
  isHovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  copyIndex: number
}) {
  const imageUrl = getProjectImageUrl(project)
  return (
    <Link
      key={`${project.id}-${copyIndex}-${index}`}
      href={`/portfolio/${project.id}`}
      className="relative flex-shrink-0 group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative w-[280px] sm:w-[360px] lg:w-[420px] h-[400px] sm:h-[480px] lg:h-[560px] overflow-hidden rounded-2xl sm:rounded-3xl">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={project.attributes.client_name}
            fill
            className={`object-cover transition-all duration-500 ${
              isHovered ? 'grayscale-0 scale-105' : 'grayscale scale-100'
            }`}
            sizes="(max-width: 640px) 280px, (max-width: 1024px) 360px, 420px"
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <span className="text-gray-600 font-mono text-sm">No image</span>
          </div>
        )}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-8 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-2">
            {project.attributes.client_name}
          </h3>
          {project.attributes.project_description && (
            <p className="text-sm sm:text-base text-gray-300 line-clamp-2 mb-4">
              {project.attributes.project_description}
            </p>
          )}
          <div className="flex items-center gap-2 text-white font-mono text-xs tracking-wider">
            <span>View Project</span>
            <span className="text-lg">→</span>
          </div>
        </div>
        <div
          className={`absolute inset-0 border transition-all duration-300 pointer-events-none rounded-2xl sm:rounded-3xl ${
            isHovered ? 'border-cyan-400 opacity-100' : 'border-transparent opacity-0'
          }`}
        />
      </div>
    </Link>
  )
}

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)

  // Render two copies of the list so the loop is seamless (no cloneNode / layout shift)
  const duplicatedProjects = [...projects, ...projects]

  useEffect(() => {
    if (!containerRef.current || projects.length === 0) return

    const container = containerRef.current
    const firstChild = container.firstElementChild as HTMLElement
    if (!firstChild) return

    // Measure after layout is stable so item widths include loaded images
    const rafId = requestAnimationFrame(() => {
      const itemWidth = firstChild.offsetWidth
      const segmentWidth = (itemWidth + GAP) * projects.length

      // One long tween + wrap modifier = seamless infinite scroll (no repeat/reset jump).
      const durationPerSegment = projects.length * 8
      animationRef.current = gsap.to(container, {
        x: -segmentWidth * 999,
        duration: durationPerSegment * 999,
        ease: 'none',
        modifiers: {
          x: (x) => {
            const v = parseFloat(x)
            const wrapped = (((v % segmentWidth) + segmentWidth) % segmentWidth) - segmentWidth
            return `${wrapped}px`
          },
        },
      })
    })

    return () => {
      cancelAnimationFrame(rafId)
      animationRef.current?.kill()
    }
  }, [projects])

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index)
    animationRef.current?.pause()
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    animationRef.current?.play()
  }

  if (projects.length === 0) {
    return (
      <div className="w-full overflow-hidden py-12">
        <div className="text-center text-gray-500 font-mono text-sm max-w-md mx-auto space-y-2">
          <p>No projects showing yet.</p>
          <p className="text-xs text-gray-600 mt-3">Check: Strapi running (port 1337)? Token in .env.local? Project content type has &quot;find&quot; permission? Entry published?</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden py-8 sm:py-12 lg:py-16 relative">
      <div
        ref={containerRef}
        className="flex gap-6 sm:gap-8 will-change-transform"
        style={{ width: 'fit-content' }}
      >
        {duplicatedProjects.map((project, i) => (
          <CarouselCard
            project={project}
            index={i}
            copyIndex={i >= projects.length ? 1 : 0}
            isHovered={hoveredIndex === i}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </div>
    </div>
  )
}
