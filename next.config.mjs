/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**", // Match all paths on this domain
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "**", // Match all paths on this domain
      },
    ],
  },
};

export default nextConfig;
