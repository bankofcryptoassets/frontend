'use client'
import { DASH } from '@/utils/constants'
import { JoinWishlist } from './JoinWishlist'
import { Glow } from './Glow'
import { HeroBitcoinAnimation } from './HeroBitcoinAnimation'

export const Hero = () => {
  return (
    <section
      className="container pt-36 pb-60 max-lg:pt-14 max-lg:pb-30"
      id="hero"
    >
      <div className="flex items-center justify-between gap-20 max-lg:flex-col">
        <div className="flex w-full max-w-lg flex-1 flex-col gap-4">
          <div className="text-foreground text-[56px] leading-[1.15] font-bold max-lg:text-4xl">
            Own 1 Bitcoin {DASH}
            <br />
            Without Buying It
            <br />
            All at Once
          </div>

          <div className="text-foreground/70 mb-6 text-base leading-tight font-normal max-lg:mb-4">
            A smarter more secure way to build Bitcoin ownership over time.{' '}
            Backed by on-chain proof and built for everyday investors like you.
          </div>

          <div>
            <JoinWishlist isInHero />
          </div>
        </div>

        <div className="relative flex w-full max-w-lg flex-1 justify-end overflow-visible">
          <div className="z-0">
            <Glow className="absolute right-0 bottom-1/2 rotate-10" />
            <Glow className="absolute top-1/2 left-1/2 -translate-x-1/2 rotate-10" />
          </div>

          <div className="z-1 grid w-full place-items-center">
            <HeroBitcoinAnimation />
          </div>
        </div>
      </div>
    </section>
  )
}
