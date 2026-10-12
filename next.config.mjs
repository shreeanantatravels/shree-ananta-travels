/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons', 'date-fns'],
  },
  async redirects() {
    return [
      {
        source: '/landing/kailash-mansarovar',
        destination: '/kailash-mansarovar',
        permanent: true,
      },
      {
        source: '/domestic/manali-%26-himachal',
        destination: '/domestic/manali-and-himachal',
        permanent: true,
      },
      {
        source: '/domestic/manali-himachal',
        destination: '/domestic/manali-and-himachal',
        permanent: true,
      },
      {
        source: '/domestic/andaman-%26-nicobar',
        destination: '/domestic/andaman-and-nicobar',
        permanent: true,
      },
      {
        source: '/domestic/andaman-nicobar',
        destination: '/domestic/andaman-and-nicobar',
        permanent: true,
      },
      {
        source: '/packages',
        has: [
          {
            type: 'query',
            key: 'category',
            value: 'trending',
          },
        ],
        destination: '/trending',
        permanent: true,
      },
      {
        source: '/packages',
        has: [
          {
            type: 'query',
            key: 'category',
            value: 'spiritual',
          },
        ],
        destination: '/spiritual',
        permanent: true,
      },
      {
        source: '/packages',
        has: [
          {
            type: 'query',
            key: 'search',
            value: 'Beach',
          },
        ],
        destination: '/theme/beach',
        permanent: true,
      },
      {
        source: '/packages',
        has: [
          {
            type: 'query',
            key: 'search',
            value: 'Heritage',
          },
        ],
        destination: '/theme/heritage',
        permanent: true,
      },
      {
        source: '/packages',
        has: [
          {
            type: 'query',
            key: 'search',
            value: 'Adventure',
          },
        ],
        destination: '/theme/adventure',
        permanent: true,
      },
      {
        source: '/packages',
        has: [
          {
            type: 'query',
            key: 'search',
            value: 'Honeymoon',
          },
        ],
        destination: '/theme/honeymoon',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
