'use client'

/** Right-pointing arrow (→) for "View project", "View Live Site", etc. */
export default function ExternalLinkIcon({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center shrink-0 ${className}`} aria-hidden>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[1em] h-[1em]"
        aria-hidden
      >
        <path d="M5 12h14M15 8l4 4-4 4" />
      </svg>
    </span>
  )
}
