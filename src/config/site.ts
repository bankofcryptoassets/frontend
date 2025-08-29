import { SetSelected } from '@/hooks/useCalculatorTabs'
import { DCA_MINI_APP_URL } from '@/utils/constants'

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
        { id: 'bitcoin-dca', label: 'Bitcoin DCA', href: DCA_MINI_APP_URL },
      ],
    },
    {
      id: 'resources',
      label: 'Resources',
      href: '',
      children: [
        {
          id: 'loan-calculator',
          label: 'Loan Calculator',
          href: '/#calculators',
          handleClick: (setSelected: SetSelected) => setSelected('loan'),
        },
        {
          id: 'dca-calculator',
          label: 'DCA Calculator',
          href: '/#calculators',
          handleClick: (setSelected: SetSelected) => setSelected('dca'),
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
