/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  // Allow production build on server when ESLint/TS deps are broken
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Only in production: /next prefix for hosts that rewrite _next (e.g. some proxies). Breaks local dev if always on.
  ...(isProd ? { assetPrefix: '/next' } : {}),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Serve _next/static content when requests hit /next/static/
  async rewrites() {
    return [
      { source: '/next/static/:path*', destination: '/_next/static/:path*' },
    ]
  },
}

module.exports = nextConfig

