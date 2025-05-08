import '@/styles/globals.css'
import { Metadata, Viewport } from 'next'
import { siteConfig } from '@/config/site'
import { fontMono, fontSans } from '@/config/fonts'
import { Navbar } from '@/components/navbar'
import { Providers } from '@/Providers'
import { cn } from '@heroui/react'

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
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontMono.variable
        )}
      >
        <Providers
          themeProps={{
            attribute: 'class',
            defaultTheme: 'system',
            enableSystem: true,
            enableColorScheme: true,
          }}
        >
          <div className="relative flex h-screen flex-col">
            <Navbar />

            {children}

            {/* <footer className="flex w-full items-center justify-center py-3">
              <Link
                isExternal
                className="flex items-center gap-1 text-current"
                href="https://heroui.com?utm_source=next-app-template"
                title="heroui.com homepage"
              >
                <span className="text-default-600">Powered by</span>
                <p className="text-primary">HeroUI</p>
              </Link>
            </footer> */}
          </div>
        </Providers>
      </body>
    </html>
  )
}
