/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    domains: ["avatars.githubusercontent.com"],
  },
};

module.exports = nextConfig;
