import { getProjects, getBlogPosts } from '@/lib/strapi'
import HomeClient from './HomeClient'

export const dynamic = 'force-dynamic' // always fetch from Strapi so projects show after build-with-skip

export default async function HomePage() {
  const [allProjects, blogPosts] = await Promise.all([
    getProjects(), // full list: updates disk cache when Strapi works; carousel uses first 8
    getBlogPosts(3),
  ])
  const projects = allProjects.slice(0, 8)
  return <HomeClient projects={projects} blogPosts={blogPosts} />
}

