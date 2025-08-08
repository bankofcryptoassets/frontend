'use client'
import { Button, Card, Link } from '@heroui/react'
import Image from 'next/image'
import NextLink from 'next/link'
import { LuCircleDollarSign, LuTrendingUp } from 'react-icons/lu'
import { LiaHourglassSolid } from 'react-icons/lia'
import { useAccount, useBalance } from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/utils/constants'
import numeral from 'numeral'
import { useAuth } from '@/auth/useAuth'
import { useQuery } from '@tanstack/react-query'
import axios from '@/utils/axios'
import { LendingListData, LendingStats } from '@/types'
import Big from 'big.js'
import { StyledModal } from '@/components/StyledModal'
import { useState } from 'react'

export default function InvestPage() {
  const { address } = useAccount()
  const { isAuth } = useAuth()
  const { data: usdcBalance } = useBalance({
    address,
    token: CONTRACT_ADDRESSES.USDC,
    query: { enabled: !!address && !!isAuth },
  })
  const { data: btcBalance } = useBalance({
    address,
    token: CONTRACT_ADDRESSES.BTC,
    query: { enabled: !!address && !!isAuth },
  })
  const { data: lendingStats } = useQuery({
    queryKey: ['lending', 'stats', 'universal', address, isAuth],
    queryFn: async ({ signal }) => {
      const response = await axios.get<LendingStats>(
        '/lending/stats/universal',
        { signal }
      )
      return response.data
    },
  })
  const { data: lendingList } = useQuery({
    queryKey: ['lending', address, isAuth],
    queryFn: async ({ signal }) => {
      const response = await axios.get<LendingListData>('/lending', { signal })
      return response.data
    },
    enabled: !!address && !!isAuth,
  })

  const formattedUsdcBalance = numeral(
    usdcBalance?.value
      ? new Big(String(usdcBalance.value))
          .div(10 ** usdcBalance.decimals)
          .round(0, Big.roundDown)
          .toNumber()
      : 0
  ).format('0,0')

  const formattedBtcBalance = numeral(
    btcBalance?.value
      ? new Big(String(btcBalance?.value))
          .div(10 ** btcBalance.decimals)
          .toNumber()
      : 0
  ).format('0,0.000[0000]')

  const investmentOnBitmor = lendingList?.lendings.reduce(
    (acc, curr) =>
      new Big(acc || 0).plus(curr.lending_amount_approved || 0).toNumber(),
    0
  )

  const avgAPR = new Big(lendingStats?.baseAPR || 0)
    .plus(lendingStats?.loanAPR || 0)
    .div(2)
    .toNumber()

  const formattedAvgAPR = numeral(avgAPR).format('0.00%')

  const formattedEarningsOnBitmor = numeral(
    new Big(investmentOnBitmor || 0)
      .times(new Big(avgAPR).mul(100))
      .div(100)
      .toNumber()
  ).format('$0,0.00')

  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false)

  const handleTelegramConnect = () => {
    window.open(
      `${window.location.origin}/connect-telegram`,
      'connect-telegram',
      'width=500,height=500'
    )
  }

  return (
    <div
      className="container mt-10 grid h-full min-h-[calc(100vh-7rem)] w-full grid-cols-[280px_1fr] gap-5 pb-[60px] max-lg:grid-cols-1"
      id="invest-page"
    >
      <StyledModal
        isOpen={isTelegramModalOpen}
        onOpenChange={setIsTelegramModalOpen}
        iconSrc="/icons/telegram.png"
        title="Receive Notifications"
        description={
          <div>
            <p>
              Connect with Bitmor via Telegram to receive latest updates of your
              investments
            </p>
            <p className="text-default-a mt-2 text-sm">
              You&apos;ll be redirected to our telegram bot, please start a chat
              to start receiving notifications. we can&apos;t send you
              notifications if you don&apos;t start a chat with us.
            </p>
          </div>
        }
        primaryButtonText="Connect Telegram"
        primaryButtonProps={{
          onPress: handleTelegramConnect,
          color: 'secondary',
        }}
      />

      <div className="flex h-full w-full flex-col gap-4">
        <Card className="border-default-200/40 bg-default-100/80 min-h-fit w-full space-y-6 rounded-2xl border p-7 pb-[30px]">
          <div>
            <div className="text-default-a text-xs">Your USDC Balance</div>
            <div className="text-secondary mt-0.5 text-[28px] leading-tight font-bold">
              {formattedUsdcBalance}
              <span className="text-xl"> USDC</span>
            </div>
          </div>

          <div>
            <div className="text-default-a text-xs">Your BTC Balance</div>
            <div className="text-default-d mt-0.5 text-[28px] leading-tight font-bold">
              {formattedBtcBalance} <span className="text-xl">BTC</span>
            </div>
          </div>

          <div>
            <div className="text-default-a text-xs">
              Your Earnings on Bitmor
            </div>
            <div className="text-default-d mt-0.5 text-[28px] leading-tight font-bold">
              {formattedEarningsOnBitmor}
            </div>
          </div>
        </Card>

        <Card className="border-default-200/40 bg-default-100/80 h-full w-full rounded-2xl border p-4">
          <div className="border-default-200 text-default-d mb-[18px] border-b pb-3.5 pl-1 text-base font-medium">
            Bitmor Stats
          </div>

          <div className="mb-[18px]! space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-success-50 rounded-full p-[5px]">
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
              <div className="bg-primary-50 min-w-7 rounded-full p-[5px]">
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

          <div className="border-default-200 mt-auto! flex w-full border-t pt-4 pb-0.5">
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

      <Card className="border-default-200 bg-default-100 rounded-2xl border px-7 pt-[18px] pb-5 max-sm:px-4">
        <div className="border-default-200 text-default-d mb-7 border-b pb-4 pl-1 text-base font-medium">
          Investment Opportunities
        </div>

        <div className="mb-7! flex flex-wrap gap-[60px] px-2 max-sm:gap-6 max-sm:px-0">
          <div className="group border-default-300/50 bg-default-200/40 hover:border-default-300 hover:bg-default-200 w-[360px] rounded-xl border px-5 pt-[18px] pb-7 transition max-sm:w-full">
            <div className="border-default-200 text-default-d group-hover:border-default-300 mb-7 border-b pb-3.5 pl-1 text-base font-medium transition-[border-color]">
              Be a Lender on Bitmor
            </div>

            <div className="mb-10 px-3">
              <div className="text-default-a mb-1 text-lg">APR on USDC</div>
              <div className="text-default-e text-[32px] leading-tight font-bold">
                {formattedAvgAPR}
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

          <div className="group border-default-300/50 bg-default-200/40 hover:border-default-300 hover:bg-default-200 w-[360px] rounded-xl border px-5 pt-[18px] pb-7 transition max-sm:w-full">
            <div className="border-default-200 text-default-d group-hover:border-default-300 mb-7 flex items-center justify-between gap-2 border-b pb-3.5 pl-1 text-base font-medium transition-[border-color]">
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
              <div className="text-default-e text-[32px] leading-tight font-bold">
                0.3%
              </div>
            </div>

            {/* <Button
              className="text-default-d mx-1 w-full bg-[#dcdcdb] font-medium dark:bg-[#121213]"
              size="lg"
              color="default"
              as={NextLink}
              href="/invest/aave"
            >
              Start Investment on Aave
            </Button> */}
            <Button
              className="text-default-d pointer-events-auto mx-1 w-full cursor-not-allowed! font-medium"
              size="lg"
              color="default"
              as={NextLink}
              href="/invest/aave"
              isDisabled
            >
              Coming Soon
            </Button>
          </div>
        </div>

        <div className="border-default-300/50 bg-default-200/40 mx-2 mt-auto flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 max-sm:mx-0">
          <div className="bg-secondary-50 rounded-full p-[5px]">
            <LiaHourglassSolid className="text-secondary" size={18} />
          </div>

          <div className="text-default-a text-sm">
            We&apos;ll be adding more investment opportunities soon. Stay tuned
            to updates by connecting{' '}
            <Button
              variant="light"
              color="secondary"
              className="hover:text-secondary-300 data-[hover]:text-secondary-300 mx-auto h-auto w-auto min-w-0 p-0 text-sm font-medium underline hover:bg-transparent data-hover:bg-transparent"
              onPress={() => setIsTelegramModalOpen(true)}
            >
              Telegram
            </Button>
            .
          </div>
        </div>
      </Card>
    </div>
  )
}
