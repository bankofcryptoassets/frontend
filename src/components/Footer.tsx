'use client'
import { cn, Link as StyledLink } from '@heroui/react'
import { Logo } from './Navbar'
import Link from 'next/link'
import { FaXTwitter } from 'react-icons/fa6'
import { FaGithub, FaTelegramPlane } from 'react-icons/fa'

const MENU_ITEMS = [
  {
    title: 'PRODUCTS',
    links: [
      { text: 'Borrowing', url: '/borrow' },
      { text: 'Lending', url: '/invest' },
      { text: 'Pricing', url: '' },
      { text: 'API', url: '' },
    ],
  },
  {
    title: 'RESOURCES',
    links: [
      { text: 'Documentation', url: '' },
      { text: 'Guides', url: '' },
      { text: 'Blog', url: '' },
      { text: 'Support', url: '' },
    ],
  },
  {
    title: 'COMPANY',
    links: [
      { text: 'Team', url: '/#team' },
      { text: 'About', url: '' },
      { text: 'Careers', url: '' },
      { text: 'Contact', url: '' },
    ],
  },
]

const BOTTOM_LINKS = [
  { text: 'Privacy Policy', url: '' },
  { text: 'Terms of Service', url: '' },
  { text: 'Legal', url: '' },
]

const SOCIAL_LINKS = [
  {
    name: 'x',
    href: 'https://x.com/bitmor_btc',
    icon: <FaXTwitter size={24} />,
    colors: 'hover:bg-default-900 hover:text-default-50',
  },
  {
    name: 'telegram',
    href: 'https://t.me/+Q55V_D-mhmViMzk1',
    icon: <FaTelegramPlane size={24} />,
    colors: 'hover:bg-white dark:hover:bg-default-900 hover:text-[#24A1DE]',
  },
  {
    name: 'github',
    href: 'https://github.com/bankofcryptoassets',
    icon: <FaGithub size={24} />,
    colors: 'hover:bg-default-900 hover:text-default-50',
  },
]

export const Footer = () => {
  return (
    <footer className="relative z-0 py-8" id="footer">
      <div className="pointer-events-none absolute inset-2 top-0 -z-[1] select-none overflow-hidden rounded-xl border-2 border-default-200 bg-default-100"></div>

      <div className="container text-default-800">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          <div className="col-span-2 mb-8 lg:mb-0">
            <Logo />
            <p className="mt-2 text-sm font-medium">
              Revolutionizing BTC Ownership
            </p>

            <div className="mt-4 flex flex-wrap gap-4 lg:mt-14">
              {SOCIAL_LINKS.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'rounded-full p-1.5 text-sm text-default-800 transition-colors',
                    social.colors
                  )}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {MENU_ITEMS.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h3 className="mb-3 text-sm font-bold text-default-900">
                {section.title}
              </h3>

              <ul className="space-y-1.5">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx} className="">
                    <StyledLink
                      as={Link}
                      href={link.url}
                      className="text-default-800 hover:text-primary"
                      underline="hover"
                      size="sm"
                      isDisabled={!link.url}
                    >
                      {link.text}
                    </StyledLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-default/50 pt-6 text-sm md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Bitmor. All rights reserved.</p>
          <ul className="flex gap-4">
            {BOTTOM_LINKS.map((link, linkIdx) => (
              <li key={linkIdx}>
                <StyledLink
                  as={Link}
                  href={link.url}
                  className="text-default-800 hover:text-primary"
                  underline="hover"
                  size="sm"
                  isDisabled={!link.url}
                >
                  {link.text}
                </StyledLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
