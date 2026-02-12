import { getProjects, getBlogPosts } from '@/lib/strapi'
import HomeClient from './HomeClient'

export const revalidate = 300 // ISR: refresh from Strapi every 5 minutes

export default async function HomePage() {
  const [projects, blogPosts] = await Promise.all([
    getProjects(8),
    getBlogPosts(3),
  ])
  return <HomeClient projects={projects} blogPosts={blogPosts} />
}

