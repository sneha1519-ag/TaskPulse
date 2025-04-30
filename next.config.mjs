/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle mongoose on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        mongoose: false,
      };
    }
    return config;
  },
  // Use the correct property name for external packages
  serverExternalPackages: ['mongoose'],
  // Configuration for Turbopack
  turbo: {
    loaders: {
      // Configure any specific loaders needed for your project
      // For example, exclude mongoose from client-side bundling
      '.js': ['swc-loader'],
    },
    resolve: {
      alias: {
        // Any aliases you need
      },
    },
  },
};

export default nextConfig;
