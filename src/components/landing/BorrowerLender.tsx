'use client'
import { Button, cn, Tab, Tabs } from '@heroui/react'
import { Glow } from './Glow'
import { BorrowersCalculator } from './BorrowersCalculator'
import Link from 'next/link'
import InlineSVG from 'react-inlinesvg'
import { BiSolidWallet } from 'react-icons/bi'
import { GoGoal } from 'react-icons/go'
import { LendingChart } from './LendingChart'
import { useState } from 'react'

export const BorrowerLender = () => {
  const [selected, setSelected] = useState('borrower')

  return (
    <section
      className="relative container mb-50 max-w-[1360px] max-lg:mb-30 min-[87.5rem]:px-0!"
      id="ownership-calculator"
    >
      <>
        <Glow
          className={cn(
            'absolute -top-10 right-full h-[158px] w-[72px] rotate-22 blur-[120px]',
            selected === 'lender' && 'bg-secondary'
          )}
        />
        <Glow
          className={cn(
            'absolute bottom-0 left-full h-[158px] w-[72px] rotate-22 blur-[100px]',
            selected === 'lender' && 'bg-secondary'
          )}
        />
      </>

      <div className="border-default-100 relative z-1 w-full gap-4 rounded-xl border bg-[linear-gradient(86.84deg,_rgba(254,_254,_254,_0.08)_17.87%,_rgba(255,_255,_255,_0.04)_52.56%,_rgba(255,_255,_255,_0.06)_77.29%)] px-20 py-20 max-lg:px-4 max-lg:py-14">
        <Tabs
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key as string)}
          aria-label="Tabs variants"
          variant="light"
          classNames={{ panel: 'p-0 pt-6', cursor: 'bg-white/10!' }}
        >
          <Tab key="borrower" title="As a Borrower">
            <div className="flex items-center justify-between gap-30 max-lg:flex-col max-lg:gap-16">
              <div className="flex max-w-[456px] flex-1 flex-col gap-2">
                <h1 className="text-foreground text-5xl leading-[1.15] font-medium max-lg:text-[32px]">
                  Start Stacking BTC
                </h1>
                <p className="text-foreground/70 text-base leading-tight font-normal">
                  Ready to own BTC without needing to buy it all at once?
                  Here&apos;s how.
                </p>

                <div className="my-8 flex w-full flex-col gap-6">
                  {BORROWER_ABOUT.map((item) => (
                    <div
                      key={item.title}
                      className="border-default-100 flex items-start gap-4 rounded-lg border bg-[linear-gradient(86.84deg,_rgba(247,_147,_26,_0.01)_17.87%,_rgba(255,_255,_255,_0.02)_52.56%,_rgba(255,_255,_255,_0.04)_77.29%)] p-4 shadow-[0px_0px_4px_0px_#FFFFFF1F,0px_1px_0px_0px_#FFFFFF1F]"
                    >
                      <div className="size-8 flex-shrink-0">{item.icon}</div>
                      <div className="flex flex-col gap-4">
                        <div className="text-foreground/90 text-xl leading-[1] font-medium max-lg:text-lg">
                          {item.title}
                        </div>
                        <div className="text-foreground/70 text-sm leading-[1.15] font-normal">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  as={Link}
                  color="primary"
                  size="lg"
                  className="h-11 w-full font-medium"
                  variant="shadow"
                  href="/borrow"
                >
                  Launch App
                </Button>
              </div>

              <div className="grid flex-1 place-items-center">
                <BorrowersCalculator />
              </div>
            </div>
          </Tab>

          <Tab key="lender" title="As a Lender" id="lenders">
            <div
              className="flex items-center justify-between gap-30 max-lg:flex-col max-lg:gap-16"
              id="lenders"
            >
              <div className="flex max-w-[456px] flex-1 flex-col gap-2">
                <h1 className="text-foreground text-5xl leading-[1.15] font-medium max-lg:text-[32px]">
                  Start Lending USDC
                </h1>
                <p className="text-foreground/70 text-base leading-tight font-normal">
                  Ready to earn interest on your USDC? <br /> Here&apos;s how.
                </p>

                <div className="my-8 flex w-full flex-col gap-6">
                  {LENDER_ABOUT.map((item) => (
                    <div
                      key={item.title}
                      className="border-default-100 flex items-start gap-4 rounded-lg border bg-[linear-gradient(86.84deg,_rgba(247,_147,_26,_0.01)_17.87%,_rgba(255,_255,_255,_0.02)_52.56%,_rgba(255,_255,_255,_0.04)_77.29%)] p-4 shadow-[0px_0px_4px_0px_#FFFFFF1F,0px_1px_0px_0px_#FFFFFF1F]"
                    >
                      <div className="size-8 flex-shrink-0">{item.icon}</div>
                      <div className="flex flex-col gap-4">
                        <div className="text-foreground/90 text-xl leading-[1] font-medium max-lg:text-lg">
                          {item.title}
                        </div>
                        <div className="text-foreground/70 text-sm leading-[1.15] font-normal">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  as={Link}
                  color="secondary"
                  size="lg"
                  className="h-11 w-full font-medium"
                  variant="shadow"
                  href="/lend"
                >
                  Launch App
                </Button>
              </div>

              <div className="grid flex-1 place-items-center max-lg:w-full">
                <LendingChart />
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </section>
  )
}

const BORROWER_ABOUT = [
  {
    icon: <BiSolidWallet className="text-primary size-8" />,
    title: 'Connect Your Wallet',
    description:
      'Connect your wallet and start your journey to unlocking more BTC ownership.',
  },
  {
    icon: <GoGoal className="text-primary size-8" />,
    title: 'Set Your BTC Goal',
    description:
      'Choose how much BTC you want to own, start with as little as 25% upfront.',
  },
  {
    icon: (
      <InlineSVG src="/icons/coin-bag.svg" className="text-primary size-8" />
    ),
    title: 'Start Stacking BTC',
    description:
      'Instantly review and see your monthly payment, ownership schedule, and total BTC progress.',
  },
]

const LENDER_ABOUT = [
  {
    icon: <BiSolidWallet className="text-secondary size-8" />,
    title: 'Connect Your Wallet',
    description:
      'Connect your wallet and start your journey to earning interest.',
  },
  {
    icon: <GoGoal className="text-secondary size-8" />,
    title: 'Set Your USDC Goal',
    description:
      'Choose how much USDC you want to lend, start with as little as 25% upfront.',
  },
  {
    icon: (
      <InlineSVG src="/icons/coin-bag.svg" className="text-secondary size-8" />
    ),
    title: 'Start Stacking USDC',
    description:
      'Instantly review and see your monthly payment, ownership schedule, and total USDC progress.',
  },
]
