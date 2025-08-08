import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      // Remove chunks and use fixed file names
      config.output = {
        ...config.output,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].js',
      };

      // Disable code splitting completely
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          cacheGroups: {
            default: false,
            vendors: false,
          },
        },
        runtimeChunk: false,
      };
    }
    return config;
  },
};

export default nextConfig;
