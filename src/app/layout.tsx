import '@/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { Metadata, Viewport } from 'next'
import { siteConfig } from '@/config/site'
import { fontMono, fontSans } from '@/config/fonts'
import { Navbar } from '@/components/Navbar'
import { Providers } from '@/Providers'
import { cn } from '@heroui/react'

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s - ${siteConfig.name}` },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon-16x16.png',
      },
    ],
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
          'bg-background min-h-screen font-sans antialiased',
          fontSans.variable,
          fontMono.variable
        )}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <div className="w-full overflow-x-hidden">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
