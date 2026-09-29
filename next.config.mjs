/** @type {import('next').NextConfig} */
const isProdExport = process.env.NODE_ENV === 'production' && process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  reactStrictMode: true,
  output: isProdExport ? 'export' : undefined,
  basePath: isProdExport ? '/LD_costadeoro' : '',
  trailingSlash: true,
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
