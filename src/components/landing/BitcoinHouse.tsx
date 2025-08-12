'use client'
import { cn } from '@heroui/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import SlotCounter from 'react-slot-counter'

const HOUSE_PRICE_DATA = [
  { year: 2016, usd: '$288,400', btc: '664' },
  { year: 2020, usd: '$328,900', btc: '45.00' },
  { year: 2024, usd: '$434,700', btc: '6.60' },
]

export const BitcoinHouse = () => {
  const [active, setActive] = useState(HOUSE_PRICE_DATA[0])
  const [isRotating, setIsRotating] = useState(false)

  useEffect(() => {
    const handleNext = () => {
      const nextIndex = HOUSE_PRICE_DATA.findIndex(
        (item) => item.year === active.year
      )
      setActive(HOUSE_PRICE_DATA[nextIndex + 1] || HOUSE_PRICE_DATA[0])
    }

    const timeout = setTimeout(handleNext, 2500)
    return () => clearTimeout(timeout)
  }, [active])

  useEffect(() => {
    setIsRotating((value) => !value)
  }, [active])

  return (
    <div className="bg-background mt-auto w-full max-w-[524px] rounded-2xl text-right select-none max-sm:text-center">
      <div className="relative mt-32 inline-flex flex-col items-end justify-end text-start max-sm:items-center max-sm:justify-center max-sm:gap-4">
        <Image
          src="/extras/bitcoin-house.png"
          alt="Bitcoin House"
          width={420}
          height={320}
          className={cn(
            'w-full max-w-[420px] transition-transform duration-1000 ease-in-out select-none',
            isRotating && '[transform:rotateY(360deg)]'
          )}
          priority
        />

        {/* Year */}
        <div className="top-0 -left-16 space-y-2 max-sm:mt-4 sm:absolute">
          {HOUSE_PRICE_DATA.map((item) => (
            <div
              key={item.year}
              className={cn(
                'rounded-xl px-6 py-1.5 text-xl leading-tight font-bold opacity-20 transition',
                active.year === item.year &&
                  'bg-default/35 opacity-100 shadow-[2px_4px_16px_0px_hsl(var(--heroui-default-200))_inset]'
              )}
            >
              In {item.year}
            </div>
          ))}
        </div>

        {/* BTC */}
        <div className="-bottom-5 -left-24 flex flex-col items-end gap-2 sm:absolute">
          <div className="border-background text-primary -mr-5 w-fit rounded-xl border-4 bg-[#fbecda] px-10 py-2.5 text-sm leading-tight font-bold dark:bg-[#251604]">
            Home Price in BTC
          </div>
          <div className="flex items-center gap-3">
            <Image
              src="/icons/btc.svg"
              alt="Bitcoin"
              width={40}
              height={40}
              className="size-10 min-w-10"
            />
            <div className="text-4xl leading-tight font-bold lg:text-[56px]">
              <SlotCounter
                useMonospaceWidth
                value={active.btc}
                // animateOnVisible={{ triggerOnce: true }}
                numberClassName="w-full"
                charClassName="text-4xl font-bold leading-tight lg:text-[56px]"
                separatorClassName="text-4xl font-bold leading-tight lg:text-[56px]"
              />
              <span className="text-2xl leading-tight font-bold lg:text-[28px]">
                {' '}
                BTC
              </span>
            </div>
          </div>
        </div>

        {/* USD */}
        <div className="-top-32 -right-0 flex flex-col items-end gap-2 sm:absolute">
          <div className="bg-success-50 text-success w-fit rounded-xl px-10 py-2.75 text-sm leading-tight font-bold">
            Home Price in USD
          </div>
          <div className="flex items-center gap-3">
            <Image
              src="/icons/usd.svg"
              alt="USD"
              width={40}
              height={40}
              className="size-10 min-w-10"
            />
            <div className="text-3xl leading-tight font-bold lg:text-[44px]">
              <SlotCounter
                useMonospaceWidth
                value={active.usd}
                // animateOnVisible={{ triggerOnce: true }}
                numberClassName="w-full"
                charClassName="text-3xl font-bold leading-tight lg:text-[44px]"
                separatorClassName="text-3xl font-bold leading-tight lg:text-[44px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
