'use client'
import React, { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  darkTheme,
  lightTheme,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider as NextRainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import {
  http,
  WagmiProvider,
  createConfig,
  createStorage,
  cookieStorage,
  State,
} from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { useTheme } from 'next-themes'
import { authenticationAdapter } from '../auth/adapter'
import { WalletAddressTracker } from '@/auth/WalletAddressTracker'

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>['push']>[1]
    >
  }
}

export const wagmiConfig = createConfig({
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
  chains: [baseSepolia],
  transports: { [baseSepolia.id]: http() },
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

type Props = {
  children: React.ReactNode
  initialState: State | undefined
  isAuth: boolean
}

const themeOptions = {
  accentColor: 'hsl(var(--heroui-primary))',
  accentColorForeground: 'hsl(var(--heroui-primary-foreground))',
  overlayBlur: 'small',
} as const

export const RainbowKitProvider = ({
  children,
  initialState,
  isAuth,
}: Props) => {
  const { resolvedTheme } = useTheme()
  const status = isAuth ? 'authenticated' : 'unauthenticated'

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const theme =
    mounted && resolvedTheme === 'dark'
      ? darkTheme(themeOptions)
      : lightTheme(themeOptions)

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitAuthenticationProvider
          adapter={authenticationAdapter}
          status={status}
        >
          <NextRainbowKitProvider
            coolMode
            modalSize="compact"
            appInfo={{ appName: 'BitMore' }}
            theme={theme}
          >
            <WalletAddressTracker />
            {children}
          </NextRainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
