'use client'
import { Button, Chip } from '@heroui/react'
import { title } from '../primitives'
import { LuCircleCheckBig } from 'react-icons/lu'
import Link from 'next/link'
import { BorrowersCalculator } from './BorrowersCalculator'

const BENEFITS = [
  'Own a full Bitcoin today like a Mortgage',
  'Monthly EMIs, Flexible Terms, Auto Payments',
  'BTC unlocks as you pay monthly',
  'Sell your full BTC and close your loan anytime',
]

export const Borrowers = () => {
  return (
    <section className="relative z-0" id="borrowers">
      <div
        className="pointer-events-none absolute inset-2 -z-[1] select-none overflow-hidden rounded-xl border-2 border-default-200"
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
            <Chip color="primary" classNames={{ content: 'font-semibold' }}>
              FOR BORROWERS
            </Chip>

            <h2 className={title({ size: 'xs' })}>
              Get Upto 80% Financing on Your BTC
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            {BENEFITS.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <LuCircleCheckBig
                  className="mt-1 min-w-4 text-primary"
                  size={16}
                />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <Button
            color="primary"
            variant="shadow"
            size="lg"
            as={Link}
            href="/borrow"
            className="font-medium max-sm:w-full"
          >
            Start Borrowing
          </Button>
        </div>

        <BorrowersCalculator />
      </div>
    </section>
  )
}
