/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',  // Enable static exports
    images: {
      unoptimized: true,  // Required for static export
    },
    basePath: '/n0xlite.github.io',  // Replace with your repository name
  }
  
  module.exports = nextConfig