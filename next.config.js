/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['storage.googleapis.com','imageio.forbes.com','www.reuters.com']
  }
}

module.exports = nextConfig
