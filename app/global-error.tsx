'use client'

/**
 * Catches errors in the root layout (segment error.tsx does not).
 * Required HTML/body shell per Next.js App Router.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-black text-white antialiased flex flex-col items-center justify-center p-8">
        <p className="text-sm font-mono text-red-400 mb-2">Error</p>
        <p className="text-white/80 text-sm text-center max-w-md mb-6">{error.message}</p>
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-2 rounded-lg border border-[#7dd3fc] text-[#7dd3fc] font-mono text-sm uppercase tracking-wider hover:bg-[#7dd3fc]/10"
        >
          Reintentar
        </button>
      </body>
    </html>
  )
}
