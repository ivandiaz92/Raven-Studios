import { getProjects, getBlogPosts } from '@/lib/strapi'
import HomeClient from './HomeClient'

export const dynamic = 'force-dynamic' // always fetch from Strapi so projects show after build-with-skip

export default async function HomePage() {
  const [projects, blogPosts] = await Promise.all([
    getProjects(8),
    getBlogPosts(3),
  ])
  return <HomeClient projects={projects} blogPosts={blogPosts} />
}

