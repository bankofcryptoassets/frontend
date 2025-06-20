'use client'
import Image from 'next/image'
import { title } from '../primitives'
import { LuStar } from 'react-icons/lu'
import { BitcoinHouse } from './BitcoinHouse'

const WHY_OWN_BTC = [
  {
    icon: (
      <div className="inline-block min-w-10 rounded-full bg-success/20 p-2.5">
        <LuStar className="text-success" size={20} />
      </div>
    ),
    title: 'Outperforms Everything (Even Your Bags)',
    description:
      'Outpaced stocks, real estate, gold, and all crypto for over a decade, with over 60% annual growth.',
  },
  {
    icon: (
      <div className="inline-block min-w-10 select-none rounded-full bg-secondary/20 px-[11px] pb-2.5 pt-2">
        <Image
          src="/icons/money-up.png"
          alt="Money  Up"
          width={18}
          height={22}
          className="h-[22px] w-[18px]"
        />
      </div>
    ),
    title: 'Hardest Money Ever Created',
    description:
      'Fixed supply of 21 million. No inflation, no dilution. Digital property, backed by math, not policy.',
  },
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
    title: 'Long-term Holders Never Lose',
    description:
      '99.8% of long-term holders are profitable. Get started now because waiting is costing you.',
  },
]

export const WhyBitcoin = () => {
  return (
    <section className="container py-20 max-lg:py-16" id="why">
      <div className="flex items-center justify-between gap-8 max-lg:flex-col">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 className={title({ size: 'xs' })}>Why Own Bitcoin?</h2>
          </div>

          <div className="mt-4 flex flex-col gap-8">
            {WHY_OWN_BTC.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 max-sm:flex-col max-sm:text-center"
              >
                {item.icon}
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-medium leading-tight text-primary lg:text-2xl">
                    {item.title}
                  </h3>
                  <p className="max-w-[400px] text-base leading-tight text-default-e">
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
