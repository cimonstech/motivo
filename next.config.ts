import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  // Avoid webpack cache corruption on Windows (ENOENT on .pack.gz)
  webpack: (config, { dev }) => {
    if (dev) config.cache = false;
    return config;
  },
  // async redirects() {
  //   return [
  //     {
  //       source:      "/:path*",
  //       has:         [{ type: "host", value: "www.thisismotivo.com" }],
  //       destination: "https://thisismotivo.com/:path*",
  //       permanent:   true,
  //     },
  //   ];
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.thisismotivo.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.motivo.studio",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-e83f37e9c380439780bb41381bcd80d5.r2.dev",
        pathname: "/**",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
