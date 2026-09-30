import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  devIndicators: false,

  turbopack: {
    root: process.cwd(),
  },

  images: {
    formats: ["image/avif", "image/webp"],
    /*
     * Dominio público por defecto de los buckets de
     * Cloudflare R2 (R2_PUBLIC_BASE_URL_MEDIA /
     * R2_PUBLIC_BASE_URL_BIM). Si en algún momento se
     * configura un dominio propio para esos buckets en
     * vez del *.r2.dev por defecto, hay que agregar ese
     * hostname acá también.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
    ],
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons"],
  },
} satisfies NextConfig;

export default nextConfig;