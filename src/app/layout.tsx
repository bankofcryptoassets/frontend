import '@/styles/globals.css'
import { Metadata, Viewport } from 'next'
import { siteConfig } from '@/config/site'
import { fontMono, fontSans } from '@/config/fonts'
import { Navbar } from '@/components/Navbar'
import { Providers } from '@/Providers'
import { cn } from '@heroui/react'
import { ThemeProviders } from '@/ThemeProvider'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning lang="en" className="scroll-smooth">
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontMono.variable
        )}
      >
        <ThemeProviders
          themeProps={{
            attribute: 'class',
            defaultTheme: 'system',
            enableSystem: true,
            enableColorScheme: true,
          }}
        >
          <Providers>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              {children}
            </div>
          </Providers>
        </ThemeProviders>
      </body>
    </html>
  )
}
