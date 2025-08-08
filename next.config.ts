import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      // Force all JS into a single main.js file
      config.output = {
        ...config.output,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].js',
      };

      config.optimization = {
        ...config.optimization,
        splitChunks: false,
        runtimeChunk: false,
      };
    }
    return config;
  },
};

export default nextConfig;
