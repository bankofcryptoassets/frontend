export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'Bitmor',
  description:
    'Buy Bitcoin with 80% Financing. Earn Yield Backed by Real Demand.',
  navItems: [
    {
      id: 'products',
      label: 'Products',
      href: '',
      children: [
        { id: 'bitcoin-loan', label: 'Bitcoin Loan', href: '/borrow' },
        {
          id: 'bitcoin-dca',
          label: 'Bitcoin DCA',
          href: 'https://dca.bitmor.xyz',
        },
      ],
    },
    {
      id: 'resources',
      label: 'Resources',
      href: '',
      children: [
        {
          id: 'ownership-calculator',
          label: 'Ownership Calculator',
          href: '/#ownership-calculator',
        },
        {
          id: 'loan-vs-dca-calculator',
          label: 'Loan vs DCA Calculator',
          href: '/analytics',
        },
        { id: 'whitepaper', label: 'Whitepaper (Coming Soon)', href: '' },
      ],
    },
    { id: 'about', label: 'About', href: '/#about', children: [] },
  ],
  navItemMainApp: [
    { id: 'borrow', label: 'Borrow $BTC', href: '/borrow', children: [] },
    { id: 'invest', label: 'Invest', href: '/invest', children: [] },
    {
      id: 'portfolio',
      label: 'My Portfolio',
      href: '/portfolio',
      children: [],
    },
    {
      id: 'analytics',
      label: 'Loan vs DCA Calculator',
      href: '/analytics',
      children: [],
    },
  ],
}
