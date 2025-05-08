import { Button, Card } from '@heroui/react'
import { MagicCard } from '../MagicCard'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { LuCircleDollarSign } from 'react-icons/lu'

const LENDING_POOLS = [
  {
    icon: (
      <div className="inline-block rounded-full bg-secondary/20 p-2">
        <LuCircleDollarSign className="text-secondary" size={24} />
      </div>
    ),
    name: 'USDC Lending Pool',
    currentAPY: '8.2%',
    thirtyDayAverage: '7.9%',
    minDeposit: '$100',
    lockPeriod: 'None',
  },
  {
    icon: (
      <div className="inline-block rounded-full bg-success/20 p-2">
        <LuCircleDollarSign className="text-success" size={24} />
      </div>
    ),
    name: 'USDT Lending Pool',
    currentAPY: '7.9%',
    thirtyDayAverage: '7.5%',
    minDeposit: '$100',
    lockPeriod: 'None',
  },
]

export const LendingPools = () => {
  const { resolvedTheme: theme } = useTheme()

  return (
    <Card className="w-full max-w-lg bg-background" radius="md">
      <MagicCard
        gradientColor={theme === 'dark' ? '#333333' : '#D9D9D9aa'}
        className="p-0"
      >
        <div className="p-6">
          <div className="mb-6 flex gap-6 max-sm:flex-col">
            {LENDING_POOLS.map((pool) => (
              <div
                key={pool.name}
                className="flex w-full flex-col gap-2 rounded-lg bg-default/35 p-4 transition-colors hover:bg-default/50"
              >
                <div className="w-full">{pool.icon}</div>
                <div className="text-lg font-semibold">{pool.name}</div>

                <div className="space-y-0.5">
                  <div className="text-sm text-default-700">Current APY</div>
                  <div className="text-3xl font-bold">{pool.currentAPY}</div>
                  <div className="text-xs text-default-700">
                    30-day average:{' '}
                    <span className="font-semibold">
                      {pool.thirtyDayAverage}
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex justify-between gap-2 text-sm">
                  <div>Minimum deposit: </div>
                  <div className="font-semibold">{pool.minDeposit}</div>
                </div>
                <div className="flex justify-between gap-2 text-sm">
                  <div>Lock period: </div>
                  <div className="font-semibold">{pool.lockPeriod}</div>
                </div>
              </div>
            ))}
          </div>

          <Button
            color="secondary"
            variant="shadow"
            as={Link}
            href="/lend"
            className="font-medium"
            fullWidth
          >
            Explore Lending Pools
          </Button>
        </div>
      </MagicCard>
    </Card>
  )
}
