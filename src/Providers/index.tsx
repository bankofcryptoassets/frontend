import { ReactNode } from 'react'
import { isAuthAction } from '../auth/actions'
import { headers } from 'next/headers'
import { cookieToInitialState } from 'wagmi'
import { RainbowKitProvider, wagmiConfig } from './RainbowKitProvider'
import { ThemeProviders } from './ThemeProvider'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'

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
      {process.env.NODE_ENV !== 'development' && (
        <>
          <GoogleAnalytics gaId="G-SXH80TEHZY" />
          <GoogleTagManager gtmId="G-SXH80TEHZY" />
        </>
      )}
      <RainbowKitProvider initialState={initialState} isAuth={isAuth}>
        {children}
      </RainbowKitProvider>
    </ThemeProviders>
  )
}
