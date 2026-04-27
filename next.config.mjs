/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/api/og': ['./node_modules/@fontsource/inter/files/inter-latin-400-normal.woff', './node_modules/@fontsource/inter/files/inter-latin-700-normal.woff'],
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals ?? []), 'sharp']
    }
    return config
  },
}

export default nextConfig
