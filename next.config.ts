import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  devIndicators: false,

  /*
   * Sin esto, "next dev" rechaza las peticiones que no
   * vienen de localhost (por ejemplo, abrir el sitio
   * desde el celular usando la IP de la red local tipo
   * 192.168.x.x), rompiendo el login, las navegaciones
   * del lado del cliente y otras acciones que hacen
   * pedidos al servidor.
   */
  allowedDevOrigins: [
    "192.168.0.202",
    "192.168.0.*",
  ],

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