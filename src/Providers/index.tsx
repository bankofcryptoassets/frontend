import { ReactNode } from 'react'
import { isAuthAction } from '../auth/actions'
import { headers } from 'next/headers'
import { cookieToInitialState } from 'wagmi'
import { RainbowKitProvider, wagmiConfig } from './RainbowKitProvider'
import { ThemeProviders } from './ThemeProvider'

export const Providers = async ({ children }: { children: ReactNode }) => {
  const { isAuth } = await isAuthAction()
  const headersStore = await headers()
  const cookie = headersStore.get('cookie')
  const initialState = cookieToInitialState(wagmiConfig, cookie)

  return (
    <ThemeProviders
      themeProps={{
        attribute: 'class',
        defaultTheme: 'system',
        enableSystem: true,
        enableColorScheme: true,
      }}
    >
      <RainbowKitProvider initialState={initialState} isAuth={isAuth}>
        {children}
      </RainbowKitProvider>
    </ThemeProviders>
  )
}
