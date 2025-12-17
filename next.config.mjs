/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@heartlandone/vega-react'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.fishbase.org',
        port: '',
        pathname: '/images/thumbnails/jpg/**',
        search: '',
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
