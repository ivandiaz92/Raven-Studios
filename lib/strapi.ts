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

// Get the main image from a Project (Strapi may use main_mockup, mainMockup, or other name)
export function getProjectImageUrl(project: StrapiProject): string {
  const attrs = project?.attributes as Record<string, unknown> | undefined
  if (!attrs) return ''
  const image =
    attrs.main_mockup ??
    attrs.mainMockup ??
    attrs.image ??
    attrs.featuredImage ??
    attrs.thumbnail
  return getStrapiImageUrl(image)
}

// —— Projects API (your Strapi "Project" content type) ——
// Populate all relations so media (e.g. main_mockup) is included whatever its name
export async function getProjects(limit?: number): Promise<StrapiProject[]> {
  try {
    const params: Record<string, unknown> = {
      populate: '*',
      sort: ['publishedAt:desc'],
    };
    if (limit) params.pagination = { limit };
    const response = await api.get<StrapiResponse<StrapiProject[]>>('/projects', {
      params,
      timeout: 3000,
    });
    return response.data.data ?? [];
  } catch (err: unknown) {
    if (process.env.NODE_ENV === 'development' && err && typeof err === 'object' && 'code' in err && err.code === 'ECONNREFUSED') {
      console.warn('Strapi not running — start it with: cd ../ravenstudios-strapi && npm run develop');
    }
    return [];
  }
}

export async function getProjectById(id: string): Promise<StrapiProject | null> {
  try {
    const response = await api.get<StrapiResponse<StrapiProject>>(`/projects/${id}`, {
      params: { populate: '*' },
    });
    return response.data.data ?? null;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

// Portfolio API
export async function getPortfolios(filters?: {
  featured?: boolean;
  category?: string;
  limit?: number;
}): Promise<Portfolio[]> {
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
  try {
    const response = await api.get<StrapiResponse<Portfolio>>('/portfolios', {
      params: {
        filters: { slug: { $eq: slug } },
        populate: ['featuredImage', 'images'],
      },
    });

    if (response.data.data && response.data.data.length > 0) {
      return response.data.data[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
}

// Blog API (Strapi "Blog Post": post_title, post_content, main_image, date_created, author)
export async function getBlogPosts(limit?: number): Promise<StrapiBlogPost[]> {
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

export async function getAllPortfolioSlugs(): Promise<string[]> {
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

