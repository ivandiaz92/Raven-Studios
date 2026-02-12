'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getStrapiImageUrl } from '@/lib/strapi'
import type { BlogPost } from '@/types/strapi'

gsap.registerPlugin(ScrollTrigger)

interface BlogCardProps {
  post: BlogPost
  index?: number
}

export default function BlogCard({ post, index = 0 }: BlogCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 80%',
          },
        }
      )
    }
  }, [index])

  const imageUrl = getStrapiImageUrl(post.attributes.featuredImage?.data)
  const publishedDate = format(new Date(post.attributes.publishedAt), 'MMM dd, yyyy')

  return (
    <Link href={`/blog/${post.attributes.slug}`}>
      <div
        ref={cardRef}
        className="group overflow-hidden rounded-lg border border-gray-800 bg-gradient-to-br from-gray-900 to-black hover:border-purple-500/50 transition-all duration-300"
      >
        {imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={imageUrl}
              alt={post.attributes.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center justify-between mb-2 text-sm text-gray-400">
            <span>{publishedDate}</span>
            <span>By {post.attributes.author}</span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
            {post.attributes.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {post.attributes.excerpt}
          </p>
          <div className="flex flex-wrap gap-2">
            {post.attributes.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}

