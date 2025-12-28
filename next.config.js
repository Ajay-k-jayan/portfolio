/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['github.com', 'via.placeholder.com'],
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
  // Optimize output
  output: 'standalone',
}

module.exports = nextConfig

