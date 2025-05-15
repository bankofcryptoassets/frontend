'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import '@rainbow-me/rainbowkit/styles.css'
import {
  darkTheme,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { http, WagmiProvider, createConfig } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { useTheme } from 'next-themes'

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>['push']>[1]
    >
  }
}

const config = createConfig({
  ssr: true,
  // storage: createStorage({ storage: cookieStorage }),
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
}

const themeOptions = {
  accentColor: 'hsl(var(--heroui-primary))',
  accentColorForeground: 'hsl(var(--heroui-primary-foreground))',
  overlayBlur: 'small',
} as const

export const Providers = ({ children }: Props) => {
  const { resolvedTheme } = useTheme()

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          coolMode
          appInfo={{ appName: 'BitMore' }}
          modalSize="compact"
          theme={
            resolvedTheme === 'dark'
              ? darkTheme(themeOptions)
              : lightTheme(themeOptions)
          }
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
