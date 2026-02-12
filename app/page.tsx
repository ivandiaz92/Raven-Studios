import { getProjects } from '@/lib/strapi'
import HomeClient from './HomeClient'

export default async function HomePage() {
  const projects = await getProjects(8)
  return <HomeClient projects={projects} />
}

