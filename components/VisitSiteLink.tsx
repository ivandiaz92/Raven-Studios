import ExternalLinkIcon from '@/components/ExternalLinkIcon'

interface VisitSiteLinkProps {
  href: string
  className?: string
  /** Mono uppercase (default) or button-style CTA */
  variant?: 'inline' | 'button'
}

export default function VisitSiteLink({
  href,
  className = '',
  variant = 'inline',
}: VisitSiteLinkProps) {
  if (variant === 'button') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#7dd3fc]/40 bg-[#7dd3fc]/10 px-5 py-3 font-mono text-xs uppercase tracking-[0.15em] text-[#7dd3fc] transition-colors hover:border-[#7dd3fc]/70 hover:bg-[#7dd3fc]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:text-sm ${className}`}
      >
        Ver sitio en vivo
        <ExternalLinkIcon className="text-base" />
      </a>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#7dd3fc] transition-colors hover:underline sm:text-sm ${className}`}
    >
      Ver sitio en vivo
      <ExternalLinkIcon className="text-[1.2em]" />
    </a>
  )
}
