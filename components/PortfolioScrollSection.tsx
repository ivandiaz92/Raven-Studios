'use client'

import Link from 'next/link'
import Image from 'next/image'
import ExternalLinkIcon from '@/components/ExternalLinkIcon'
import VisitSiteLink from '@/components/VisitSiteLink'
import type { Project } from '@/lib/content'

interface PortfolioScrollSectionProps {
  projects: Project[]
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
          Portafolio
        </h2>
        <div className="fade-in-up mt-4 max-w-md space-y-1" data-delay="0.1">
          <p className="text-lg sm:text-xl text-white/70 leading-relaxed">
            Proyectos seleccionados
          </p>
          <p className="text-lg sm:text-xl text-white/70 leading-relaxed">
            Desliza para explorar
          </p>
        </div>
      </div>

      {/* Right: vertical stack of project slides (each 100vh) */}
      <div className="lg:col-span-7 flex flex-col">
        {projects.length === 0 ? (
          <div className="min-h-screen flex items-center justify-center px-6 py-16">
            <p className="text-gray-500 font-mono text-sm">Aún no hay proyectos.</p>
          </div>
        ) : (
          projects.map((project) => {
            const imageUrl = project.coverImage
            const liveUrl = project.liveUrl?.trim()
            return (
              <div
                key={project.slug}
                className="group relative flex min-h-screen flex-col justify-end overflow-hidden border-t border-gray-800/50 p-6 first:border-t-0 sm:p-10 lg:p-14"
              >
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="absolute inset-0 z-0"
                  aria-label={`Ver proyecto ${project.title}`}
                />
                <div className="absolute inset-0 z-0">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt=""
                      fill
                      className="object-cover opacity-60 transition-opacity duration-500 group-hover:opacity-80"
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
                  )}
                </div>
                <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="relative z-10">
                  <h3 className="mb-3 font-display text-3xl font-light text-white sm:text-4xl lg:text-5xl">
                    {project.title}
                  </h3>
                  {project.overview && (
                    <p className="mb-3 line-clamp-2 max-w-xl text-sm text-white/80 sm:text-base">
                      {project.overview}
                    </p>
                  )}
                  {project.tools.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/90"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="pointer-events-auto flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link
                      href={`/portfolio/${project.slug}`}
                      className="inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#7dd3fc] sm:text-sm"
                    >
                      Ver proyecto
                      <ExternalLinkIcon className="text-lg" />
                    </Link>
                    {liveUrl && <VisitSiteLink href={liveUrl} />}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
