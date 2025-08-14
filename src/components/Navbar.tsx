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
import { siteConfig } from '@/config/site'
import { ThemeSwitch } from '@/components/ThemeSwitch'
import NextLink from 'next/link'
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Accordion,
  AccordionItem,
} from '@heroui/react'
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
import { ChevronDown } from 'lucide-react'

const HIDE_NAVBAR_PATHS = ['/connect-telegram']

export const Logo = () => {
  return (
    <>
      <span className="text-primary inline text-3xl leading-[1] font-bold tracking-tight max-lg:text-2xl">
        Bit
      </span>
      <span className="text-secondary dark:text-foreground inline text-3xl leading-[1] font-bold tracking-tight max-lg:text-2xl">
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
        wrapper: 'container! h-24 max-lg:h-16',
        base:
          isMainApp &&
          !isMenuOpen &&
          'bg-transparent! backdrop-saturate-100 transition-[background-color,backdrop-filter]',
      }}
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
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
          {siteConfig[isMainApp ? 'navItemMainApp' : 'navItems'].map((item) =>
            item?.children?.length ? (
              <Dropdown key={item.id}>
                <NavbarItem>
                  <DropdownTrigger>
                    <button
                      className={cn(
                        linkStyles({ color: 'foreground' }),
                        'text-default-800 group aria-[expanded=true]:text-primary hover:text-primary group flex cursor-pointer items-center gap-2 font-normal transition-colors aria-[expanded=true]:font-medium'
                      )}
                    >
                      <span className="group-animate-underline">
                        {item.label}
                      </span>
                      <ChevronDown className="size-4 transition-transform group-aria-[expanded=true]:rotate-180" />
                    </button>
                  </DropdownTrigger>
                </NavbarItem>
                <DropdownMenu aria-label={item.label}>
                  {item.children.map((child) => (
                    <DropdownItem
                      key={child.id}
                      as={NextLink}
                      href={child.href}
                      className="group hover:bg-transparent!"
                      classNames={{
                        title: cn(
                          linkStyles({ color: 'foreground' }),
                          'text-default-800 group overflow-visible flex-0 group-hover:text-primary group-animate-underline flex cursor-pointer items-center gap-2 font-normal transition-colors'
                        ),
                      }}
                    >
                      {child.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            ) : (
              <NavbarItem
                key={item.id}
                isActive={!!item.href && pathname.startsWith(item.href)}
              >
                <NextLink
                  className={cn(
                    linkStyles({ color: 'foreground' }),
                    'text-default-800 data-[active=true]:text-primary hover:text-primary animate-underline font-normal transition-colors data-[active=true]:font-medium'
                  )}
                  color="foreground"
                  href={item.href}
                  data-active={!!item.href && pathname.startsWith(item.href)}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            )
          )}
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
          {siteConfig[isMainApp ? 'navItemMainApp' : 'navItems'].map((item) =>
            item.children?.length ? (
              <Accordion key={item.id} className="w-full px-0!">
                <AccordionItem
                  title={item.label}
                  classNames={{
                    trigger: 'p-0! group',
                    title: cn(
                      linkStyles({ color: 'foreground' }),
                      'text-default-800 font-normal data-[active=true]:text-primary group-hover:text-primary group-animate-underline transition-colors data-[active=true]:font-medium text-lg w-fit'
                    ),
                    indicator: 'text-default-700',
                  }}
                >
                  <div className="flex flex-col gap-2 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        color="foreground"
                        as={NextLink}
                        href={child.href}
                        size="lg"
                        onClick={onMenuItemClick}
                        className="text-default-800 data-[active=true]:text-primary hover:text-primary group font-normal transition-colors data-[active=true]:font-medium"
                        data-active={
                          !!child.href && pathname.startsWith(child.href)
                        }
                      >
                        <span className="group-animate-underline">
                          {child.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </AccordionItem>
              </Accordion>
            ) : (
              <NavbarMenuItem key={item.id}>
                <Link
                  color="foreground"
                  as={NextLink}
                  href={item.href}
                  size="lg"
                  onClick={onMenuItemClick}
                  className="text-default-800 group data-[active=true]:text-primary hover:text-primary animate-underline font-normal transition-colors data-[active=true]:font-medium"
                  data-active={!!item.href && pathname.startsWith(item.href)}
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
              Launch App
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
