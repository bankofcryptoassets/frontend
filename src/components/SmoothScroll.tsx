'use client'
import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export const SmoothScroll = () => {
  const lenis = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (lenis.current) lenis.current!.scrollTo(0, { immediate: true })
  }, [pathname, lenis])

  useEffect(() => {
    const lenis = new Lenis()

    const raf = (time: number) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return <></>
}
