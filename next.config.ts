import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // TODO: Uncomment this when we have a use case for it
  // serverExternalPackages: ['@xmtp/user-preferences-bindings-wasm'],
  // webpack: (config) => {
  //   config.externals.push('pino-pretty', 'lokijs', 'encoding')
  //   return config
  // },
}

export default nextConfig
