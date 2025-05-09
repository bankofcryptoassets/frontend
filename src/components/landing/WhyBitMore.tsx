'use client'
import { Card, Chip } from '@heroui/react'
import { subtitle, title } from '../primitives'
import { MagicCard } from '../MagicCard'
import { useTheme } from 'next-themes'
import {
  LuCalendarClock,
  LuCoins,
  LuLock,
  LuShieldCheck,
  LuTrendingUp,
  LuUsers,
} from 'react-icons/lu'

const FEATURES = [
  {
    icon: (
      <div className="inline-block rounded-full bg-success/20 p-2">
        <LuShieldCheck className="text-success" size={24} />
      </div>
    ),
    title: 'No overcollateralisation',
    description:
      'Access Bitcoin without the 150%+ collateral requirements of other platforms.',
  },
  {
    icon: (
      <div className="inline-block rounded-full bg-primary/20 p-2">
        <LuCoins className="text-primary" size={24} />
      </div>
    ),
    title: 'Acquire Bitcoin with Minimal Capital',
    description: 'Lowering the barrier for Bitcoin ownership for everyone.',
  },
  {
    icon: (
      <div className="inline-block rounded-full bg-warning/20 p-2">
        <LuCalendarClock className="text-warning" size={24} />
      </div>
    ),
    title: 'Timely Automated Monthly Repayments',
    description:
      'Just maintain the right balance, or automatically rebalance with BTC loan position.',
  },
  {
    icon: (
      <div className="inline-block rounded-full bg-primary/20 p-2">
        <LuTrendingUp className="text-primary" size={24} />
      </div>
    ),
    title: 'Real yield from real demand',
    description:
      'Sustainable yields backed by actual Bitcoin buyers, not speculative rewards.',
  },
  {
    icon: (
      <div className="inline-block rounded-full bg-danger/20 p-2">
        <LuLock className="text-danger" size={24} />
      </div>
    ),
    title: 'Smart contract security',
    description:
      'Audited code ensures your assets are protected through every transaction.',
  },
  {
    icon: (
      <div className="inline-block rounded-full bg-secondary/20 p-2">
        <LuUsers className="text-secondary" size={24} />
      </div>
    ),
    title: 'Community alignment',
    description:
      'Protocol designed to benefit all participants in a fair, transparent manner.',
  },
]

export const WhyBitMore = () => {
  const { resolvedTheme: theme } = useTheme()

  return (
    <section className="container py-20 max-lg:py-16" id="why">
      <div className="flex w-full flex-col items-center justify-center gap-6">
        <div className="flex w-full flex-col items-center justify-center gap-3 text-center">
          <Chip color="primary" classNames={{ content: 'font-semibold' }}>
            WHY BITMORE
          </Chip>

          <h2 className={title({ size: 'xs' })}>Better Way to BTC</h2>

          <p className={subtitle()}>
            We&apos;re revolutionizing Bitcoin ownership and yield with a
            sustainable, secure platform.
          </p>
        </div>

        <div>
          <div className="mt-6 grid grid-cols-3 gap-6 max-xl:grid-cols-2 max-md:grid-cols-1">
            {FEATURES?.map((item, index) => {
              return (
                <Card
                  className="w-full max-w-lg bg-default/35 shadow-[2px_4px_16px_0px_hsl(var(--heroui-default-200))_inset]"
                  radius="md"
                  key={index}
                >
                  <MagicCard
                    gradientColor={theme === 'dark' ? '#333333' : '#D9D9D9aa'}
                    className="h-full p-0"
                  >
                    <div className="space-y-3 p-6">
                      {item.icon}

                      <div className="text-xl font-semibold">{item.title}</div>

                      <p className="text-sm text-default-700">
                        {item.description}
                      </p>
                    </div>
                  </MagicCard>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
