'use client'
import { cn, Link as StyledLink } from '@heroui/react'
import { Logo } from './Navbar'
import Link from 'next/link'
import { FaXTwitter } from 'react-icons/fa6'
import { FaGithub, FaTelegramPlane } from 'react-icons/fa'
import InlineSVG from 'react-inlinesvg'

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
    <footer className="relative z-0" id="footer">
      <div className="text-default-800 container pb-10 max-lg:pb-6">
        <div className="flex justify-between gap-8 max-lg:flex-col">
          <div>
            <Logo />
            <p className="mt-2 text-sm font-medium">
              Revolutionizing BTC Ownership
            </p>

            <div className="mt-4 flex flex-wrap gap-4 lg:mt-10">
              {SOCIAL_LINKS.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'text-default-800 rounded-full p-1.5 text-sm transition-colors',
                    social.colors
                  )}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-30 max-lg:justify-between max-lg:gap-10">
            {MENU_ITEMS.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="text-default-900 mb-3 text-sm font-bold">
                  {section.title}
                </h3>

                <ul className="space-y-1.5">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx} className="">
                      <StyledLink
                        as={Link}
                        href={link.url}
                        className="text-default-800 animate-underline hover:text-primary transition-colors"
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
        </div>

        <div className="border-default/50 mt-10 flex flex-col-reverse justify-between gap-4 border-t pt-10 text-sm max-lg:mt-6 max-lg:pt-6 lg:flex-row lg:items-center">
          <p className="text-default-a">
            © {new Date().getFullYear()} Bitmor. All rights reserved.
          </p>
          <ul className="flex gap-6">
            {BOTTOM_LINKS.map((link, linkIdx) => (
              <li key={linkIdx}>
                <StyledLink
                  as={Link}
                  href={link.url}
                  className="text-default-800 hover:text-primary animate-underline transition-colors"
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

      <div className="w-full px-8 pb-3 max-lg:px-4">
        <InlineSVG
          src="/extras/bitmor-footer.svg"
          className="h-full w-full stroke-[0.1] max-lg:stroke-[0.2]"
        />
      </div>
    </footer>
  )
}
