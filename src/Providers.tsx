'use client'
import { HeroUIProvider } from '@heroui/react'
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

type ProvidersProps = {
  children: React.ReactNode
  themeProps?: ThemeProviderProps
}

export const Providers = ({ children, themeProps }: ProvidersProps) => {
  return (
    <HeroUIProvider>
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </HeroUIProvider>
  )
}
