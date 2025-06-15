'use client'
import { Button, Card, Link } from '@heroui/react'
import Image from 'next/image'
import NextLink from 'next/link'
import { LuCircleDollarSign, LuTrendingUp } from 'react-icons/lu'
import { LiaHourglassSolid } from 'react-icons/lia'

export default function InvestPage() {
  return (
    <div
      className="container mt-10 grid h-full min-h-[calc(100vh-7rem)] w-full grid-cols-[280px_1fr] gap-5 pb-[60px] max-lg:grid-cols-1"
      id="invest-page"
    >
      <div className="flex h-full w-full flex-col gap-4">
        <Card className="min-h-fit w-full space-y-6 rounded-2xl border border-default-200/40 bg-default-100/80 p-7 pb-[30px]">
          <div>
            <div className="text-default-a text-xs">Your USDC Balance</div>
            <div className="mt-0.5 text-[28px] font-bold leading-tight text-secondary">
              123,004 <span className="text-xl">USDC</span>
            </div>
          </div>

          <div>
            <div className="text-default-a text-xs">Your BTC Balance</div>
            <div className="text-default-d mt-0.5 text-[28px] font-bold leading-tight">
              1.243 <span className="text-xl">BTC</span>
            </div>
          </div>

          <div>
            <div className="text-default-a text-xs">
              Your Earnings on Bitmor
            </div>
            <div className="text-default-d mt-0.5 text-[28px] font-bold leading-tight">
              $100.24
            </div>
          </div>
        </Card>

        <Card className="h-full w-full rounded-2xl border border-default-200/40 bg-default-100/80 p-4">
          <div className="text-default-d mb-[18px] border-b border-default-200 pb-3.5 pl-1 text-base font-medium">
            Bitmor Stats
          </div>

          <div className="!mb-[18px] space-y-6">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-success-50 p-[5px]">
                <LuCircleDollarSign className="text-success" size={18} />
              </div>
              <div className="text-default-d text-sm">
                Lenders in Bitmor have made more money than Aave
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-full bg-[#2C1542]/10 p-[5px] dark:bg-[#2C1542]">
                <LuTrendingUp
                  className="text-[#9C12F2]"
                  size={18}
                  strokeWidth={3}
                />
              </div>
              <div className="text-default-d text-sm">
                99% of BTC loaned on Bitmor is earning interest in Aave
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="min-w-7 rounded-full bg-primary-50 p-[5px]">
                <Image
                  src="/icons/btc-outline.svg"
                  alt="Bitcoin"
                  width={18}
                  height={18}
                  className="size-[18px] min-w-[18px]"
                />
              </div>
              <div className="text-default-d text-sm">
                Earn yield on 100% of your borrowed BTC from Day 1
              </div>
            </div>
          </div>

          <div className="!mt-auto flex w-full border-t border-default-200 pb-0.5 pt-4">
            <Link
              as={NextLink}
              href="/"
              color="secondary"
              className="mx-auto text-sm font-medium"
            >
              Talk to a Representative
            </Link>
          </div>
        </Card>
      </div>

      <Card className="rounded-2xl border border-default-200 bg-default-100 px-7 pb-5 pt-[18px]">
        <div className="text-default-d mb-7 border-b border-default-200 pb-4 pl-1 text-base font-medium">
          Investment Opportunities
        </div>

        <div className="!mb-7 flex flex-wrap gap-[60px] px-2">
          <div className="group w-[360px] rounded-xl border border-default-300/50 bg-default-200/40 px-5 pb-7 pt-[18px] transition hover:border-default-300 hover:bg-default-200 max-sm:w-full">
            <div className="text-default-d mb-7 border-b border-default-200 pb-3.5 pl-1 text-base font-medium transition-[border-color] group-hover:border-default-300">
              Be a Lender on Bitmor
            </div>

            <div className="mb-10 px-3">
              <div className="text-default-a mb-1 text-lg">APR on USDC</div>
              <div className="text-default-e text-[32px] font-bold leading-tight">
                5.7%
              </div>
            </div>

            <Button
              className="mx-1 w-full font-bold text-white"
              size="lg"
              color="secondary"
              as={NextLink}
              href="/invest/usdc"
            >
              Start Investing
            </Button>
          </div>

          <div className="group w-[360px] rounded-xl border border-default-300/50 bg-default-200/40 px-5 pb-7 pt-[18px] transition hover:border-default-300 hover:bg-default-200 max-sm:w-full">
            <div className="text-default-d mb-7 flex items-center justify-between gap-2 border-b border-default-200 pb-3.5 pl-1 text-base font-medium transition-[border-color] group-hover:border-default-300">
              <span>Earn from Aave</span>

              <Image
                src="/icons/aave.svg"
                alt="Aave"
                width={72}
                height={12}
                className="min-w-[72px]"
              />
            </div>

            <div className="mb-10 px-3">
              <div className="text-default-a mb-1 text-lg">APR on BTC</div>
              <div className="text-default-e text-[32px] font-bold leading-tight">
                0.3%
              </div>
            </div>

            <Button
              className="text-default-d mx-1 w-full bg-[#dcdcdb] font-medium dark:bg-[#121213]"
              size="lg"
              color="default"
              as={NextLink}
              href="/invest/aave"
            >
              Start Investment on Aave
            </Button>
          </div>
        </div>

        <div className="mx-2 mt-auto flex items-center gap-2.5 rounded-xl border border-default-300/50 bg-default-200/40 px-3.5 py-2.5">
          <div className="rounded-full bg-secondary-50 p-[5px]">
            <LiaHourglassSolid className="text-secondary" size={18} />
          </div>

          <div className="text-default-a text-sm">
            We’ll be adding more investment opportunities soon. Stay tuned to
            updates by connecting{' '}
            <Link
              as={NextLink}
              href="/"
              color="secondary"
              className="mx-auto text-sm font-medium underline"
            >
              Telegram
            </Link>
            .
          </div>
        </div>
      </Card>
    </div>
  )
}
