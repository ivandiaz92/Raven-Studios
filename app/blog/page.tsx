import { getBlogPosts } from '@/lib/content'
import BlogCard from '@/components/BlogCard'
import ContactSection from '@/components/ContactSection'

export const metadata = {
  title: 'Blog - Aspect',
  description: 'Ideas, tutoriales y reflexiones sobre desarrollo web, diseño y tecnología',
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="pt-20 min-h-screen">
      <div className="mx-auto w-[96%] max-w-[1440px] px-4 py-16 min-[480px]:px-5 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <header className="mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-light text-white leading-tight mb-4">
            Blog
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl leading-relaxed">
            Ideas, tutoriales y reflexiones sobre desarrollo web y diseño
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="py-20">
            <p className="text-white/70 text-lg">
              Aún no hay publicaciones. Agrega archivos Markdown en content/blog.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        )}
      </div>

      <ContactSection animate={false} />
    </div>
  )
}
