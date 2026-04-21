/** @type {import('next').NextConfig} */
const nextConfig = {
  // ================================================
  // VERCEL-OPTIMIZED CONFIGURATION
  // ================================================
  // Removed 'output: export' - Vercel supports full Next.js!

  // Clean URLs without trailing slashes
  trailingSlash: false,

  // ✅ ENABLE IMAGE OPTIMIZATION (Vercel supports this!)
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },

  // Enable React strict mode for better debugging
  reactStrictMode: true,

  // Compiler optimizations
  compiler: {
    // Remove console.logs in production
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },

  // ✅ HEADERS (now works on Vercel!)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache data files
      {
        source: '/data/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ]
  },

  // ✅ REDIRECTS (properly handled on Vercel!)
  async redirects() {
    return [
      // Add any redirects you need
      // Example:
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ]
  },

  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['framer-motion', 'date-fns', 'react-icons', 'react-day-picker'],
  },
}

export default nextConfig
