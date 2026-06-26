'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { BlogPost } from '@/lib/content'
import { SITE_LOCALE } from '@/lib/locale'

gsap.registerPlugin(ScrollTrigger)

interface BlogCardProps {
  post: BlogPost
  index?: number
  /** When false, skip scroll-triggered entrance (e.g. homepage GSAP handles parent). */
  animate?: boolean
  showExcerpt?: boolean
}

export default function BlogCard({
  post,
  index = 0,
  animate = true,
  showExcerpt = true,
}: BlogCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!animate || !cardRef.current) return

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
  }, [animate, index])

  const imageUrl = post.coverImage
  const dateStr = new Date(post.date).toLocaleDateString(SITE_LOCALE, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link
      ref={cardRef}
      href={`/blog/${post.slug}`}
      className="group block h-full min-h-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-800 bg-gray-900/80 transition-all duration-300 hover:border-[#7dd3fc]/50">
        {imageUrl ? (
          <div className="relative aspect-[16/10] shrink-0 overflow-hidden">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>
        ) : (
          <div className="relative flex aspect-[16/10] shrink-0 items-center justify-center bg-gray-800/80">
            <span className="font-mono text-sm text-gray-600">Sin imagen</span>
          </div>
        )}
        <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
          <p className="mb-2 font-mono text-xs text-white/60">{dateStr}</p>
          <h3 className="line-clamp-2 font-display text-lg font-light text-white transition-colors group-hover:text-[#7dd3fc] sm:text-xl">
            {post.title}
          </h3>
          {showExcerpt && post.excerpt && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/70 [overflow-wrap:anywhere]">
              {post.excerpt}
            </p>
          )}
          {post.author && (
            <p className="mt-auto pt-3 text-sm text-white/60">Por {post.author}</p>
          )}
        </div>
      </article>
    </Link>
  )
}
