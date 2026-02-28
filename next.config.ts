import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  env: {
    APP_VERSION: process.env.npm_package_version,
  },
};

export default nextConfig;
