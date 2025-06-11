import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  i18n: {
    locales: ['tr', 'en'],
    defaultLocale: 'tr',
  },
  images: {
    domains: [
      'storage.googleapis.com', 
      'lh3.googleusercontent.com',
      'images.unsplash.com' // Unsplash görsellerine izin ver
    ],
    unoptimized: true, // Statik dışa aktarım için gerekli
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
  // Statik dosyaların önbelleğini iyileştir
  staticPageGenerationTimeout: 120,
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;