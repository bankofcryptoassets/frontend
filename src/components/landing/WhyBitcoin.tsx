'use client'
import Image from 'next/image'
import { title } from '../primitives'
import { LuStar } from 'react-icons/lu'
import { BitcoinHouse } from './BitcoinHouse'
import { Button, Card, cn, Link } from '@heroui/react'
import { MagicCard } from '../MagicCard'
import { useTheme } from 'next-themes'

const WHY_OWN_BTC_1 = [
  {
    icon: (
      <Image
        src="/icons/3d-money-bag.png"
        alt="Money Bag"
        width={54}
        height={72}
      />
    ),
    iconBgClassName:
      'bg-[linear-gradient(118.98deg,rgba(25,52,27,0.08)_0%,rgba(50,146,57,0.64)_70%)]',
    title: 'Smarter than Saving',
    description: 'Secure your entry. Own sooner, ride the entire gains.',
  },
  {
    icon: (
      <Image src="/icons/3d-lock.png" alt="3D Lock" width={58} height={68} />
    ),
    iconBgClassName:
      'bg-[linear-gradient(118.98deg,rgba(255,111,33,0.1)_0%,rgba(210,106,50,0.8)_70%)]',
    title: 'No Over-Collateralisation',
    description: 'Secure your BTC without tying up extra capital or assets.',
  },
  {
    icon: (
      <Image src="/icons/3d-shield.png" alt="Shield" width={60} height={68} />
    ),
    iconBgClassName:
      'bg-[linear-gradient(118.98deg,rgba(8,115,214,0.1)_0%,rgba(8,115,214,0.8)_70%)]',
    title: 'Safer than Leverage',
    description: 'Stack sats without margin calls. Dips wont’t wipe you out.',
  },
  {
    icon: (
      <Image src="/icons/3d-arrow.png" alt="Arrow" width={72} height={62} />
    ),
    iconBgClassName:
      'bg-[linear-gradient(118.98deg,rgba(124,0,201,0.08)_0%,rgba(132,54,181,0.64)_70%)]',
    title: 'Outpaces DCA Strategies',
    description: 'Reach your 1 BTC goal today, not in 100 months.',
  },
]

const WHY_OWN_BTC_2 = [
  {
    icon: (
      <div className="inline-block min-w-10 select-none rounded-full bg-[#d4bdea] p-[9px_6.5px_7px_9.5px] dark:bg-[#2C1542]">
        <Image
          src="/icons/money-trend-up.png"
          alt="Money Trend Up"
          width={24}
          height={24}
        />
      </div>
    ),
    title: 'Unbeatable Gains for Everyone',
    description: 'Outperformed all assets. 99% holders profitable.',
  },
  {
    icon: (
      <div className="inline-block min-w-10 select-none rounded-full bg-secondary-50 px-[11px] pb-2.5 pt-2">
        <Image
          src="/icons/money-up.png"
          alt="Money Up"
          width={18}
          height={22}
          className="h-[22px] w-[18px]"
        />
      </div>
    ),
    title: 'Strongest Asset You Can Own',
    description: 'Scarce forever. 21M Bitcoin, 8B humans. No inflation.',
  },
  {
    icon: (
      <div className="inline-block min-w-10 rounded-full bg-success-50 p-2.5">
        <LuStar className="text-success" size={20} />
      </div>
    ),
    title: 'Become a Full-Coiner Today',
    description: 'Only 1 in a million has a full BTC. Join the club.',
  },
]

export const WhyBitcoin = () => {
  const { theme } = useTheme()

  return (
    <section className="container py-20 max-lg:py-16" id="why">
      <div className="flex w-full flex-col items-center justify-center gap-12">
        <div className="flex w-full flex-col items-center justify-center gap-3 text-center">
          <h2 className={title({ size: 'xs', className: 'text-primary' })}>
            Why Savvy Stackers Pick Bitmor
          </h2>

          <p className="text-balance text-center text-lg text-default-d">
            Start from $170/month and build towards 10M Sats.
          </p>
        </div>

        <div className="grid max-w-5xl grid-cols-2 gap-x-7 gap-y-8 max-lg:grid-cols-1">
          {WHY_OWN_BTC_1.map((item) => (
            <Card
              className="w-full rounded-2xl bg-default/35 shadow-[2px_4px_16px_0px_hsl(var(--heroui-default-200))_inset]"
              key={item.title}
            >
              <MagicCard
                gradientColor={theme === 'dark' ? '#333333' : '#D9D9D9aa'}
                className="h-full w-full p-2.5"
              >
                <div className="flex h-full w-full flex-row items-center gap-7">
                  <div
                    className={cn(
                      'grid size-[104px] flex-shrink-0 place-items-center rounded-xl',
                      item.iconBgClassName
                    )}
                  >
                    {item.icon}
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="text-xl font-bold leading-tight text-default-e lg:text-2xl">
                      {item.title}
                    </div>
                    <div className="text-base leading-tight text-default-a">
                      {item.description}
                    </div>
                  </div>
                </div>
              </MagicCard>
            </Card>
          ))}
        </div>

        <Button
          variant="shadow"
          size="lg"
          color="primary"
          as={Link}
          href="/#cta"
          className="mt-6 w-[280px] font-bold"
        >
          Join the Waitlist
        </Button>
      </div>

      <div className="mt-32 flex items-center justify-between gap-8 max-lg:flex-col">
        <div className="flex flex-col gap-6">
          <div className="">
            <h2 className={title({ size: 'xs' })}>Own Bitcoin with Bitmor</h2>
            <p className="mt-0.5 text-base leading-tight text-default-a">
              HODL Bitcoin for a Safer Future
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-8">
            {WHY_OWN_BTC_2.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 max-sm:flex-col max-sm:text-center"
              >
                {item.icon}
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-medium leading-tight text-primary lg:text-2xl">
                    {item.title}
                  </h3>
                  <p className="max-w-[420px] text-base leading-tight text-default-e">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <BitcoinHouse />
      </div>
    </section>
  )
}
