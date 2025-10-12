'use client'
import { DCA_MINI_APP_URL } from '@/utils/constants'
import { Glow } from './Glow'
import { HeroBitcoinAnimation } from './HeroBitcoinAnimation'
import { Button } from '@heroui/react'
import NextLink from 'next/link'

export const Hero = () => {
  return (
    <section
      className="container pt-36 pb-60 max-lg:pt-14 max-lg:pb-30"
      id="hero"
    >
      <div className="flex items-center justify-between gap-20 max-lg:flex-col max-lg:gap-30">
        <div className="flex w-full max-w-lg flex-1 flex-col gap-4">
          <div className="text-foreground text-[56px] leading-[1.15] font-bold max-lg:text-center max-lg:text-4xl">
            Own Bitcoin
            <br />
            Without Buying It
            <br />
            All at Once
          </div>

          <div className="text-foreground/70 mb-6 text-base leading-tight font-normal max-lg:mb-4 max-lg:text-center">
            Build towards your Bitcoin Ownership goals over time, with plans
            designed to protect your peace of mind.
          </div>

          <div className="flex flex-wrap items-center gap-2 max-lg:flex-col max-lg:justify-center">
            <Button
              className="h-13 rounded-xl border-2 border-[#F6921A] bg-gradient-to-r from-[#F7931A] to-[#C46200] px-8 py-3.5 text-base font-bold"
              color="primary"
              variant="shadow"
              as={NextLink}
              href={DCA_MINI_APP_URL}
              target="_blank"
            >
              Buy Bitcoin Everyday
            </Button>

            {/* <Link
              className="group flex h-13 items-center gap-1 px-6 py-3.5 text-base font-medium"
              color="primary"
              href="/borrow"
              as={NextLink}
            >
              Learn About Bitcoin Loan
              <IoIosArrowRoundForward
                size={20}
                className="transition-transform group-hover:translate-x-2"
              />
            </Link> */}
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
