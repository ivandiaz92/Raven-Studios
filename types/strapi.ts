export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiImage {
  id: number;
  attributes: {
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
      thumbnail?: {
        url: string;
        width: number;
        height: number;
      };
      small?: {
        url: string;
        width: number;
        height: number;
      };
      medium?: {
        url: string;
        width: number;
        height: number;
      };
      large?: {
        url: string;
        width: number;
        height: number;
      };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Portfolio {
  id: number;
  attributes: {
    title: string;
    slug: string;
    description: string;
    shortDescription: string;
    featuredImage: StrapiResponse<StrapiImage>;
    images?: StrapiResponse<StrapiImage[]>;
    technologies: string[];
    projectUrl?: string;
    githubUrl?: string;
    category: 'Web Development' | 'Mobile App' | 'Design' | 'Other';
    featured: boolean;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
  };
}

/** Strapi "Project" content type (client_name, project_description, main_mockup) */
export interface StrapiProject {
  id: number;
  attributes: {
    client_name: string;
    project_description: string;
    main_mockup?: {
      data?: {
        id: number;
        attributes: StrapiImage['attributes'];
      } | null;
    };
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
  };
}

/** Strapi "Blog Post" content type: post_title, post_content (Blocks), main_image, date_created, author */
export interface StrapiBlogPost {
  id: number;
  attributes: {
    post_title: string;
    post_content?: StrapiBlocks; // Rich text (Blocks)
    main_image?: {
      data?: { id: number; attributes: StrapiImage['attributes'] } | null;
    } | null;
    date_created: string;
    author: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

/** Strapi Blocks (rich text) – array of block nodes */
export type StrapiBlocks = StrapiBlock[];

export interface StrapiBlock {
  type: string;
  children?: { type: string; text?: string }[];
  format?: string;
  url?: string;
  level?: number;
  [key: string]: unknown;
}

/** @deprecated Use StrapiBlogPost for Blog Post API */
export interface BlogPost {
  id: number;
  attributes: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: StrapiResponse<StrapiImage>;
    author: string;
    tags: string[];
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
  };
}

