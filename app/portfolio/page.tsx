import { getProjects } from '@/lib/strapi'
import PortfolioCard from '@/components/PortfolioCard'

export const revalidate = 300 // ISR: refresh from Strapi every 5 minutes

export const metadata = {
  title: 'Portfolio - Raven Studios',
  description: 'Explore our portfolio of web development and design projects',
}

export default async function PortfolioPage() {
  const projects = await getProjects()

  return (
    <div className="pt-20 min-h-screen">
      <div className="w-[90%] max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <header className="mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-light text-white leading-tight mb-4">
            Our Portfolio
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl leading-relaxed">
            A collection of projects showcasing our expertise in web development, design, and digital innovation.
          </p>
        </header>

        {projects.length === 0 ? (
          <div className="py-20">
            <p className="text-white/70 text-lg">
              No projects found. Check your Strapi connection and ensure content is published.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((project, index) => (
              <PortfolioCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

