import { ReactNode } from 'react'
import { isAuthAction } from '../auth/actions'
import { headers } from 'next/headers'
import { cookieToInitialState } from 'wagmi'
import { RainbowKitProvider, wagmiConfig } from './RainbowKitProvider'
import { ThemeProviders } from './ThemeProvider'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import Script from 'next/script'

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
          <Script id="hotjar-script">{`
            (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:6466125,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}</Script>
        </>
      )}
      <RainbowKitProvider initialState={initialState} isAuth={isAuth}>
        {children}
      </RainbowKitProvider>
    </ThemeProviders>
  )
}
