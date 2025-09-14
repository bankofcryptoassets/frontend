'use client'
import { cn } from '@heroui/react'
import { usePathname } from 'next/navigation'

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isInvestPages = pathname.startsWith('/invest')

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-0 h-full w-full bg-[linear-gradient(130.72deg,_rgba(247,_147,_26,_0.12)_1.6%,_rgba(251,_204,_146,_0.08)_25.22%,_rgba(255,_255,_255,_0.04)_48.84%,_rgba(255,_255,_255,_0.08)_82.53%)]',
          // TODO: add transition for the background change
          isInvestPages &&
            'bg-[linear-gradient(130.72deg,_rgba(16,_121,_218,_0.12)_1.6%,_rgba(141,_191,_237,_0.08)_25.22%,_rgba(255,_255,_255,_0.04)_48.84%,_rgba(255,_255,_255,_0.08)_82.53%)]'
        )}
      />
      {children}
    </>
  )
}
