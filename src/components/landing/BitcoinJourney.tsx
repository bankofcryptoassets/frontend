'use client'
import { Glow } from './Glow'
import { Calculators } from './Calculators'
import Image from 'next/image'

export const BitcoinJourney = () => {
  return (
    <section
      className="relative container mb-50 max-w-[1360px] max-lg:mb-30 min-[87.5rem]:px-0!"
      id="ownership-calculator"
    >
      <>
        <Glow className="absolute -top-10 right-full h-[158px] w-[72px] rotate-22 blur-[120px]" />
        <Glow className="absolute bottom-0 left-full h-[158px] w-[72px] rotate-22 blur-[100px]" />
      </>

      <div className="border-default-100 relative z-1 w-full gap-4 rounded-xl border bg-[linear-gradient(86.84deg,_rgba(254,_254,_254,_0.08)_17.87%,_rgba(255,_255,_255,_0.04)_52.56%,_rgba(255,_255,_255,_0.06)_77.29%)] px-20 py-20 max-lg:px-4 max-lg:py-14">
        <div className="flex items-center justify-between gap-30 max-lg:flex-col max-lg:gap-16">
          <div className="flex max-w-[456px] flex-1 flex-col gap-2">
            <h1 className="text-foreground text-5xl leading-[1.15] font-medium max-lg:text-center max-lg:text-[32px]">
              Start Your Bitcoin Journey Today
            </h1>
            <p className="text-foreground/70 text-base leading-tight font-normal max-lg:text-center">
              Own BTC without the big upfront buy.
            </p>

            <div className="mt-14 flex gap-5 max-lg:items-center max-lg:justify-center">
              <Image
                src="/extras/journey-steps.svg"
                alt="Journey Steps"
                width={40}
                height={296}
                className="pointer-events-none select-none"
              />

              <div className="text-foreground/90 flex h-74 flex-col justify-between gap-16 py-2.5 text-xl leading-none font-medium max-lg:text-lg max-sm:text-base">
                <div>Connect Your Wallet</div>
                <div>Set Your Bitcoin Goal</div>
                <div>Choose Your Plan & Terms</div>
                <div>Start Stacking Regularly</div>
              </div>
            </div>
          </div>

          <div className="grid flex-1 place-items-center max-lg:w-full">
            <Calculators />
          </div>
        </div>
      </div>
    </section>
  )
}
