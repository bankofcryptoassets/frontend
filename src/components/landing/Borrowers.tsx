'use client'
import { Button } from '@heroui/react'
import { LuCircleCheckBig } from 'react-icons/lu'
import Link from 'next/link'
import { BorrowersCalculator } from './Calculators'

const BENEFITS = [
  'Only 20% down, own any amount of Bitcoin',
  'Earn yield on 100% of Bitcoin from day one',
  'Flexible terms, automated monthly payments',
  'Opt-in shield from liquidation events',
  'Pre-close anytime, with your USDC or BTC gains',
]

export const Borrowers = () => {
  return (
    <section className="relative z-0" id="calc">
      <div
        className="border-default-200 pointer-events-none absolute inset-2 -z-1 overflow-hidden rounded-xl border-2 select-none"
        style={{
          background: `
              url("data:image/svg+xml,%3Csvg viewBox='0 0 1799 1799' opacity='0.4' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
              linear-gradient(135deg, rgba(247, 147, 26, 0.1), rgba(247, 147, 26, 0.8) 70%)
            `,
          backgroundBlendMode: 'overlay, normal',
        }}
      ></div>

      <div className="container flex items-center justify-between gap-8 py-24 max-lg:flex-col max-lg:py-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="inline text-3xl font-bold tracking-tight lg:text-4xl">
              Start with Less. Stack More.
            </h2>
          </div>

          <div className="mt-1 flex flex-col gap-2">
            {BENEFITS.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <LuCircleCheckBig
                  className="text-primary mt-1.5 min-w-4"
                  size={16}
                />
                <span className="text-default-e text-lg font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <Button
            color="primary"
            variant="shadow"
            size="lg"
            as={Link}
            href="/#cta"
            className="mt-6 max-w-[360px] font-bold max-sm:w-full"
            // onPress={() => {
            //   trackEvent('clicked "Get your Bitcoin"')
            // }}
          >
            Join Our Early Access List
          </Button>
        </div>

        <BorrowersCalculator />
      </div>
    </section>
  )
}
