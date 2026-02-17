// ============================================================================
// FILE: next.config.mjs
// ============================================================================
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',  // This wildcard covers ALL S3 buckets
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',  // For Amazon product images
      },
    ],
  },
}

export default nextConfig