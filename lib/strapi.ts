import axios from 'axios';
import type { Portfolio, StrapiProject, StrapiResponse, StrapiBlogPost } from '@/types/strapi';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
  },
});

const STRAPI_MEDIA_BASE = process.env.NEXT_PUBLIC_STRAPI_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:1337'

// Skip Strapi during build so 503s don't fail the build; data loads at runtime (ISR).
const skipStrapiDuringBuild =
  process.env.SKIP_STRAPI_BUILD === '1' || process.env.NEXT_PHASE === 'phase-production-build'

// Helper to get image URL (handles Strapi media: data as object or array, relation { data: { attributes } }, or flat attributes)
export function getStrapiImageUrl(image: any): string {
  if (!image) return '';
  if (typeof image === 'string') return image.startsWith('http') ? image : `${STRAPI_MEDIA_BASE}${image.startsWith('/') ? image : '/' + image}`;
  // Strapi can return data as single object or as array (e.g. main_mockup.data: [{ id, attributes }])
  const data = image?.data;
  const attrs = Array.isArray(data) ? data[0]?.attributes : data?.attributes ?? image?.attributes;
  const url = attrs?.url ?? attrs?.formats?.large?.url ?? attrs?.formats?.medium?.url ?? attrs?.formats?.small?.url;
  if (url) {
    return url.startsWith('http') ? url : `${STRAPI_MEDIA_BASE}${url.startsWith('/') ? url : '/' + url}`;
  }
  return '';
}

// Get the main image from a Project (project_image)
export function getProjectImageUrl(project: StrapiProject): string {
  return getStrapiImageUrl(project?.attributes?.project_image)
}

// Get all gallery image URLs from a Project (project_gallery)
export function getProjectGalleryUrls(project: StrapiProject): string[] {
  const gallery = project?.attributes?.project_gallery
  if (!gallery?.data || !Array.isArray(gallery.data)) return []
  return gallery.data
    .map((item) => getStrapiImageUrl(item?.attributes ? { data: item } : null))
    .filter(Boolean)
}

// —— Projects API (your Strapi "Project" content type) ——
// Strapi Cloud often 503s on populate; if that fails we fetch without populate so projects still show.
export async function getProjects(limit?: number): Promise<StrapiProject[]> {
  if (skipStrapiDuringBuild) return []

  const baseParams: Record<string, unknown> = {
    sort: ['publishedAt:desc'],
  }
  if (limit) baseParams.pagination = { limit }

  const fetchProjects = async (populate?: string[]) => {
    const params = populate?.length
      ? { ...baseParams, populate }
      : baseParams
    const response = await api.get<StrapiResponse<StrapiProject[]>>('/projects', {
      params,
      timeout: 15000,
    })
    return response.data?.data ?? []
  }

  try {
    const data = await fetchProjects(['project_image'])
    if (data.length > 0) {
      console.log('[getProjects] ok with images, count:', data.length)
    }
    return data
  } catch (first: unknown) {
    const status =
      first && typeof first === 'object' && 'response' in first
        ? (first as { response?: { status?: number } }).response?.status
        : undefined
    console.warn('[getProjects] populate failed (' + (status ?? 'network') + '), retrying without images')

    try {
      const data = await fetchProjects()
      if (data.length > 0) console.log('[getProjects] ok without populate, count:', data.length)
      return data
    } catch (err: unknown) {
      if (process.env.NODE_ENV === 'development' && err && typeof err === 'object' && 'code' in err && err.code === 'ECONNREFUSED') {
        console.warn('Strapi not running — start it with: cd ../ravenstudios-strapi && npm run develop');
      }
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { status?: number; data?: unknown } }).response?.status
        : err;
      console.error('getProjects failed (both attempts):', msg);
      return [];
    }
  }
}

/** URL segment for /portfolio/[slug] — Strapi v5 needs documentId for GET /projects/:id */
export function getProjectDetailSlug(project: StrapiProject): string {
  const doc = project.documentId?.trim()
  if (doc) return doc
  return String(project.id)
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

  let project = await tryKey(idOrSlug)
  if (project) return project

  // Strapi v5: /projects/123 often 404s; list still returns id + documentId — resolve then refetch
  try {
    const all = await getProjects(100)
    const match = all.find(
      (p) => String(p.id) === idOrSlug || (p.documentId && p.documentId === idOrSlug)
    )
    if (!match) return null
    if (match.documentId && match.documentId !== idOrSlug) {
      project = await tryKey(match.documentId)
      if (project) return project
    }
    return match
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

export function getBlogPostImageUrl(post: StrapiBlogPost): string {
  return getStrapiImageUrl(post?.attributes?.main_image);
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

