import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./app/i18n/request.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE: process.env.API_BASE || "https://api.banfan.app",
    ENVIRONMENT: process.env.ENVIRONMENT || "local",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cf.geekdo-images.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
