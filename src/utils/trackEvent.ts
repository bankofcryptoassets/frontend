export const trackEvent = (event: string, data?: Record<string, any>) => {
  try {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function')
      return
    window.gtag('event', event, data)
  } catch {}
}
