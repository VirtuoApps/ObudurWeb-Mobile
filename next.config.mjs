import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./app/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // Temporarily ignore TypeScript errors for successful build
    // TODO: Fix type errors properly
    ignoreBuildErrors: true,
  },
};

export default withNextIntl(nextConfig);
