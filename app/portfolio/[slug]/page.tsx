import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProjectById, getProjects, getProjectImageUrl } from '@/lib/strapi'

export const revalidate = 300 // ISR: refresh project detail from Strapi every 5 minutes

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((p) => ({ slug: String(p.id) }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProjectById(params.slug)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: `${project.attributes.client_name} - Raven Studios`,
    description: project.attributes.project_description,
  }
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProjectById(params.slug)
  if (!project) notFound()

  const imageUrl = getProjectImageUrl(project)

  return (
    <div className="pt-20 min-h-screen">
      <div className="w-[90%] max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-white font-mono text-xs sm:text-sm tracking-[0.2em] uppercase hover:text-[#7dd3fc] transition-colors border-b border-white/60 pb-1.5 mb-10 sm:mb-12 hover:border-[#7dd3fc]"
        >
          <span className="text-base" aria-hidden>←</span>
          Back to Portfolio
        </Link>

        {imageUrl && (
          <div className="relative w-full aspect-[16/10] sm:aspect-[2/1] max-h-[420px] rounded-lg overflow-hidden bg-gray-900 mb-10 sm:mb-12">
            <Image
              src={imageUrl}
              alt={project.attributes.client_name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 90vw"
              unoptimized
            />
          </div>
        )}

        <header className="mb-10 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-light text-white leading-tight">
            {project.attributes.client_name}
          </h1>
        </header>

        <div className="max-w-3xl">
          <div className="text-white/90 text-base sm:text-lg leading-relaxed whitespace-pre-line">
            {project.attributes.project_description}
          </div>
        </div>
      </div>
    </div>
  )
}
