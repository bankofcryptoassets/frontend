'use client'
import { HeroUIProvider } from '@heroui/react'
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from 'next-themes'
import { Toaster } from 'sonner'

type Props = {
  children: React.ReactNode
  themeProps?: ThemeProviderProps
}

export const ThemeProviders = ({ children, themeProps }: Props) => {
  return (
    <HeroUIProvider>
      <Toaster richColors position="top-right" />
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </HeroUIProvider>
  )
}
