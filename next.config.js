const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  webpack: (config, { isServer }) => {

    // حل مشکل Node built-ins
    config.externals = [...(config.externals || []), 'canvas', 'jsdom'];

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        module: false,
        async_hooks: false,
        crypto: false,
        buffer: false,
        events: false,
        os: false,
      };

      config.module.rules.push({
        test: /node:/,
        use: 'null-loader',
      });
    }

    // تعریف alias مستقیم: '@' -> src
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, 'src'),
    };

    return config;
  },
};

module.exports = nextConfig;
