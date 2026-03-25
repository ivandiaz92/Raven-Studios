/**
 * Disk cache for Strapi projects list when Strapi Cloud is flaky (503, empty body, timeouts).
 * Survives PM2 restarts; never committed to Git (.cache/ is gitignored).
 */
import { mkdir, readFile, writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import type { StrapiProject } from '@/types/strapi'

const CACHE_DIR = join(process.cwd(), '.cache')
const CACHE_FILE = join(CACHE_DIR, 'strapi-projects.json')
/** Use cached list if Strapi fails and cache is newer than this */
const MAX_STALE_MS = 90 * 24 * 60 * 60 * 1000 // 90 days

type Payload = { savedAt: number; projects: StrapiProject[] }

export async function readProjectsCache(): Promise<StrapiProject[] | null> {
  try {
    const raw = await readFile(CACHE_FILE, 'utf-8')
    const p = JSON.parse(raw) as Payload
    if (!Array.isArray(p.projects) || p.projects.length === 0) return null
    const age = Date.now() - p.savedAt
    if (age > MAX_STALE_MS) {
      console.warn('[projects-cache] expired, not using')
      return null
    }
    console.warn(
      '[projects-cache] serving',
      p.projects.length,
      'projects; saved',
      Math.round(age / 3600000),
      'h ago'
    )
    return p.projects
  } catch {
    return null
  }
}

/** Persist last good list (call after a successful Strapi fetch with enough items for the site). */
export async function writeProjectsCache(projects: StrapiProject[]): Promise<void> {
  if (projects.length === 0) return
  try {
    await mkdir(dirname(CACHE_FILE), { recursive: true })
    const payload: Payload = { savedAt: Date.now(), projects }
    await writeFile(CACHE_FILE, JSON.stringify(payload), 'utf-8')
  } catch (e) {
    console.warn('[projects-cache] write failed:', e)
  }
}
