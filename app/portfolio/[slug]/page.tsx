import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProjectById, getProjects, getProjectImageUrl, getProjectGalleryUrls } from '@/lib/strapi'
import PortfolioCard from '@/components/PortfolioCard'
import ContactSection from '@/components/ContactSection'
import ExternalLinkIcon from '@/components/ExternalLinkIcon'

export const revalidate = 300 // ISR: refresh project detail from Strapi every 5 minutes

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((p) => ({ slug: String(p.id) }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProjectById(params.slug)
  if (!project) return { title: 'Project Not Found' }
  const desc = project.attributes.project_overview ?? project.attributes.project_conclusion ?? ''
  return {
    title: `${project.attributes.project_name} - Raven Studios`,
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

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const [project, allProjects] = await Promise.all([
    getProjectById(params.slug),
    getProjects(6),
  ])
  if (!project) notFound()

  const attrs = project.attributes
  const imageUrl = getProjectImageUrl(project)
  const galleryUrls = getProjectGalleryUrls(project)
  const toolsList = getProjectToolsList(attrs.project_tools)

  const otherProjects = allProjects.filter((p) => p.id !== project.id).slice(0, 2)

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
              alt={attrs.project_name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 90vw"
              unoptimized
            />
          </div>
        )}

        <header className="mb-14 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-light text-white leading-tight mb-4">
            {attrs.project_name}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/70 text-base">
            {attrs.project_date && (
              <time dateTime={attrs.project_date}>{formatProjectDate(attrs.project_date)}</time>
            )}
            {attrs.project_url && (
              <a
                href={attrs.project_url}
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

        {attrs.project_overview && (
          <section className="mb-20 sm:mb-28 grid grid-cols-1 md:grid-cols-[1fr_60%] gap-10 md:gap-16 items-start">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-sans font-medium text-white tracking-tight">
              Overview
            </h2>
            <div className="text-white/90 text-base sm:text-lg leading-relaxed whitespace-pre-line min-w-0 w-full max-w-full">
              {attrs.project_overview}
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
                    alt={`${attrs.project_name} gallery ${i + 1}`}
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

        {attrs.project_conclusion && (
          <section className="grid grid-cols-1 md:grid-cols-[1fr_60%] gap-10 md:gap-16 items-start">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-sans font-medium text-white tracking-tight">
              Conclusion
            </h2>
            <div className="text-white/90 text-base sm:text-lg leading-relaxed whitespace-pre-line min-w-0 w-full max-w-full">
              {attrs.project_conclusion}
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
                <PortfolioCard key={p.id} project={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      <ContactSection animate={false} />
    </div>
  )
}
