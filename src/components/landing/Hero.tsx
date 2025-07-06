'use client'
import { Button, Divider, Input } from '@heroui/react'
import { subtitle, title } from '../primitives'
import Image from 'next/image'

export const Hero = () => {
  return (
    <section className="relative z-0" id="hero">
      <div
        className="pointer-events-none absolute inset-2 -z-[1] select-none overflow-hidden rounded-xl border-2 border-default-200"
        style={{
          background: `
              url("data:image/svg+xml,%3Csvg viewBox='0 0 1799 1799' opacity='0.4' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
              linear-gradient(135deg, rgba(247, 147, 26, 0.8), rgba(247, 147, 26, 0.1) 70%),
              radial-gradient(circle at 20% 30%, rgba(0, 82, 255, 0.4) 0%, rgba(0, 82, 255, 0) 50%),
              radial-gradient(circle at 80% 20%, rgba(11, 83, 191, 0.4) 0%, rgba(11, 83, 191, 0) 60%),
              linear-gradient(to right bottom, rgba(247, 147, 26, 0.2), rgba(0, 82, 255, 0.2), rgba(11, 83, 191, 0.2))
            `,
          backgroundBlendMode: 'overlay, normal, screen, multiply, normal',
        }}
      ></div>

      <div className="container pt-16">
        <div className="flex flex-col items-center justify-center gap-4 pt-8 md:pt-10">
          <div className="inline-block max-w-4xl justify-center text-center">
            <h1 className="max-lg:text-balance">
              <span className={title({ size: 'lg' })}>Own Bitcoin Today, </span>
              <br />
              <span
                className={title({ className: 'text-primary', size: 'lg' })}
              >
                Pay Later
              </span>
            </h1>

            <p className={subtitle({ class: 'mt-10 text-balance' })}>
              Start with just 20%. Earn yield while you repay.
            </p>
          </div>

          <div className="mb-20 mt-8 w-full max-w-[720px]">
            <Input
              placeholder="Early access = better terms"
              className="h-[60px] w-full max-w-[720px] rounded-xl"
              classNames={{
                mainWrapper: 'w-full',
                inputWrapper:
                  'h-[60px] rounded-xl w-full pl-5 pr-2 !bg-[#F5F5F5] ',
                innerWrapper: 'w-full',
                input: '!text-black placeholder:text-[#666666]',
              }}
              size="lg"
              endContent={
                <div className="flex items-center gap-4">
                  <Button
                    className="size-11 rounded-lg bg-white text-sm font-bold shadow-[1px_2px_8px_0px_#0000000A] hover:bg-white/90"
                    size="sm"
                    isIconOnly
                  >
                    <Image
                      src="/icons/google.png"
                      alt="google"
                      width={24}
                      height={24}
                      className="size-6 min-w-6"
                    />
                  </Button>

                  <Divider
                    orientation="vertical"
                    className="h-8 w-px bg-default-d"
                  />

                  <Button
                    className="h-11 w-[160px] rounded-lg text-sm font-bold"
                    color="primary"
                    variant="shadow"
                  >
                    Join Waitlist
                  </Button>
                </div>
              }
            />
          </div>

          <p className="mb-6 text-balance text-center text-sm text-default-d">
            Bitmor Lets You Stack BTC. No Checks. No KYC.
          </p>
        </div>
      </div>
    </section>
  )
}
