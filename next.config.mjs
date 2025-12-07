/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveAlias: {
      readline: "./src/utils/readline-stub.js",
    },
  },
};

export default nextConfig;
