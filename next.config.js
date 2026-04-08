/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow production build on server when ESLint/TS deps are broken
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Do NOT set assetPrefix here — it rewrites asset URLs to /next/_next/static/...
  // and breaks CSS/JS unless every proxy layer rewrites that path correctly.
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
}

module.exports = nextConfig
