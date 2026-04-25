import { getBlogPosts, getProjects } from '@/lib/content'
import HomeClient from './HomeClient'

export default async function HomePage() {
  const [allProjects, blogPosts] = await Promise.all([
    getProjects(),
    getBlogPosts(3),
  ])
  const projects = allProjects.slice(0, 8)
  return <HomeClient projects={projects} blogPosts={blogPosts} />
}

