/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/django/:root*',
        destination: `${process.env.BASE_API_URL || ''}/:root*`,
      },
    ];
  },
};

export default nextConfig;
