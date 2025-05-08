'use client'
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from '@heroui/navbar'
import { Link } from '@heroui/link'
import { link as linkStyles } from '@heroui/theme'
import clsx from 'clsx'
import { siteConfig } from '@/config/site'
import { ThemeSwitch } from '@/components/ThemeSwitch'
import NextLink from 'next/link'
import { title } from './primitives'
import { Button, Tab, Tabs } from '@heroui/react'
import { usePathname } from 'next/navigation'

export const Navbar = () => {
  const pathname = usePathname()
  const isBorrow = pathname.startsWith('/borrow')
  const isLend = pathname.startsWith('/lend')
  const isMainApp = isBorrow || isLend

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 gap-12 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="max-w-fit gap-3">
          <NextLink className="flex items-center justify-start gap-1" href="/">
            <span>
              <span className={title({ className: '!text-2xl text-primary' })}>
                Bit
              </span>
              <span
                className={title({
                  className: '!text-2xl text-secondary dark:text-foreground',
                })}
              >
                More
              </span>
            </span>
          </NextLink>
        </NavbarBrand>

        <ul className="ml-2 hidden justify-start gap-8 lg:flex">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:font-medium data-[active=true]:text-primary'
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden basis-1/5 lg:flex lg:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden gap-2 sm:flex">
          <ThemeSwitch />
        </NavbarItem>

        <NavbarItem className="hidden gap-2 sm:flex">
          <NavbarMenuActions isMainApp={isMainApp} isLend={isLend} />
        </NavbarItem>
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarContent className="basis-1 gap-2 pl-4 lg:hidden" justify="end">
        <ThemeSwitch />

        <NavbarItem>
          <NavbarMenuActions isMainApp={isMainApp} isMobile isLend={isLend} />
        </NavbarItem>

        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link color="foreground" as={NextLink} href={item.href} size="lg">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  )
}

type NavbarMenuItemProps = {
  isMainApp: boolean
  isMobile?: boolean
  isLend?: boolean
}

const NavbarMenuActions = ({
  isMainApp,
  isMobile,
  isLend,
}: NavbarMenuItemProps) => {
  return isMainApp ? (
    <Tabs
      variant="bordered"
      color={isLend ? 'secondary' : 'primary'}
      selectedKey={isLend ? 'lend' : 'borrow'}
      className="font-semibold"
      {...(isMobile && { size: 'sm' })}
    >
      <Tab key="borrow" title="Borrow" as={NextLink} href="/borrow" />
      <Tab key="lend" title="Lend" as={NextLink} href="/lend" />
    </Tabs>
  ) : (
    <Button
      as={NextLink}
      href="/borrow"
      color="primary"
      variant="shadow"
      className="font-medium"
      {...(isMobile && { size: 'sm' })}
    >
      Enter App
    </Button>
  )
}
