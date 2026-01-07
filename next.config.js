/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Optimize build performance
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Reduce build time and bundle size
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  // Optimize output - only use standalone in production
  ...(process.env.NODE_ENV === 'production' ? { output: 'standalone' } : {}),
}

module.exports = nextConfig

