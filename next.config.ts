import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  i18n: {
    locales: ['tr', 'en'],
    defaultLocale: 'tr',
  },
  images: {
    domains: ['storage.googleapis.com', 'lh3.googleusercontent.com'],
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
};

export default nextConfig;
