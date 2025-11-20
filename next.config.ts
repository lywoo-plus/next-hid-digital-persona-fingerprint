import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@digitalpersona/devices'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = {
        ...config.externals,
        WebSdk: 'WebSdk',
      }
    }
    return config
  },
}

export default nextConfig
