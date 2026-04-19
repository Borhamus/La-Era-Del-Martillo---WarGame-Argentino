/** @type {import('next').NextConfig} */
const nextConfig = {
  // Necesario para Docker multi-stage build
  output: "standalone",

  // Configuración de imágenes (para avatares, etc.)
  images: {
    remotePatterns: [],
  },

  // Logs de TypeScript en build
  typescript: {
    ignoreBuildErrors: false,
  },

  // Logs de ESLint en build
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
