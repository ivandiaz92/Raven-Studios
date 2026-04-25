import { getBlogPosts } from '@/lib/content'
import BlogCard from '@/components/BlogCard'

export const metadata = {
  title: 'Blog - Aspect',
  description: 'Insights, tutorials, and thoughts on web development, design, and technology',
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="pt-20 min-h-screen">
      <div className="w-[90%] max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <header className="mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-light text-white leading-tight mb-4">
            Latest Insights
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl leading-relaxed">
            Thoughts, tutorials, and insights on web development and design
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="py-20">
            <p className="text-white/70 text-lg">
              No posts yet. Add Markdown files in content/blog.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
