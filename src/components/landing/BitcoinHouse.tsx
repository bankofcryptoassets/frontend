import { cn } from '@heroui/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import SlotCounter from 'react-slot-counter'

const HOUSE_PRICE_DATA = [
  {
    year: 2016,
    usd: '$288,400',
    btc: '664',
  },
  {
    year: 2020,
    usd: '$328,900',
    btc: '45.00',
  },
  {
    year: 2024,
    usd: '$434,700',
    btc: '6.60',
  },
]

export const BitcoinHouse = () => {
  const [active, setActive] = useState(HOUSE_PRICE_DATA[0])

  useEffect(() => {
    const handleNext = () => {
      const nextIndex = HOUSE_PRICE_DATA.findIndex(
        (item) => item.year === active.year
      )
      setActive(HOUSE_PRICE_DATA[nextIndex + 1] || HOUSE_PRICE_DATA[0])
    }

    const timeout = setTimeout(handleNext, 4000)
    return () => clearTimeout(timeout)
  }, [active])

  return (
    <div className="mt-auto w-full max-w-[524px] select-none rounded-2xl bg-background text-right">
      <div className="relative mt-32 inline-flex items-end justify-end text-start">
        <Image
          src="/extras/bitcoin-house.png"
          alt="Bitcoin House"
          width={420}
          height={320}
          className="w-full max-w-[420px] select-none"
        />

        <div className="absolute -left-16 top-0 space-y-2">
          {HOUSE_PRICE_DATA.map((item) => (
            <div
              key={item.year}
              className={cn(
                'rounded-xl px-6 py-1.5 text-xl font-bold leading-tight opacity-20 transition-all',
                active.year === item.year &&
                  'bg-default/35 opacity-100 shadow-[2px_4px_16px_0px_hsl(var(--heroui-default-200))_inset]'
              )}
            >
              In {item.year}
            </div>
          ))}
        </div>

        <div className="absolute -bottom-5 -left-24 flex flex-col items-end gap-2">
          <div className="-mr-5 w-fit rounded-2xl border-[4px] border-background bg-[#fbecda] px-10 py-2.5 text-sm font-bold leading-tight text-primary dark:bg-[#251604]">
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
            <div className="text-4xl font-bold leading-tight lg:text-[56px]">
              <SlotCounter
                useMonospaceWidth
                value={active.btc}
                // animateOnVisible={{ triggerOnce: true }}
                numberClassName="w-full"
                charClassName="text-4xl font-bold leading-tight lg:text-[56px]"
                separatorClassName="text-4xl font-bold leading-tight lg:text-[56px]"
              />
              <span className="text-2xl font-bold leading-tight lg:text-[28px]">
                {' '}
                BTC
              </span>
            </div>
          </div>
        </div>

        <div className="absolute -right-0 -top-32 flex flex-col items-end gap-2">
          <div className="w-fit rounded-2xl border-[4px] border-background bg-success-50 px-10 py-2.5 text-sm font-bold leading-tight text-success">
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
            <div className="text-3xl font-bold leading-tight lg:text-[44px]">
              <SlotCounter
                useMonospaceWidth
                value={active.usd}
                // animateOnVisible={{ triggerOnce: true }}
                numberClassName="w-full"
                charClassName="text-4xl font-bold leading-tight lg:text-[56px]"
                separatorClassName="text-4xl font-bold leading-tight lg:text-[56px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
