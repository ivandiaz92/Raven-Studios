import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { getBlogPostBySlug, getBlogPosts, getBlogSlugs } from '@/lib/content'
import BlogCard from '@/components/BlogCard'
import ContactSection from '@/components/ContactSection'
export async function generateStaticParams() {
  const slugs = await getBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Publicación no encontrada',
    }
  }

  return {
    title: `${post.title} - Aspect`,
    description: post.excerpt ?? '',
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, allPosts] = await Promise.all([
    getBlogPostBySlug(params.slug),
    getBlogPosts(6),
  ])

  if (!post) {
    notFound()
  }

  const featuredImageUrl = post.coverImage
  const publishedDate = format(new Date(post.date), "d 'de' MMMM, yyyy", { locale: es })
  const otherPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
    <div className="pt-20 min-h-screen">
      <div className="mx-auto w-[96%] max-w-[1280px] px-4 py-16 min-[480px]:px-5 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Link
          href="/blog"
          className="mb-10 inline-flex items-center gap-2 border-b border-white/60 pb-1.5 font-mono text-xs uppercase tracking-[0.2em] text-white transition-colors hover:border-[#7dd3fc] hover:text-[#7dd3fc] sm:mb-12 sm:text-sm"
        >
          <span className="text-base" aria-hidden>
            ←
          </span>
          Volver al blog
        </Link>

        {featuredImageUrl && (
          <div className="relative mb-14 aspect-[16/10] w-full overflow-hidden rounded-lg bg-gray-900 sm:mb-20 lg:aspect-[21/9] lg:max-h-[520px]">
            <Image
              src={featuredImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 96vw, 1280px"
              unoptimized
            />
          </div>
        )}

        <header className="mb-14 sm:mb-20">
          <h1 className="mb-4 font-display text-4xl font-light leading-tight text-white sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-base text-white/70">
            <time dateTime={post.date}>{publishedDate}</time>
            {post.author && <span>Por {post.author}</span>}
          </div>
          {post.excerpt && (
            <p className="mt-6 max-w-4xl text-base leading-relaxed text-white/80 sm:text-lg">
              {post.excerpt}
            </p>
          )}
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/90"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {post.html && (
          <article
            className="blog-article"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        )}

        {otherPosts.length > 0 && (
          <section className="mt-20 border-t border-gray-800 pt-16 sm:mt-28 sm:pt-20">
            <h2 className="mb-8 font-display text-3xl font-light text-white sm:mb-10 sm:text-4xl">
              Continúa leyendo
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
              {otherPosts.map((p, i) => (
                <BlogCard key={p.slug} post={p} index={i} showExcerpt={false} />
              ))}
            </div>
          </section>
        )}
      </div>

      <ContactSection animate={false} />
    </div>
  )
}
