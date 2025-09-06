/** @type {import('next').NextConfig} */
const enablePolling = process.env.ENABLE_HOT_RELOAD_POLLING === 'true';

const nextConfig = {
    reactStrictMode: true,
    webpack(config, { dev, isServer }) {
      if (dev && isServer && enablePolling) {
        config.watchOptions = {
          poll: 1000,
          aggregateTimeout: 300,
        };
      }
      return config;
    },
  };

export default nextConfig;
