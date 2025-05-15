'use client'
import { HeroUIProvider } from '@heroui/react'
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from 'next-themes'

type Props = {
  children: React.ReactNode
  themeProps?: ThemeProviderProps
}

export const ThemeProviders = ({ children, themeProps }: Props) => {
  return (
    <HeroUIProvider>
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </HeroUIProvider>
  )
}
