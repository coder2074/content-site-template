// next.config.mjs

const isServerRendered = process.env.NEXT_PUBLIC_SERVER_RENDERED === 'true'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isServerRendered ? {} : { output: 'export' }),
  trailingSlash: true,
  transpilePackages: ['react-leaflet'],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
    ],
  },
  // Inject pathname header for AccessControlGate — server-rendered mode only
  ...(isServerRendered && {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [{ key: 'x-pathname', value: '/:path*' }],
        },
      ]
    },
  }),
  // Turbopack alias — swap AuthProvider for static passthrough in static builds
  ...(!isServerRendered && {
    turbopack: {
      resolveAlias: {
        '@/components/AuthProvider': './components/AuthProviderStatic.tsx',
        '@/components/AccessControlGate': './components/AccessControlGateStatic.tsx',
        '@/components/SignInForm': './components/SignInFormStatic.tsx',
      },
    },
  }),
}

export default nextConfig
