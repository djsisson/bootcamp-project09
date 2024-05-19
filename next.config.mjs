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
  async redirects() {
    return [
      {
        source: "/user/:userid",
        destination: "/user/:userid/posts",
        permanent: true,
      },
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
