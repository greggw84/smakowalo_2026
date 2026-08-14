import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'smakowalo.pl' }],
        destination: 'https://www.smakowalo.pl/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
