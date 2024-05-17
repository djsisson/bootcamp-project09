/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.clerk.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
