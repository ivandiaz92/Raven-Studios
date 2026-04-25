import fs from 'node:fs/promises'
import path from 'node:path'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const PROJECTS_DIR = path.join(CONTENT_DIR, 'projects')
const BLOG_DIR = path.join(CONTENT_DIR, 'blog')

export interface Project {
  slug: string
  title: string
  date?: string
  liveUrl?: string
  tools: string[]
  coverImage?: string
  gallery: string[]
  overview?: string
  conclusion?: string
}

export interface BlogPost {
  slug: string
  title: string
  date: string
  author?: string
  excerpt?: string
  coverImage?: string
  tags: string[]
  content: string
  html: string
}

type ProjectJson = Partial<Project> & { slug?: string; title?: string }
type BlogFrontmatter = Partial<Omit<BlogPost, 'content' | 'html' | 'tags'>> & { tags?: string[] }

async function readDirSafe(dir: string) {
  try {
    return await fs.readdir(dir)
  } catch {
    return []
  }
}

function sortByDateDesc<T extends { date?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const aTime = a.date ? new Date(a.date).getTime() : 0
    const bTime = b.date ? new Date(b.date).getTime() : 0
    return bTime - aTime
  })
}

function assertProject(data: ProjectJson, file: string): Project {
  if (!data.slug || !data.title) {
    throw new Error(`Project content "${file}" needs at least slug and title.`)
  }

  return {
    slug: data.slug,
    title: data.title,
    date: data.date,
    liveUrl: data.liveUrl || undefined,
    tools: Array.isArray(data.tools) ? data.tools : [],
    coverImage: data.coverImage || undefined,
    gallery: Array.isArray(data.gallery) ? data.gallery : [],
    overview: data.overview || '',
    conclusion: data.conclusion || '',
  }
}

export async function getProjects(limit?: number): Promise<Project[]> {
  const files = (await readDirSafe(PROJECTS_DIR)).filter((file) => file.endsWith('.json'))
  const projects = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(PROJECTS_DIR, file), 'utf8')
      return assertProject(JSON.parse(raw) as ProjectJson, file)
    })
  )
  const sorted = sortByDateDesc(projects)
  return typeof limit === 'number' ? sorted.slice(0, limit) : sorted
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects()
  return projects.find((project) => project.slug === slug) ?? null
}

export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getProjects()
  return projects.map((project) => project.slug)
}

function parseFrontmatter(markdown: string): { data: BlogFrontmatter; content: string } {
  if (!markdown.startsWith('---')) {
    return { data: {}, content: markdown.trim() }
  }

  const end = markdown.indexOf('\n---', 3)
  if (end === -1) return { data: {}, content: markdown.trim() }

  const frontmatter = markdown.slice(3, end).trim()
  const content = markdown.slice(end + 4).trim()
  const data: Record<string, unknown> = {}
  const lines = frontmatter.split(/\r?\n/)

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!match) continue

    const [, key, rawValue] = match
    if (rawValue === '') {
      const values: string[] = []
      while (i + 1 < lines.length && /^\s+-\s+/.test(lines[i + 1])) {
        i += 1
        values.push(lines[i].replace(/^\s+-\s+/, '').trim())
      }
      data[key] = values
    } else {
      data[key] = rawValue.replace(/^['"]|['"]$/g, '')
    }
  }

  return { data: data as BlogFrontmatter, content }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderInlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
}

export function markdownToHtml(markdown: string): string {
  const blocks = markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  return blocks
    .map((block) => {
      if (block.startsWith('## ')) {
        return `<h2>${renderInlineMarkdown(block.slice(3))}</h2>`
      }
      if (block.startsWith('### ')) {
        return `<h3>${renderInlineMarkdown(block.slice(4))}</h3>`
      }
      if (block.split('\n').every((line) => line.startsWith('- '))) {
        const items = block
          .split('\n')
          .map((line) => `<li>${renderInlineMarkdown(line.slice(2).trim())}</li>`)
          .join('')
        return `<ul>${items}</ul>`
      }
      return `<p>${renderInlineMarkdown(block).replace(/\n/g, '<br />')}</p>`
    })
    .join('\n')
}

function assertBlogPost(data: BlogFrontmatter, content: string, file: string): BlogPost {
  if (!data.slug || !data.title || !data.date) {
    throw new Error(`Blog content "${file}" needs slug, title, and date frontmatter.`)
  }

  return {
    slug: data.slug,
    title: data.title,
    date: data.date,
    author: data.author || undefined,
    excerpt: data.excerpt || '',
    coverImage: data.coverImage || undefined,
    tags: Array.isArray(data.tags) ? data.tags : [],
    content,
    html: markdownToHtml(content),
  }
}

export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  const files = (await readDirSafe(BLOG_DIR)).filter((file) => file.endsWith('.md'))
  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(BLOG_DIR, file), 'utf8')
      const { data, content } = parseFrontmatter(raw)
      return assertBlogPost(data, content, file)
    })
  )
  const sorted = sortByDateDesc(posts)
  return typeof limit === 'number' ? sorted.slice(0, limit) : sorted
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts()
  return posts.find((post) => post.slug === slug) ?? null
}

export async function getBlogSlugs(): Promise<string[]> {
  const posts = await getBlogPosts()
  return posts.map((post) => post.slug)
}
