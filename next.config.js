/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
}

module.exports = nextConfig

// Esto le dice a Next que use el middleware para todo lo que esté bajo /dashboard
module.exports.middleware = {
  matcher: ['/dashboard/:path*'],
}
