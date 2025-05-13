'use client'
import { HeroUIProvider } from '@heroui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from 'next-themes'
import { useRouter } from 'next/navigation'

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>['push']>[1]
    >
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

type ProvidersProps = {
  children: React.ReactNode
  themeProps?: ThemeProviderProps
}

export const Providers = ({ children, themeProps }: ProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  )
}
