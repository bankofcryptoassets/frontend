'use client'
import { DASH } from '@/utils/constants'
import NextLink from 'next/link'
import { Link } from '@heroui/react'
import Image from 'next/image'
import { IoIosArrowRoundForward } from 'react-icons/io'
import { Glow } from './Glow'
import { LuChartLine } from 'react-icons/lu'
import InlineSVG from 'react-inlinesvg'
import { MdRemoveModerator } from 'react-icons/md'

export const AboutBitmore = () => {
  return (
    <section
      className="relative container max-w-[1360px] min-[87.5rem]:px-0!"
      id="about"
    >
      <Glow className="absolute top-0 left-full h-[127px] w-[58px] rotate-22 blur-[85px]" />

      <div className="border-default-100 relative z-1 flex w-full justify-between gap-4 rounded-xl border bg-[linear-gradient(86.84deg,_rgba(254,_254,_254,_0.08)_17.87%,_rgba(255,_255,_255,_0.04)_52.56%,_rgba(255,_255,_255,_0.06)_77.29%)] px-20 max-lg:flex-col max-lg:px-4">
        <div className="flex flex-1 flex-col gap-2 pt-22 max-lg:pt-10">
          <h1 className="text-foreground text-5xl leading-[1.15] font-medium max-lg:text-[32px]">
            About Bitmor
          </h1>

          <p className="text-foreground/70 max-w-sm text-base leading-tight font-normal">
            Bitmor accelerates your Bitcoin ownership goals, while not requiring
            high upfront capital. Lock in today’s price and pay in monthly
            installments.
          </p>

          <Link
            as={NextLink}
            href="/borrow"
            className="text-foreground group mt-4 w-fit gap-2 leading-tight font-medium"
          >
            Learn More{' '}
            <IoIosArrowRoundForward
              size={24}
              className="transition-transform group-hover:translate-x-2"
            />
          </Link>

          <Image
            src="/extras/borrow-page.png"
            alt="Borrow page"
            width={570}
            height={317}
            className="mt-auto bg-black/90 max-lg:hidden dark:bg-transparent"
          />
        </div>

        <div className="flex max-w-md flex-1 flex-col gap-6 py-20 max-lg:max-w-full max-lg:py-10 max-lg:pb-0">
          {ABOUT.map((item) => (
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

        <Image
          src="/extras/borrow-page.png"
          alt="Borrow page"
          width={570}
          height={317}
          className="mx-auto mt-10 bg-black/90 lg:hidden dark:bg-transparent"
        />
      </div>
    </section>
  )
}

const ABOUT = [
  {
    icon: (
      <InlineSVG src="/icons/coin-bag.svg" className="text-primary size-8" />
    ),
    title: 'Smarter than Saving',
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
