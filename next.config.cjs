/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['api.telegram.org'],
  },
  i18n: {
    locales: ['uz', 'ru', 'en'],
    defaultLocale: 'uz',
    localeDetection: true,
  },
};

module.exports = nextConfig;
