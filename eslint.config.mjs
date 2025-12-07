// eslint.config.mjs
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  // Next.js + React + hooks + Core Web Vitals rules
  ...nextVitals,

  // Ignore build artifacts
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
