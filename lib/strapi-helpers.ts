/**
 * Client-safe Strapi URL helpers (no Node fs / axios).
 * Client components must import from here, not from lib/strapi.ts.
 */
import type { StrapiBlogPost, StrapiProject } from '@/types/strapi'

const STRAPI_MEDIA_BASE =
  process.env.NEXT_PUBLIC_STRAPI_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:1337'

export function getStrapiImageUrl(image: any): string {
  if (!image) return ''
  if (typeof image === 'string')
    return image.startsWith('http') ? image : `${STRAPI_MEDIA_BASE}${image.startsWith('/') ? image : '/' + image}`
  const data = image?.data
  const attrs = Array.isArray(data) ? data[0]?.attributes : data?.attributes ?? image?.attributes
  const url = attrs?.url ?? attrs?.formats?.large?.url ?? attrs?.formats?.medium?.url ?? attrs?.formats?.small?.url
  if (url) {
    return url.startsWith('http') ? url : `${STRAPI_MEDIA_BASE}${url.startsWith('/') ? url : '/' + url}`
  }
  return ''
}

export function getProjectImageUrl(project: StrapiProject): string {
  return getStrapiImageUrl(project?.attributes?.project_image)
}

export function getProjectGalleryUrls(project: StrapiProject): string[] {
  const gallery = project?.attributes?.project_gallery as
    | { data?: unknown[] | null }
    | unknown[]
    | null
    | undefined
  if (!gallery) return []

  const urlFromMediaItem = (item: unknown): string => {
    if (!item || typeof item !== 'object') return ''
    const o = item as Record<string, unknown>
    if (o.attributes && typeof o.attributes === 'object') {
      return getStrapiImageUrl({ data: item })
    }
    if (typeof o.url === 'string' || o.formats) {
      return getStrapiImageUrl({ attributes: o })
    }
    return ''
  }

  if (typeof gallery === 'object' && !Array.isArray(gallery) && Array.isArray((gallery as { data?: unknown[] }).data)) {
    return (gallery as { data: unknown[] }).data.map(urlFromMediaItem).filter(Boolean)
  }
  if (Array.isArray(gallery)) {
    return gallery.map(urlFromMediaItem).filter(Boolean)
  }
  return []
}

export function getProjectDetailSlug(project: StrapiProject): string {
  const doc = project.documentId?.trim()
  if (doc) return doc
  return String(project.id)
}

export function getBlogPostImageUrl(post: StrapiBlogPost): string {
  return getStrapiImageUrl(post?.attributes?.main_image)
}
