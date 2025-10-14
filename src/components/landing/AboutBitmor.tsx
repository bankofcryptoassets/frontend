'use client'
import NextLink from 'next/link'
import { Link, Tab, Tabs } from '@heroui/react'
import Image from 'next/image'
import { IoIosArrowRoundForward } from 'react-icons/io'
import { Glow } from './Glow'
import { LuChartLine } from 'react-icons/lu'
import InlineSVG from 'react-inlinesvg'
import { MdRemoveModerator } from 'react-icons/md'
import { useState } from 'react'
import { DCA_MINI_APP_URL } from '@/utils/constants'
import { JoinWaitlist } from './JoinWaitlist'

export const AboutBitmore = () => {
  const [selected, setSelected] = useState('dca')
  return (
    <section
      className="relative container max-w-[1360px] min-[87.5rem]:px-0!"
      id="about"
    >
      <Glow className="absolute top-0 left-full h-[127px] w-[58px] rotate-22 blur-[85px]" />

      <div className="border-default-100 relative z-1 w-full overflow-hidden rounded-xl border bg-[linear-gradient(86.84deg,_rgba(254,_254,_254,_0.08)_17.87%,_rgba(255,_255,_255,_0.04)_52.56%,_rgba(255,_255,_255,_0.06)_77.29%)] px-20 pt-16 max-lg:px-4 max-lg:pt-4">
        {selected === 'loans' && (
          <div className="bg-primary absolute top-4 -right-15 rotate-20 py-1.5 pr-20 pl-40 text-lg font-bold text-[#4C2D07] max-md:hidden">
            COMING SOON !!!
          </div>
        )}

        <Tabs
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key as string)}
          variant="light"
          classNames={{
            panel: 'p-0',
            cursor: 'bg-white/10!',
            tabList: 'max-lg:mx-auto',
            base: 'w-full',
            tabContent:
              'text-foreground/60 transition-colors group-data-[selected=true]:text-foreground',
          }}
        >
          <Tab key="dca" title="Bitmor DCA">
            <div className="mt-6 flex w-full justify-between gap-7 max-lg:flex-col">
              <div className="flex flex-1 flex-col gap-2 max-lg:items-center">
                <h1 className="text-foreground text-5xl leading-[1.15] font-medium max-lg:text-center max-lg:text-[32px]">
                  About Bitmor DCA
                </h1>

                <p className="text-foreground/70 mb-4 max-w-sm text-base leading-tight font-normal max-lg:mx-auto max-lg:text-center">
                  With Bitmor DCA build Bitcoin ownership the simple way. You
                  set a goal, choose how often to invest, and let automation do
                  the rest.
                </p>

                <Link
                  as={NextLink}
                  href={DCA_MINI_APP_URL}
                  target="_blank"
                  className="text-foreground group w-fit gap-2 leading-tight font-medium max-lg:mx-auto"
                >
                  Launch Mini App{' '}
                  <IoIosArrowRoundForward
                    size={24}
                    className="transition-transform group-hover:translate-x-2"
                  />
                </Link>

                <Image
                  src="/extras/dca-app.png"
                  alt="Borrow page"
                  width={437}
                  height={310}
                  className="pointer-events-none mt-16 select-none max-lg:hidden"
                />
              </div>

              <div className="flex max-w-md flex-1 flex-col gap-6 max-lg:max-w-full">
                {ABOUT_DCA.map((item) => (
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
            </div>
          </Tab>

          <Tab key="loans" title="Bitmor Loans">
            <div className="mt-6 flex w-full justify-between gap-7 max-lg:flex-col">
              <div className="flex flex-1 flex-col gap-2 max-lg:items-center">
                <h1 className="text-foreground text-5xl leading-[1.15] font-medium max-lg:text-center max-lg:text-[32px]">
                  About Bitmor Loans
                </h1>

                <p className="text-foreground/70 mb-4 max-w-sm text-base leading-tight font-normal max-lg:mx-auto max-lg:text-center">
                  Bitmor loans accelerates your Bitcoin ownership goals, while
                  not requiring high upfront capital. Lock in today&apos;s price
                  and pay in monthly installments.
                </p>

                <JoinWaitlist />

                <Image
                  src="/extras/borrow-page.png"
                  alt="Borrow page"
                  width={574}
                  height={294}
                  className="pointer-events-none mt-16 select-none max-lg:hidden"
                />
              </div>

              <div className="flex max-w-md flex-1 flex-col gap-6 max-lg:max-w-full">
                {ABOUT_LOANS.map((item) => (
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
            </div>
          </Tab>
        </Tabs>

        <Image
          src={
            selected === 'dca'
              ? '/extras/dca-app.png'
              : '/extras/borrow-page.png'
          }
          alt="Borrow page"
          width={568}
          height={298}
          className="pointer-events-none mx-auto mt-10 select-none lg:hidden"
        />

        <Image
          src="/extras/about-page-glow.svg"
          alt="Borrow page"
          width={800}
          height={528}
          className="pointer-events-none absolute bottom-0 left-0 -z-1 select-none"
        />
      </div>
    </section>
  )
}

const ABOUT_DCA = [
  {
    icon: (
      <InlineSVG src="/icons/coin-stack.svg" className="text-primary size-8" />
    ),
    title: 'Start Small, Stack Big',
    description:
      'Own Bitcoin from just $1/day. Turn spare change into lasting wealth.',
  },
  {
    icon: (
      <InlineSVG src="/icons/candles.svg" className="text-primary size-8" />
    ),
    title: 'Set It and Forget It',
    description:
      'Automated daily or weekly buys. Consistency beats chasing dips.',
  },
  {
    icon: <InlineSVG src="/icons/link.svg" className="text-primary size-8" />,
    title: 'Peace of Mind Investing',
    description: `No charts, no FOMO. Just steady, stress-free accumulation.`,
  },
  {
    icon: (
      <InlineSVG src="/icons/btc-pyramid.svg" className="text-primary size-8" />
    ),
    title: 'Secure & Simple',
    description:
      'No complicated setups — a safe, beginner-friendly way to grow Bitcoin your way.',
  },
]
const ABOUT_LOANS = [
  {
    icon: (
      <InlineSVG src="/icons/coin-bag.svg" className="text-primary size-8" />
    ),
    title: 'Faster than Saving',
    description: 'Secure your entry today. Own sooner to ride the gains.',
  },
  {
    icon: <MdRemoveModerator size={32} className="text-primary" />,
    title: 'No Over-Collateralisation',
    description:
      'Use what you have to get to where you want to go. Don’t lock up excess capital to get the same BTC',
  },
  {
    icon: <LuChartLine size={32} className="text-primary" />,
    title: 'Smarter than Leverage',
    description: `Stack sats without margin calls. Dips won't wipe you out.`,
  },
  {
    icon: <InlineSVG src="/icons/coins.svg" className="text-primary size-8" />,
    title: 'Powered by Community Capital',
    description:
      'Lenders earn while supporting steady. BTC acquisition for real people.',
  },
]
