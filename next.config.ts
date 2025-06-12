import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Enable WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    }

    // Handle WASM files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/wasm/[name][ext]',
      },
    })

    return config
  },
  // experimental: {
  //   turbo: {
  //     rules: {
  //       // Configure WASM handling
  //       '*.wasm': ['asset/resource'],
  //     },
  //   },
  // },
}

export default nextConfig
