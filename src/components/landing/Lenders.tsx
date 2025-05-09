'use client'
import { Button, Chip } from '@heroui/react'
import { title } from '../primitives'
import { LuCircleCheckBig } from 'react-icons/lu'
import Link from 'next/link'
import { LendingPools } from './LendingPools'

const BENEFITS = [
  'Lend to real BTC buyers, earn fixed or variable yield',
  'Capital protected through liquidation of escrowed BTC',
  'Receive monthly payments',
  'Withdraw anytime (subject to liquidity)',
]

export const Lenders = () => {
  return (
    <section className="relative z-0" id="lenders">
      <div
        className="pointer-events-none absolute inset-2 -z-[1] select-none overflow-hidden rounded-xl border-2 border-default-200"
        style={{
          background: `
              url("data:image/svg+xml,%3Csvg viewBox='0 0 1799 1799' opacity='0.4' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
              linear-gradient(45deg, rgba(13, 87, 155, 0.8), rgba(13, 87, 155, 0.1) 70%)
            `,
          backgroundBlendMode: 'overlay, normal',
        }}
      ></div>

      <div className="container flex items-center justify-between gap-8 py-24 max-lg:flex-col-reverse max-lg:py-16">
        <LendingPools />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Chip color="secondary" classNames={{ content: 'font-semibold' }}>
              FOR LENDERS
            </Chip>

            <h2 className={title({ size: 'xs' })}>
              Put Your Stablecoins to Work,
              <br />
              Safely
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            {BENEFITS.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <LuCircleCheckBig className="text-secondary" size={16} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <Button
            color="secondary"
            variant="shadow"
            size="lg"
            as={Link}
            href="/lend"
            className="font-medium max-sm:w-full"
          >
            Start Lending
          </Button>
        </div>
      </div>
    </section>
  )
}
