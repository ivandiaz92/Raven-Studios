'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getBlogPostImageUrl } from '@/lib/strapi'
import type { StrapiBlogPost } from '@/types/strapi'

gsap.registerPlugin(ScrollTrigger)

interface BlogCardProps {
  post: StrapiBlogPost
  index?: number
}

export default function BlogCard({ post, index = 0 }: BlogCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: index * 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
          },
        }
      )
    }
  }, [index])

  const imageUrl = getBlogPostImageUrl(post)
  const dateStr = new Date(post.attributes.date_created).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link href={`/blog/${post.id}`}>
      <div
        ref={cardRef}
        className="group relative overflow-hidden rounded-lg border border-gray-800 bg-gray-900/80 hover:border-[#7dd3fc]/50 transition-all duration-300"
      >
        {imageUrl ? (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={imageUrl}
              alt={post.attributes.post_title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>
        ) : (
          <div className="relative aspect-[16/10] bg-gray-800/80 flex items-center justify-center">
            <span className="text-gray-600 font-mono text-sm">No image</span>
          </div>
        )}
        <div className="p-6">
          <p className="font-mono text-xs text-white/60 mb-2">{dateStr}</p>
          <h3 className="text-xl font-display font-light mb-2 text-white group-hover:text-[#7dd3fc] transition-colors line-clamp-2">
            {post.attributes.post_title}
          </h3>
          {post.attributes.author && (
            <p className="text-white/70 text-sm">By {post.attributes.author}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
