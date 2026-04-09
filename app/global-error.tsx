'use client'

/**
 * Root error UI — must include html/body when the root layout fails.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ background: '#0a0a0a', color: '#ededed', fontFamily: 'system-ui, sans-serif', minHeight: '100vh', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
          <h1 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Something went wrong</h1>
          <p style={{ fontSize: '0.875rem', opacity: 0.85, marginBottom: '1.5rem' }}>{error.message}</p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '0.5rem',
              border: '1px solid #7dd3fc',
              background: 'transparent',
              color: '#7dd3fc',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
