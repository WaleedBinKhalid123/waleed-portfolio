import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Company, university and certification logos hosted elsewhere must have
     * their host allow-listed here before `next/image` will load them. Local
     * files under `public/` need no configuration.
     *
     * remotePatterns: [
     *   { protocol: "https", hostname: "logo.example.com", pathname: "/**" },
     * ],
     */
    remotePatterns: [],
  },
  allowedDevOrigins: ['10.3.1.188'],

  // No need to advertise the framework in every response header.
  poweredByHeader: false,
};

export default nextConfig;
