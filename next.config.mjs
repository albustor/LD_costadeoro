/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['firebase-admin'],
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  devIndicators: false,
};

export default nextConfig;

