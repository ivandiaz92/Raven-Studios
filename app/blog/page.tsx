import { getBlogPosts } from '@/lib/strapi'
import BlogCard from '@/components/BlogCard'

export const metadata = {
  title: 'Blog - Raven Studios',
  description: 'Read our latest articles on web development, design, and technology',
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="pt-20 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Blog
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Insights, tutorials, and thoughts on web development, design, and technology
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No blog posts found. Check your Strapi connection and ensure content is published.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

