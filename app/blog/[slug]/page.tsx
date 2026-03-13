import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { getBlogPostBySlug, getAllBlogSlugs, getStrapiImageUrl } from '@/lib/strapi'

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  const title = post.attributes.title ?? post.attributes.post_title
  const description = post.attributes.excerpt ?? ''

  return {
    title: `${title} - Raven Studios`,
    description,
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const attrs = post.attributes
  const featuredImageUrl = getStrapiImageUrl(attrs.featuredImage ?? attrs.main_image)
  const dateStr = attrs.publishedAt ?? attrs.date_created
  const publishedDate = format(new Date(dateStr), 'MMMM dd, yyyy')
  const title = attrs.title ?? attrs.post_title
  const excerpt = attrs.excerpt ?? ''
  const content = attrs.content ?? ''
  const tags = attrs.tags ?? []

  return (
    <div className="pt-20 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        {/* Featured Image */}
        {featuredImageUrl && (
          <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={featuredImageUrl}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
            <span>{publishedDate}</span>
            <span>By {attrs.author}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {title}
          </h1>
          {excerpt && (
            <p className="text-xl text-gray-300 mb-6">
              {excerpt}
            </p>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {content && (
          <article className="prose prose-invert max-w-none">
            <div 
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>
        )}
      </div>
    </div>
  )
}

