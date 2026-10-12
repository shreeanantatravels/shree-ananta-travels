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
      {
        source: '/domestic/manali-%26-himachal',
        destination: '/domestic/manali-and-himachal',
        permanent: true,
      },
      {
        source: '/domestic/andaman-%26-nicobar',
        destination: '/domestic/andaman-and-nicobar',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
