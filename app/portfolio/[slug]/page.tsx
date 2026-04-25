import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProjectBySlug, getProjectSlugs, getProjects } from '@/lib/content'
import PortfolioCard from '@/components/PortfolioCard'
import ContactSection from '@/components/ContactSection'
import ExternalLinkIcon from '@/components/ExternalLinkIcon'

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug)
  if (!project) return { title: 'Project Not Found' }
  const desc = project.overview ?? project.conclusion ?? ''
  return {
    title: `${project.title} - Aspect`,
    description: desc.slice(0, 160),
  }
}

function formatProjectDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dateStr
  }
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const [project, allProjects] = await Promise.all([
    getProjectBySlug(params.slug),
    getProjects(6),
  ])
  if (!project) notFound()

  const imageUrl = project.coverImage
  const galleryUrls = project.gallery
  const toolsList = project.tools

  const otherProjects = allProjects.filter((p) => p.slug !== project.slug).slice(0, 2)

  return (
    <div className="pt-20 min-h-screen">
      <div className="w-[90%] max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 max-w-4xl">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-white font-mono text-xs sm:text-sm tracking-[0.2em] uppercase hover:text-[#7dd3fc] transition-colors border-b border-white/60 pb-1.5 mb-10 sm:mb-12 hover:border-[#7dd3fc]"
        >
          <span className="text-base" aria-hidden>←</span>
          Back to Portfolio
        </Link>

        {imageUrl && (
          <div className="relative w-full aspect-[16/10] sm:aspect-[2/1] max-h-[420px] rounded-lg overflow-hidden bg-gray-900 mb-14 sm:mb-20">
            <Image
              src={imageUrl}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 90vw"
              unoptimized
            />
          </div>
        )}

        <header className="mb-14 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-light text-white leading-tight mb-4">
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/70 text-base">
            {project.date && (
              <time dateTime={project.date}>{formatProjectDate(project.date)}</time>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-light uppercase text-[#7dd3fc] hover:underline tracking-wider inline-flex items-center gap-1.5"
              >
                View Live Site
                <ExternalLinkIcon className="self-center text-[1.35em] -translate-y-[0.06em]" />
              </a>
            )}
          </div>
          {toolsList.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {toolsList.map((tool) => (
                <span
                  key={tool}
                  className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          )}
        </header>

        {project.overview && (
          <section className="mb-20 sm:mb-28 grid grid-cols-1 md:grid-cols-[1fr_60%] gap-10 md:gap-16 items-start">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-sans font-medium text-white tracking-tight">
              Overview
            </h2>
            <div className="text-white/90 text-base sm:text-lg leading-relaxed whitespace-pre-line min-w-0 w-full max-w-full">
              {project.overview}
            </div>
          </section>
        )}

        {galleryUrls.length > 0 && (
          <section className="mb-16 sm:mb-24">
            <div className="flex flex-col gap-8">
              {galleryUrls.map((url, i) => (
                <div key={i} className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-900">
                  <Image
                    src={url}
                    alt={`${project.title} gallery ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {project.conclusion && (
          <section className="grid grid-cols-1 md:grid-cols-[1fr_60%] gap-10 md:gap-16 items-start">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-sans font-medium text-white tracking-tight">
              Conclusion
            </h2>
            <div className="text-white/90 text-base sm:text-lg leading-relaxed whitespace-pre-line min-w-0 w-full max-w-full">
              {project.conclusion}
            </div>
          </section>
        )}

        {otherProjects.length > 0 && (
          <section className="mt-20 sm:mt-28 pt-16 sm:pt-20 border-t border-gray-800">
            <h2 className="text-3xl sm:text-4xl font-display font-light text-white mb-8 sm:mb-10">
              Explore more Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {otherProjects.map((p, i) => (
                <PortfolioCard key={p.slug} project={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      <ContactSection animate={false} />
    </div>
  )
}
