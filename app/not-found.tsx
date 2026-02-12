import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-4 text-white">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all inline-block"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}

