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
import { Button, Divider } from '@heroui/react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { useAuth } from '@/auth/useAuth'
import { CONTRACT_ADDRESSES } from '@/utils/constants'
import { useAccount, useBalance } from 'wagmi'
import numeral from 'numeral'

export const Logo = () => {
  return (
    <NextLink href="/">
      <span className={title({ className: '!text-2xl text-primary' })}>
        Bit
      </span>
      <span
        className={title({
          className: '!text-2xl text-secondary dark:text-foreground',
        })}
      >
        mor
      </span>
    </NextLink>
  )
}

export const Navbar = () => {
  const pathname = usePathname()
  const isMainApp = pathname !== '/'
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuth } = useAuth()
  const { address } = useAccount()
  const { data: btcBalance } = useBalance({
    address,
    token: CONTRACT_ADDRESSES.BTC,
    query: { enabled: !!address && !!isAuth },
  })

  const onMenuItemClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <HeroUINavbar
      classNames={{
        wrapper: '!container',
      }}
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      height="4.5rem"
    >
      <NavbarContent
        className="basis-1/5 gap-12 max-xl:gap-8 sm:basis-full"
        justify="start"
      >
        <NavbarBrand as="li" className="max-w-fit" onClick={onMenuItemClick}>
          <Logo />
        </NavbarBrand>

        <ul className="ml-2 hidden justify-start gap-8 max-xl:gap-6 lg:flex">
          {siteConfig[isMainApp ? 'navItemMainApp' : 'navItems'].map((item) => (
            <NavbarItem
              key={item.href}
              isActive={pathname.startsWith(item.href)}
            >
              <NextLink
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'font-normal !text-default-700',
                  'data-[active=true]:font-medium data-[active=true]:!text-default-900'
                )}
                color="foreground"
                href={item.href}
                data-active={pathname.startsWith(item.href)}
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
        {isMainApp && isAuth && (
          <>
            <NavbarItem className="hidden gap-2 sm:flex">
              <Button
                color="primary"
                variant="bordered"
                className="border-default-300"
              >
                <Image src="/icons/btc.svg" alt="BTC" width={16} height={16} />
                <span className="text-base font-medium">
                  {numeral(btcBalance?.value ?? 0).format('0,0')} sats
                </span>
              </Button>
            </NavbarItem>

            <NavbarItem className="hidden gap-2 sm:flex">
              <Divider orientation="vertical" className="h-10 bg-default-300" />
            </NavbarItem>
          </>
        )}

        <NavbarItem className="hidden gap-2 sm:flex">
          <ThemeSwitch />
        </NavbarItem>

        {!isMainApp && (
          <NavbarItem className="hidden gap-2 sm:flex">
            <Button
              as={NextLink}
              href="/borrow"
              color="primary"
              variant="shadow"
              className="font-medium"
              onPress={onMenuItemClick}
            >
              Enter App
            </Button>
          </NavbarItem>
        )}

        {isMainApp && (
          <NavbarItem className="hidden gap-2 sm:flex [&>div>button]:!font-sans [&>div>button]:!text-sm [&>div>button]:!font-medium [&>div>button_*]:!font-sans [&>div>button_*]:!text-sm [&>div>button_*]:!font-medium">
            <ConnectButton
              accountStatus="full"
              showBalance={false}
              chainStatus="none"
            />
          </NavbarItem>
        )}
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarContent className="basis-1 gap-2 pl-4 lg:hidden" justify="end">
        <ThemeSwitch />

        <NavbarItem>
          {!isMainApp && (
            <Button
              as={NextLink}
              href="/borrow"
              color="primary"
              variant="shadow"
              className="font-medium"
              onPress={onMenuItemClick}
              size="sm"
            >
              Enter App
            </Button>
          )}
        </NavbarItem>

        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig[isMainApp ? 'navItemMainApp' : 'navItems'].map(
            (item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  color="foreground"
                  as={NextLink}
                  href={item.href}
                  size="lg"
                  onClick={onMenuItemClick}
                  className={clsx(
                    'font-normal !text-default-700',
                    'data-[active=true]:font-medium data-[active=true]:!text-default-900'
                  )}
                  data-active={pathname.startsWith(item.href)}
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            )
          )}

          {isMainApp && (
            <div className="mt-6 flex flex-col gap-4">
              {isAuth && (
                <Button
                  color="primary"
                  variant="bordered"
                  className="border-default-300"
                >
                  <Image
                    src="/icons/btc.svg"
                    alt="BTC"
                    width={16}
                    height={16}
                  />
                  <span className="font-medium">
                    {numeral(btcBalance?.value ?? 0).format('0,0')} sats
                  </span>
                </Button>
              )}

              <Button className="p-0 [&>div>button]:!h-full [&>div>button]:!w-full [&>div>button]:!font-sans [&>div>button]:!text-sm [&>div>button]:!font-semibold [&>div]:!h-full [&>div]:!w-full [&_*]:!flex [&_*]:!items-center [&_*]:!justify-center [&_*]:!gap-2 [&_[style='height:_24px;_width:_24px;']]:overflow-hidden [&_[style='height:_24px;_width:_24px;']]:!rounded-full">
                <ConnectButton
                  accountStatus="avatar"
                  showBalance={false}
                  chainStatus="none"
                />
              </Button>
            </div>
          )}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  )
}
