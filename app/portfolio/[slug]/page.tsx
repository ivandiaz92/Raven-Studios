import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProjectBySlug, getProjectSlugs, getProjects } from '@/lib/content'
import PortfolioCard from '@/components/PortfolioCard'
import ContactSection from '@/components/ContactSection'
import ProjectMediaImage from '@/components/ProjectMediaImage'
import VisitSiteLink from '@/components/VisitSiteLink'
import { SITE_LOCALE } from '@/lib/locale'

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug)
  if (!project) return { title: 'Proyecto no encontrado' }
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
    return d.toLocaleDateString(SITE_LOCALE, { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dateStr
  }
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const [project, allProjects] = await Promise.all([
    getProjectBySlug(params.slug),
    getProjects(),
  ])
  if (!project) notFound()

  const imageUrl = project.coverImage
  const galleryUrls = project.gallery
  const toolsList = project.tools

  const others = allProjects.filter((p) => p.slug !== project.slug)
  const currentIndex = allProjects.findIndex((p) => p.slug === project.slug)
  const otherProjects =
    others.length <= 2
      ? others
      : [
          others[currentIndex % others.length],
          others[(currentIndex + 1) % others.length],
        ]
  const liveUrl = project.liveUrl?.trim()

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto w-[92%] max-w-[1360px] px-4 py-16 min-[480px]:px-5 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Link
          href="/portfolio"
          className="mb-10 inline-flex items-center gap-2 border-b border-white/60 pb-1.5 font-mono text-xs uppercase tracking-[0.2em] text-white transition-colors hover:border-[#7dd3fc] hover:text-[#7dd3fc] sm:mb-12 sm:text-sm"
        >
          <span className="text-base" aria-hidden>
            ←
          </span>
          Volver al portafolio
        </Link>

        {/* Texto izquierda · foto derecha */}
        <div className="mb-16 grid grid-cols-1 items-start gap-10 sm:mb-20 lg:mb-28 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          <div
            className={`order-1 flex min-w-0 flex-col gap-8 sm:gap-10 ${
              imageUrl ? 'lg:col-span-5' : 'lg:col-span-12'
            }`}
          >
            <header>
              <h1 className="mb-4 font-display text-4xl font-light leading-tight text-white sm:text-5xl lg:text-5xl xl:text-6xl">
                {project.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-base text-white/70">
                {project.date && (
                  <time dateTime={project.date}>{formatProjectDate(project.date)}</time>
                )}
                {liveUrl && <VisitSiteLink href={liveUrl} />}
              </div>
              {liveUrl && (
                <div className="mt-6">
                  <VisitSiteLink href={liveUrl} variant="button" />
                </div>
              )}
              {toolsList.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {toolsList.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/90"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {project.overview && (
              <section className="min-w-0">
                <h2 className="mb-4 font-sans text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Resumen
                </h2>
                <div className="whitespace-pre-line text-base leading-relaxed text-white/90 sm:text-lg [overflow-wrap:anywhere]">
                  {project.overview}
                </div>
              </section>
            )}
          </div>

          {imageUrl && (
            <div className="order-2 min-w-0 w-full lg:col-span-7">
              <ProjectMediaImage src={imageUrl} alt={project.title} priority emphasis />
            </div>
          )}
        </div>

        {galleryUrls.length > 0 && (
          <section className="mb-16 sm:mb-24">
            <div className="flex flex-col gap-8 sm:gap-10">
              {galleryUrls.map((url, i) => (
                <ProjectMediaImage
                  key={url}
                  src={url}
                  alt={`${project.title} — imagen ${i + 1}`}
                />
              ))}
            </div>
          </section>
        )}

        {project.conclusion && (
          <section className="grid grid-cols-1 items-start gap-10 md:grid-cols-[1fr_60%] md:gap-16">
            <h2 className="font-sans text-4xl font-medium tracking-tight text-white sm:text-5xl md:text-6xl">
              Resultado
            </h2>
            <div className="min-w-0 w-full max-w-full whitespace-pre-line text-base leading-relaxed text-white/90 sm:text-lg [overflow-wrap:anywhere]">
              {project.conclusion}
            </div>
          </section>
        )}

        {otherProjects.length > 0 && (
          <section className="mt-20 border-t border-gray-800 pt-16 sm:mt-28 sm:pt-20">
            <h2 className="mb-8 font-display text-3xl font-light text-white sm:mb-10 sm:text-4xl">
              Explora más proyectos
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
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
