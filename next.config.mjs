/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.mediaworks.nz",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images-test.mediaworks.nz",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "is1-ssl.mzstatic.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
