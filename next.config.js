/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // Add PWA configuration
  reactStrictMode: true,
  poweredByHeader: false,
  // Disable automatic static optimization for PWA pages
  // to ensure consistent behavior with service worker
  trailingSlash: false,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  // This ensures NextJS doesn't interfere with our custom service worker
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Only in production builds
    if (!dev && !isServer) {
      // Ensure our service worker isn't overwritten by NextJS
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NEXT_PUBLIC_BUILD_ID': JSON.stringify(buildId),
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig; 