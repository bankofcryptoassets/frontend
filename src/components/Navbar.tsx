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
import { cn, link as linkStyles } from '@heroui/theme'
import clsx from 'clsx'
import { siteConfig } from '@/config/site'
import { ThemeSwitch } from '@/components/ThemeSwitch'
import NextLink from 'next/link'
import { Button, Divider } from '@heroui/react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { useAuth } from '@/auth/useAuth'
import { CONTRACT_ADDRESSES } from '@/utils/constants'
import { useAccount, useBalance } from 'wagmi'
import numeral from 'numeral'
import { GetBalanceData } from 'wagmi/query'
import Big from 'big.js'

const HIDE_NAVBAR_PATHS = ['/connect-telegram']

export const Logo = () => {
  return (
    <>
      <span className="text-primary inline text-3xl leading-none font-bold tracking-tight">
        Bit
      </span>
      <span className="text-secondary dark:text-foreground inline text-3xl leading-none font-bold tracking-tight">
        mor
      </span>
    </>
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

  const isNavbarHidden = HIDE_NAVBAR_PATHS.some((path) =>
    pathname.startsWith(path)
  )

  if (isNavbarHidden) return null

  return (
    <HeroUINavbar
      classNames={{
        wrapper: 'container!',
        base: isMainApp && 'bg-transparent! backdrop-saturate-100',
      }}
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      height="6rem"
    >
      <NavbarContent
        className="basis-1/5 gap-12 max-xl:gap-8 sm:basis-full"
        justify="start"
      >
        <NavbarBrand as="li" className="max-w-fit" onClick={onMenuItemClick}>
          <NextLink href="/">
            <Logo />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="basis-1/5 gap-12 max-xl:gap-8 sm:basis-full"
        justify="center"
      >
        <ul className="ml-2 hidden justify-start gap-8 max-xl:gap-6 lg:flex">
          {siteConfig[isMainApp ? 'navItemMainApp' : 'navItems'].map((item) => (
            <NavbarItem
              key={item.href}
              isActive={pathname.startsWith(item.href)}
            >
              <NextLink
                className={cn(
                  linkStyles({ color: 'foreground' }),
                  '!text-default-800 font-normal',
                  'data-[active=true]:!text-default-900 data-[active=true]:font-medium'
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
              <SatsBalance btcBalance={btcBalance} />
            </NavbarItem>

            <NavbarItem className="hidden gap-2 sm:flex">
              <Divider orientation="vertical" className="bg-default-300 h-10" />
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
              className="h-11 font-bold"
              onPress={onMenuItemClick}
              size="lg"
            >
              Launch App
            </Button>
          </NavbarItem>
        )}

        {isMainApp && (
          <NavbarItem className="hidden gap-2 sm:flex">
            <CustomConnectButton />
          </NavbarItem>
        )}
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarContent className="basis-1 gap-2 pl-4 lg:hidden" justify="end">
        <ThemeSwitch />
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
                    '!text-default-700 font-normal',
                    'data-[active=true]:!text-default-900 data-[active=true]:font-medium'
                  )}
                  data-active={pathname.startsWith(item.href)}
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            )
          )}

          {isMainApp ? (
            <div className="mt-6 flex flex-col gap-4">
              {isAuth && <SatsBalance btcBalance={btcBalance} />}

              <CustomConnectButton />
            </div>
          ) : (
            <Button
              as={NextLink}
              href="/borrow"
              color="primary"
              variant="shadow"
              className="mt-4 font-bold"
              onPress={onMenuItemClick}
            >
              Try Bitmor (Testnet)
            </Button>
          )}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  )
}

export const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')

        return (
          <>
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onPress={openConnectModal}
                    color="primary"
                    variant="shadow"
                    className="h-11 font-bold"
                    size="lg"
                  >
                    Connect Wallet
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onPress={openChainModal}
                    color="primary"
                    variant="shadow"
                    className="h-11 font-bold"
                    size="lg"
                  >
                    Wrong network
                  </Button>
                )
              }

              return (
                <Button
                  onPress={openAccountModal}
                  color="primary"
                  variant="shadow"
                  className="h-11 font-bold"
                  size="lg"
                >
                  {!!account.ensAvatar && (
                    <Image
                      src={account.ensAvatar}
                      alt="ENS Avatar"
                      width={24}
                      height={24}
                    />
                  )}
                  {account.displayName}
                </Button>
              )
            })()}
          </>
        )
      }}
    </ConnectButton.Custom>
  )
}

export const SatsBalance = ({
  btcBalance,
}: {
  btcBalance?: GetBalanceData
}) => {
  if (!btcBalance) return null

  const isTooManySats = Big(Number(btcBalance?.value || 0)).gte(1_000_000)
  const symbol = isTooManySats ? 'BTC' : 'sats'
  const value = isTooManySats ? btcBalance?.formatted : btcBalance?.value

  return (
    <Button
      color="primary"
      variant="bordered"
      className="border-default-300 h-11"
      size="lg"
    >
      <Image src="/icons/btc.svg" alt="BTC" width={16} height={16} />
      <span className="font-medium">
        {numeral(value).format('0,0.[00]')} {symbol}
      </span>
    </Button>
  )
}
