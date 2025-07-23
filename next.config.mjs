/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        readline: false, // 👈 suppress readline warning
      };
    }
    return config;
  },
};

export default nextConfig;
