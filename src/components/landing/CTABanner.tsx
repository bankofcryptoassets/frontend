'use client'
import { Glow } from './Glow'
import { JoinWishlist } from './JoinWishlist'

export const CTABanner = () => {
  return (
    <section
      className="relative container mb-50 max-w-[1360px] min-[87.5rem]:px-0!"
      id="cta"
    >
      <>
        <Glow className="absolute -top-20 left-full h-[158px] w-[72px] rotate-22 blur-[100px]" />
      </>

      <div className="border-default-100 relative z-1 w-full gap-4 rounded-xl border bg-[linear-gradient(86.84deg,_rgba(254,_254,_254,_0.08)_17.87%,_rgba(255,_255,_255,_0.04)_52.56%,_rgba(255,_255,_255,_0.06)_77.29%)] px-20 py-20">
        <div className="flex flex-col items-center justify-center gap-20">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-foreground text-5xl leading-[1.15] font-medium">
              Stay in-the-know
            </h1>
            <p className="text-foreground/70 text-base leading-tight font-normal">
              Don&apos;t just watch future, be a part of it.
            </p>
          </div>

          <div className="w-full max-w-[720px]">
            <JoinWishlist />
          </div>
        </div>
      </div>
    </section>
  )
}
