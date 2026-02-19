'use client'

import Link from 'next/link'
import Image from 'next/image'
import ExternalLinkIcon from '@/components/ExternalLinkIcon'
import type { StrapiProject } from '@/types/strapi'
import { getProjectImageUrl } from '@/lib/strapi'

function getProjectToolsList(tools: unknown): string[] {
  if (tools == null) return []
  if (Array.isArray(tools)) {
    return tools.map((t) => (typeof t === 'string' ? t : (t as { name?: string })?.name ?? String(t)))
  }
  if (typeof tools === 'object' && tools !== null && 'tools' in tools && Array.isArray((tools as { tools: unknown }).tools)) {
    return (tools as { tools: unknown[] }).tools.map((t) => (typeof t === 'string' ? t : (t as { name?: string })?.name ?? String(t)))
  }
  return []
}

interface PortfolioScrollSectionProps {
  projects: StrapiProject[]
}

export default function PortfolioScrollSection({ projects }: PortfolioScrollSectionProps) {
  const slideCount = Math.max(projects.length, 1)
  const sectionHeight = slideCount * 100

  return (
    <section
      className="relative grid grid-cols-1 lg:grid-cols-12"
      style={{ minHeight: `${sectionHeight}vh` }}
    >
      {/* Left: sticky title + subtitle */}
      <div className="lg:col-span-5 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-16 lg:py-0 lg:sticky lg:top-0 lg:h-screen">
        <h2 className="title-entrance text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-light text-white leading-tight">
          Portfolio
        </h2>
        <p className="fade-in-up text-lg sm:text-xl text-white/70 mt-4 max-w-md" data-delay="0.1">
          Selected work — scroll to explore
        </p>
      </div>

      {/* Right: vertical stack of project slides (each 100vh) */}
      <div className="lg:col-span-7 flex flex-col">
        {projects.length === 0 ? (
          <div className="min-h-screen flex items-center justify-center px-6 py-16">
            <p className="text-gray-500 font-mono text-sm">No projects yet.</p>
          </div>
        ) : (
          projects.map((project) => {
            const imageUrl = getProjectImageUrl(project)
            return (
              <Link
                key={project.id}
                href={`/portfolio/${project.id}`}
                className="group relative min-h-screen flex flex-col justify-end p-6 sm:p-10 lg:p-14 border-t border-gray-800/50 first:border-t-0 overflow-hidden"
              >
                <div className="absolute inset-0">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={project.attributes.project_name}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-900/80" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-display font-light text-white mb-3">
                    {project.attributes.project_name}
                  </h3>
                  {project.attributes.project_overview && (
                    <p className="text-sm sm:text-base text-white/80 line-clamp-2 max-w-xl mb-3">
                      {project.attributes.project_overview}
                    </p>
                  )}
                  {getProjectToolsList(project.attributes.project_tools).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {getProjectToolsList(project.attributes.project_tools).map((tool) => (
                        <span
                          key={tool}
                          className="px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-xs"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="inline-flex items-center gap-2 text-[#7dd3fc] font-mono text-xs sm:text-sm tracking-wider uppercase">
                    View project
                    <ExternalLinkIcon className="text-lg" />
                  </span>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </section>
  )
}
