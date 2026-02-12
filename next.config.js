/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use /next so asset URLs work in Cursor/browsers that strip leading underscore from _next
  assetPrefix: '/next',
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

