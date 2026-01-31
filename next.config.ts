import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  serverExternalPackages: ["@prisma/client", "pg", "@prisma/adapter-pg", "bcryptjs"],
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Fallback for node built-ins
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
        process: false,
        child_process: false,
        perf_hooks: false,
        util: false,
        worker_threads: false,
      };

      // Plugin to strip 'node:' prefix
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource: { request: string }) => {
          resource.request = resource.request.replace(/^node:/, "");
        })
      );
    }
    return config;
  },
};

export default nextConfig;