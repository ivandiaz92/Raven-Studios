import type { CSSProperties } from 'react'
import Link from 'next/link'

/** Inline fallbacks so this page stays readable if Tailwind/CSS chunks fail to load */
const shell: CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#0a0a0a',
  color: '#ededed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6rem 1rem 2rem',
  fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4" style={shell}>
      <div className="text-center max-w-lg">
        <p
          className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
          style={{
            fontSize: '3.75rem',
            fontWeight: 700,
            marginBottom: '1rem',
            background: 'linear-gradient(to right, #c084fc, #22d3ee)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          404
        </p>
        <h2 className="text-2xl font-semibold mb-4 text-white" style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>
          Page Not Found
        </h2>
        <p className="text-gray-400 mb-8" style={{ color: '#9ca3af', marginBottom: '2rem' }}>
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all inline-block"
          style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            borderRadius: '0.5rem',
            fontWeight: 600,
            color: '#fff',
            textDecoration: 'none',
            background: 'linear-gradient(to right, #a855f7, #06b6d4)',
          }}
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
