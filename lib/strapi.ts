import axios from 'axios';
import type { Portfolio, StrapiProject, StrapiResponse, StrapiBlogPost } from '@/types/strapi';
import { readProjectsCache, writeProjectsCache } from '@/lib/strapi-project-cache';
import { getStrapiImageUrl, getProjectGalleryUrls } from '@/lib/strapi-helpers';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
  },
});

// Skip Strapi during build so 503s don't fail the build; data loads at runtime (ISR).
const skipStrapiDuringBuild =
  process.env.SKIP_STRAPI_BUILD === '1' || process.env.NEXT_PHASE === 'phase-production-build'

// —— Projects API (your Strapi "Project" content type) ——
// Strapi Cloud is flaky (503, empty 200, timeouts). We retry, chain fallbacks, then disk cache.
async function fetchProjectsFromStrapiAttempt(limit?: number): Promise<StrapiProject[]> {
  const baseParams: Record<string, unknown> = {
    sort: ['publishedAt:desc'],
  }
  if (limit) baseParams.pagination = { limit }

  const fetchProjects = async (populate?: string[]) => {
    const params = populate?.length ? { ...baseParams, populate } : baseParams
    const response = await api.get<StrapiResponse<StrapiProject[]>>('/projects', {
      params,
      timeout: 20000,
    })
    return response.data?.data ?? []
  }

  let withPop: StrapiProject[] = []
  try {
    withPop = await fetchProjects(['project_image'])
  } catch (first: unknown) {
    const status =
      first && typeof first === 'object' && 'response' in first
        ? (first as { response?: { status?: number } }).response?.status
        : undefined
    console.warn('[getProjects] populate failed (' + (status ?? 'network') + '), trying plain list')
  }

  if (withPop.length > 0) {
    console.log('[getProjects] with images, count:', withPop.length)
    return withPop
  }

  try {
    let plain = await fetchProjects()
    if (plain.length === 0) {
      const bareParams: Record<string, unknown> = {}
      if (limit) bareParams.pagination = { limit }
      const { data } = await api.get<StrapiResponse<StrapiProject[]>>('/projects', {
        params: bareParams,
        timeout: 20000,
      })
      plain = data?.data ?? []
      if (plain.length > 0) {
        console.log('[getProjects] minimal query (no sort), count:', plain.length)
      }
    }
    if (plain.length > 0) {
      console.log('[getProjects] final count:', plain.length)
    } else {
      console.warn('[getProjects] Strapi returned 0 projects this attempt')
    }
    return plain
  } catch (err: unknown) {
    try {
      const bareParams: Record<string, unknown> = {}
      if (limit) bareParams.pagination = { limit }
      const { data } = await api.get<StrapiResponse<StrapiProject[]>>('/projects', {
        params: bareParams,
        timeout: 20000,
      })
      const last = data?.data ?? []
      if (last.length > 0) console.log('[getProjects] recovered minimal query, count:', last.length)
      return last
    } catch {
      /* fall through */
    }
    if (process.env.NODE_ENV === 'development' && err && typeof err === 'object' && 'code' in err && err.code === 'ECONNREFUSED') {
      console.warn('Strapi not running — start it with: cd ../ravenstudios-strapi && npm run develop');
    }
    const msg = err && typeof err === 'object' && 'response' in err
      ? (err as { response?: { status?: number; data?: unknown } }).response?.status
      : err;
    console.error('[getProjects] attempt failed:', msg);
    return [];
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function getProjects(limit?: number): Promise<StrapiProject[]> {
  if (skipStrapiDuringBuild) return []

  let best: StrapiProject[] = []
  for (let attempt = 1; attempt <= 3; attempt++) {
    best = await fetchProjectsFromStrapiAttempt(limit)
    if (best.length > 0) break
    if (attempt < 3) {
      console.warn('[getProjects] retry', attempt + 1, '/ 3 after empty/error')
      await sleep(600 * attempt)
    }
  }

  if (best.length > 0) {
    if (limit === undefined) await writeProjectsCache(best)
    return limit ? best.slice(0, limit) : best
  }

  const cached = await readProjectsCache()
  if (cached && cached.length > 0) {
    return limit ? cached.slice(0, limit) : cached
  }

  return []
}

function axiosStatus(err: unknown): number | undefined {
  if (err && typeof err === 'object' && 'response' in err) {
    return (err as { response?: { status?: number } }).response?.status
  }
  return undefined
}

export async function getProjectById(idOrSlug: string): Promise<StrapiProject | null> {
  if (skipStrapiDuringBuild) return null

  const fetchOne = async (key: string, populate: string[]) => {
    const params = populate.length ? { populate } : {}
    const { data } = await api.get<StrapiResponse<StrapiProject>>(`/projects/${encodeURIComponent(key)}`, {
      params,
      timeout: 15000,
    })
    return data?.data ?? null
  }

  const tryKey = async (key: string): Promise<StrapiProject | null> => {
    let saw404 = false
    for (const pop of [['project_image', 'project_gallery'], ['project_image'], []] as string[][]) {
      try {
        const p = await fetchOne(key, pop)
        if (p) return p
      } catch (e) {
        if (axiosStatus(e) === 404) {
          saw404 = true
          break
        }
      }
    }
    if (saw404) return null
    return null
  }

  /** Strapi often 503s on multi-populate; we then load without gallery — fetch gallery alone */
  const mergeProjectGallery = async (p: StrapiProject): Promise<StrapiProject> => {
    if (getProjectGalleryUrls(p).length > 0) return p
    const key = p.documentId?.trim() || String(p.id)
    try {
      const { data } = await api.get<StrapiResponse<StrapiProject>>(`/projects/${encodeURIComponent(key)}`, {
        params: { populate: ['project_gallery'] },
        timeout: 15000,
      })
      const doc = data?.data as StrapiProject & { project_gallery?: unknown }
      const g = doc?.attributes?.project_gallery ?? doc?.project_gallery
      if (g) {
        return {
          ...p,
          attributes: { ...p.attributes, project_gallery: g as StrapiProject['attributes']['project_gallery'] },
        }
      }
    } catch {
      /* gallery-only populate can still fail on some Strapi Cloud tiers */
    }
    return p
  }

  let project = await tryKey(idOrSlug)
  if (project) return mergeProjectGallery(project)

  // Strapi v5: /projects/123 often 404s; list still returns id + documentId — resolve then refetch
  try {
    const all = await getProjects(100)
    const match = all.find(
      (p) => String(p.id) === idOrSlug || (p.documentId && p.documentId === idOrSlug)
    )
    if (!match) return null
    if (match.documentId && match.documentId !== idOrSlug) {
      project = await tryKey(match.documentId)
      if (project) return mergeProjectGallery(project)
    }
    return mergeProjectGallery(match)
  } catch (e) {
    console.error('getProjectById resolve failed:', axiosStatus(e) ?? e)
    return null
  }
}

// Portfolio API
export async function getPortfolios(filters?: {
  featured?: boolean;
  category?: string;
  limit?: number;
}): Promise<Portfolio[]> {
  if (skipStrapiDuringBuild) return []
  const params: any = {
    populate: ['featuredImage', 'images'],
    sort: ['publishedAt:desc'],
  };

  if (filters?.featured) {
    params.filters = { featured: { $eq: true } };
  }

  if (filters?.category) {
    params.filters = { ...params.filters, category: { $eq: filters.category } };
  }

  if (filters?.limit) {
    params.pagination = { limit: filters.limit };
  }

  const response = await api.get<StrapiResponse<Portfolio[]>>('/portfolios', { params });
  return response.data.data;
}

export async function getPortfolioBySlug(slug: string): Promise<Portfolio | null> {
  if (skipStrapiDuringBuild) return null
  try {
    const response = await api.get<StrapiResponse<Portfolio[]>>('/portfolios', {
      params: {
        filters: { slug: { $eq: slug } },
        populate: ['featuredImage', 'images'],
      },
    });

    const data = response.data.data;
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
}

// Blog API (Strapi "Blog Post": post_title, post_content, main_image, date_created, author)
export async function getBlogPosts(limit?: number): Promise<StrapiBlogPost[]> {
  if (skipStrapiDuringBuild) return []
  try {
    const params: Record<string, unknown> = {
      populate: ['main_image'],
      sort: ['date_created:desc'],
    };
    if (limit) params.pagination = { limit };
    const response = await api.get<StrapiResponse<StrapiBlogPost[]>>('/blog-posts', {
      params,
      timeout: 3000,
    });
    return response.data.data ?? [];
  } catch (err: unknown) {
    if (process.env.NODE_ENV === 'development' && err && typeof err === 'object' && 'code' in err && err.code === 'ECONNREFUSED') {
      console.warn('Strapi not running — blog posts unavailable');
    }
    return [];
  }
}

export async function getBlogPostById(id: string): Promise<StrapiBlogPost | null> {
  try {
    const response = await api.get<StrapiResponse<StrapiBlogPost>>(`/blog-posts/${id}`, {
      params: { populate: ['main_image'] },
    });
    return response.data.data ?? null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<StrapiBlogPost | null> {
  if (skipStrapiDuringBuild) return null
  try {
    const response = await api.get<StrapiResponse<StrapiBlogPost[]>>('/blog-posts', {
      params: {
        filters: { slug: { $eq: slug } },
        populate: ['main_image', 'featuredImage'],
      },
      timeout: 3000,
    });
    const data = response.data.data;
    if (Array.isArray(data) && data.length > 0) return data[0];
    return null;
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
}

export async function getAllBlogSlugs(): Promise<string[]> {
  if (skipStrapiDuringBuild) return []
  try {
    const response = await api.get<StrapiResponse<StrapiBlogPost[]>>('/blog-posts', {
      params: {
        fields: ['slug'],
        pagination: { limit: 100 },
      },
      timeout: 3000,
    });
    const data = response.data.data ?? [];
    return data
      .map((p) => p.attributes?.slug)
      .filter((s): s is string => typeof s === 'string' && s.length > 0);
  } catch (error) {
    console.error('Error fetching blog slugs:', error);
    return [];
  }
}

export async function getAllPortfolioSlugs(): Promise<string[]> {
  if (skipStrapiDuringBuild) return []
  try {
    const response = await api.get<StrapiResponse<Portfolio[]>>('/portfolios', {
      params: {
        fields: ['slug'],
        pagination: { limit: 100 },
      },
    });
    return response.data.data.map((portfolio) => portfolio.attributes.slug);
  } catch (error) {
    console.error('Error fetching portfolio slugs:', error);
    return [];
  }
}

/** Payload for creating a Quote Request (brief cotización) in Strapi */
export interface QuoteRequestPayload {
  company_name: string
  contact_name: string
  email: string
  social_networks?: string
  sections_needed?: string
  sections_modify?: string
  sections_specify?: string
  site_has_blog?: string
  google_analytics_global?: string
  measurement_tags?: string
  site_objective?: string
  show_products_services?: string
  quantity_approximate?: string
  info_level?: string
  has_domain?: string
  domain_provider?: string
  has_hosting?: string
  hosting_preference?: string
  project_type?: string
  current_site_url?: string
  additional_functionality?: string
  functionality_types?: string[]
  functionality_description?: string
  maintenance_plan?: string
  support_types?: string[]
}

/** Create a quote request entry in Strapi (quote-requests collection). Requires STRAPI_API_TOKEN with create permission. */
export async function createQuoteRequest(payload: QuoteRequestPayload): Promise<{ id: number } | null> {
  try {
    const response = await api.post<{ data: { id: number } }>('/quote-requests', {
      data: payload,
    });
    return response.data?.data ? { id: response.data.data.id } : null;
  } catch (err) {
    console.error('Strapi createQuoteRequest error:', err);
    return null;
  }
}

/** Re-export for server modules; client components must import from `@/lib/strapi-helpers` only. */
export {
  getStrapiImageUrl,
  getProjectImageUrl,
  getProjectGalleryUrls,
  getProjectDetailSlug,
  getBlogPostImageUrl,
} from '@/lib/strapi-helpers'
