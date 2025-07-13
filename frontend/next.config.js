/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fix for pino-pretty module resolution in browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "pino-pretty": false,
        fs: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;