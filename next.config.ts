import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        // En producción Vercel, o localmente, redirige las llamadas al DigitalOcean (o variable de entorno)
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://134.209.74.99:3001'}/:path*`, 
      },
    ];
  },
};

export default nextConfig;
