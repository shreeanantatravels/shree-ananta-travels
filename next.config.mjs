/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/landing/kailash-mansarovar',
        destination: '/kailash-mansarovar',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
