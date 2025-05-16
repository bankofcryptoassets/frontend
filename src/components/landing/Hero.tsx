'use client'
import { Button } from '@heroui/react'
import { subtitle, title } from '../primitives'
import Link from 'next/link'

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

      <div className="container py-16">
        <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="inline-block max-w-4xl justify-center text-center">
            <h1 className="max-lg:text-balance">
              <span className={title()}>Own BTC like a Mortgage. </span>
              <span className={title({ color: 'primary' })}>
                Earn <br className="max-lg:hidden" /> Yield
              </span>
              <span className={title()}> Backed by BTC Loans.</span>
            </h1>

            <p className={subtitle({ class: 'mt-10' })}>
              BitMore lets you own BTC with a small upfront payment. Or earn
              stable yield by lending to Bitcoin buyers. All secured by smart
              contracts.
            </p>
          </div>

          <div className="mt-12 flex w-full items-center justify-center gap-8 max-sm:flex-col max-sm:gap-4">
            <Button
              color="primary"
              variant="shadow"
              size="lg"
              as={Link}
              href="/borrow/apply"
              className="font-medium max-sm:w-full"
            >
              Start Borrowing
            </Button>
            <Button
              color="secondary"
              variant="shadow"
              size="lg"
              as={Link}
              href="/lend/earn"
              className="font-medium max-sm:w-full"
            >
              Start Earning
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
