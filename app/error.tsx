'use client'

/**
 * Segment error boundary — stops "missing required error components" when a route throws.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-sm font-mono text-red-400/90 mb-2">Something went wrong</p>
      <p className="text-white/80 text-sm max-w-md mb-6">{error.message}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="px-6 py-2 rounded-lg border border-[#7dd3fc] text-[#7dd3fc] font-mono text-sm uppercase tracking-wider hover:bg-[#7dd3fc]/10"
      >
        Try again
      </button>
    </div>
  )
}
