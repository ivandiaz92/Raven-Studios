'use client'

import { useEffect, useState } from 'react'

/**
 * Cycle: type → hold → erase → next word.
 * Third word ideas: conectan (default) · transforman · inspiran · posicionan · venden
 */
const ROTATING_WORDS = ['convierten', 'impactan', 'conectan'] as const

const TYPE_MS = 72
const DELETE_MS = 42
const HOLD_MS = 2400
const BETWEEN_WORDS_MS = 380

export default function HeroRotatingWord() {
  const [display, setDisplay] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(ROTATING_WORDS[0])
      return
    }

    let cancelled = false
    let wordIndex = 0
    let charIndex = 0
    let deleting = false
    let timeoutId: ReturnType<typeof setTimeout>

    const schedule = (fn: () => void, ms: number) => {
      timeoutId = setTimeout(() => {
        if (!cancelled) fn()
      }, ms)
    }

    const step = () => {
      if (cancelled) return
      const full = ROTATING_WORDS[wordIndex]

      if (!deleting) {
        if (charIndex < full.length) {
          charIndex += 1
          setDisplay(full.slice(0, charIndex))
          schedule(step, TYPE_MS)
        } else {
          schedule(() => {
            deleting = true
            step()
          }, HOLD_MS)
        }
      } else {
        if (charIndex > 0) {
          charIndex -= 1
          setDisplay(full.slice(0, charIndex))
          schedule(step, DELETE_MS)
        } else {
          deleting = false
          wordIndex = (wordIndex + 1) % ROTATING_WORDS.length
          schedule(step, BETWEEN_WORDS_MS)
        }
      }
    }

    step()

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <span className="inline-flex max-w-full flex-wrap items-baseline gap-x-1 gap-y-1">
      <span className="shrink-0 whitespace-pre">que </span>
      <span className="min-w-0 break-words italic" aria-live="polite">
        {display}
      </span>
      <span
        className="ml-0.5 inline-block h-[0.62em] w-[3px] shrink-0 self-center rounded-[1px] bg-current animate-pulse motion-reduce:animate-none sm:h-[0.68em]"
        aria-hidden
      />
    </span>
  )
}
