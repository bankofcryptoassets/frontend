export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'Bitmor',
  description:
    'Buy Bitcoin with 80% Financing. Earn Yield Backed by Real Demand.',
  navItems: [
    {
      label: 'Loan Calculator',
      href: '/#calc',
    },
    {
      label: 'Why Own Bitcoin',
      href: '/#why',
    },
    {
      label: 'For Lenders',
      href: '/#lenders',
    },
    {
      label: 'Team',
      href: '/#team',
    },
    {
      label: 'FAQs',
      href: '/#faqs',
    },
  ],
  navItemMainApp: [
    {
      label: 'Borrow $BTC',
      href: '/borrow',
    },
    {
      label: 'Invest',
      href: '/invest',
    },
    {
      label: 'My Portfolio',
      href: '/portfolio',
    },
    {
      label: 'Analytics',
      href: '/analytics',
    },
  ],
}
