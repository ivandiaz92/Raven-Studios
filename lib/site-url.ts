import { DEFAULT_SITE_URL } from '@/lib/site-branding'

/** Safe URL for metadata — never throws (bad .env values break every page). */
export function getSiteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).trim()
  try {
    if (!raw) return DEFAULT_SITE_URL
    return new URL(raw.startsWith('http') ? raw : `https://${raw}`).href.replace(/\/$/, '')
  } catch {
    return DEFAULT_SITE_URL
  }
}

export function getMetadataBaseUrl(): URL {
  try {
    return new URL(getSiteUrl())
  } catch {
    return new URL(DEFAULT_SITE_URL)
  }
}
