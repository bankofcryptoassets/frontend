'use client'
import { Card, Link, Tooltip } from '@heroui/react'
import Image from 'next/image'
import NextLink from 'next/link'
import { LuInfo } from 'react-icons/lu'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPagination,
} from '@/components/Carousel'
import Autoplay from 'embla-carousel-autoplay'
import { useEffect, useState } from 'react'
import { StyledModal } from '@/components/StyledModal'
import { BTCGoal } from '@/components/borrow/BTCGoal'
import { LoanConditions } from '@/components/borrow/LoanConditions'
import { CONTRACT_ADDRESSES } from '@/utils/constants'
import { useAuth } from '@/auth/useAuth'
import { useAccount, useBalance } from 'wagmi'
import numeral from 'numeral'
import Big from 'big.js'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { LoanAvailabilityType, LoanSummaryResponse } from '@/types'
import axios from '@/utils/axios'
import { useDebounceValue, useLocalStorage } from 'usehooks-ts'
import { toast } from 'sonner'
import { useUSDCApproval } from '@/hooks/useUSDCApproval'
import { publicClient } from '@/auth/client'
import { sleep } from '@/utils/sleep'
import { useLoanBTC } from '@/hooks/useLoanBTC'

const DEFAULT_USDC_BALANCE = 1_000_000
const IS_USER_TELEGRAM_CONNECTED = false
const TIME_PERIOD = [
  { value: '36', label: '3 Years', y: 3 },
  { value: '60', label: '5 Years', y: 5 },
  { value: '84', label: '7 Years', y: 7 },
]
const INTEREST_RATE = ['8']

export default function BorrowPage() {
  const [step, setStep] = useState(0)
  const [usdcAmount, setUsdcAmount] = useLocalStorage<number>('usdc-amount', 0)
  const [btcAmount, setBtcAmount] = useLocalStorage<number | undefined>(
    'btc-amount',
    undefined
  )
  const [duration, setDuration] = useLocalStorage<string | undefined>(
    'duration',
    undefined
  )
  const [interestRate, setInterestRate] = useLocalStorage<string>(
    'interest-rate',
    INTEREST_RATE[0]
  )
  const [debouncedPayload] = useDebounceValue(
    {
      amount: btcAmount,
      term: Number(duration),
      interestRate: Number(interestRate),
      ...(usdcAmount && { downPaymentAmount: usdcAmount }),
    },
    500,
    {
      equalityFn: (left, right) =>
        JSON.stringify(left) === JSON.stringify(right),
    }
  )
  const [isConditionOpen, setIsConditionOpen] = useState<number | undefined>()
  const [conditions, setConditions] = useState<{
    first: boolean
    second: boolean
    third: boolean
    fourth: boolean
  }>({ first: false, second: false, third: false, fourth: false })
  const [loading, setLoading] = useState(false)
  const { isAuth } = useAuth()
  const { address } = useAccount()
  const { data: btcBalance } = useBalance({
    address,
    token: CONTRACT_ADDRESSES.BTC,
    query: { enabled: !!address && !!isAuth },
  })
  const { data: usdcBalance } = useBalance({
    address,
    token: CONTRACT_ADDRESSES.USDC,
    query: { enabled: !!address && !!isAuth },
  })
  const { data: borrowStats } = useQuery({
    queryKey: ['/initialisation/loanavailability'],
    queryFn: () =>
      axios.get<LoanAvailabilityType>(`/initialisation/loanavailability`),
  })
  const {
    data: loanSummary,
    isLoading: isLoanSummaryLoading,
    isFetching: isLoanSummaryFetching,
  } = useQuery({
    queryKey: ['/initialisation/loansummary', debouncedPayload],
    enabled:
      !!debouncedPayload?.amount &&
      !!debouncedPayload?.term &&
      !!debouncedPayload?.interestRate,
    queryFn: ({ signal }) =>
      axios.post<LoanSummaryResponse>(
        `/initialisation/loansummary`,
        debouncedPayload,
        { headers: { 'Content-Type': 'application/json' }, signal }
      ),
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    if (loanSummary?.data?.data?.loanSummary) {
      setUsdcAmount(Number(loanSummary?.data?.data?.loanSummary?.downPayment))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanSummary])

  const formattedBtcBalance = numeral(
    btcBalance?.value
      ? new Big(String(btcBalance?.value))
          .div(10 ** btcBalance.decimals)
          .toNumber()
      : 0
  ).format('0,0.000[0000]')

  const usdcBalanceValue = isAuth
    ? usdcBalance?.value
      ? new Big(String(usdcBalance.value))
          .div(10 ** usdcBalance.decimals)
          .round(0, Big.roundDown)
          .toNumber()
      : 0
    : DEFAULT_USDC_BALANCE

  const formattedBtcBorrowers = numeral(
    borrowStats?.data?.data?.btcBorrowers || 0
  ).format('0,0')

  const formattedTotalLoanInBTC = numeral(
    borrowStats?.data?.data?.totalLoanInBTC || 0
  ).format('0,0.000[0000]')

  const fgi = borrowStats?.data?.data?.fgi

  const sliderInputInsufficient = usdcAmount > usdcBalanceValue

  const minUsdcAmount =
    Number(loanSummary?.data?.data?.loanSummary?.loanAmount) * 0.2
  const maxUsdcAmount = Math.min(
    usdcBalanceValue,
    Number(loanSummary?.data?.data?.loanSummary?.loanAmount) * 0.5
  )

  const acceptAndContinueButtonDisabled =
    !isAuth ||
    !btcAmount ||
    !duration ||
    !interestRate ||
    !usdcAmount ||
    sliderInputInsufficient

  const acceptAndContinueButtonTooltipContent = !isAuth
    ? 'Please connect your wallet to continue'
    : !btcAmount
      ? 'Please enter a valid btc amount'
      : !duration
        ? 'Please select a duration'
        : !interestRate
          ? 'Please select an interest rate'
          : !usdcAmount
            ? 'Please enter a valid down payment amount'
            : sliderInputInsufficient
              ? 'Insufficient USDC balance'
              : undefined

  const continueButtonDisabled =
    acceptAndContinueButtonDisabled ||
    !conditions.first ||
    !conditions.second ||
    !conditions.third ||
    !conditions.fourth

  const continueButtonTooltipContent = acceptAndContinueButtonDisabled
    ? acceptAndContinueButtonTooltipContent
    : continueButtonDisabled
      ? 'Please accept all the conditions to continue'
      : undefined

  const { approveUSDC, approvalQuery } = useUSDCApproval()
  const { loanBTC, loanBTCQuery } = useLoanBTC()

  const isLoading =
    loading ||
    approvalQuery.isPending ||
    isLoanSummaryLoading ||
    loanBTCQuery.isPending
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [isInitTxModalOpen, setIsInitTxModalOpen] = useState(false)
  const [isTxSuccessModalOpen, setIsTxSuccessModalOpen] = useState(false)
  const [isTxFailedModalOpen, setIsTxFailedModalOpen] = useState(false)
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false)

  const handleApproveUSDC = async () => {
    if (continueButtonDisabled) {
      toast.error('Something went wrong')
      return
    }
    setLoading(true)
    await approveUSDC(usdcAmount?.toString()).then(async (hash) => {
      toast.promise(publicClient.waitForTransactionReceipt({ hash }), {
        dismissible: false,
        loading: 'Waiting for USDC approval to be confirmed...',
        success: async (data) => {
          if (data?.status === 'reverted')
            throw new Error('USDC approval transaction failed')

          await sleep(10000)
          setLoading(false)
          setIsApproveModalOpen(false)
          setIsInitTxModalOpen(true)
          return `USDC approved successfully!`
        },
        error: (err: Error) => {
          return err.message || 'USDC approval transaction failed'
        },
      })
    })
  }

  const handleLoan = async () => {
    if (continueButtonDisabled) {
      toast.error('Something went wrong')
      setIsInitTxModalOpen(false)
      return
    }

    setLoading(true)
    // setTimeout(
    //   () => !IS_USER_TELEGRAM_CONNECTED && setIsTelegramModalOpen(true),
    //   2000
    // )
    await loanBTC(
      btcAmount?.toString(),
      duration,
      interestRate,
      loanSummary?.data?.data?.loanSummary?.basisPoints?.toString() || '0'
    ).then(async (hash) => {
      toast.promise(publicClient.waitForTransactionReceipt({ hash }), {
        dismissible: false,
        loading: 'Waiting for loan transaction to be confirmed...',
        success: async (data) => {
          if (data?.status === 'reverted')
            throw new Error('Loan transaction failed')

          await sleep(10000)
          setLoading(false)
          setIsTelegramModalOpen(true)
          setIsInitTxModalOpen(false)
          setIsTxSuccessModalOpen(true)
          return `Loan approved successfully!`
        },
        error: (err: Error) => {
          setLoading(false)
          setIsTelegramModalOpen(false)
          setIsInitTxModalOpen(false)
          setIsTxFailedModalOpen(true)
          return err.message || 'Loan transaction failed'
        },
      })
    })
  }

  const handleTelegramConnect = () => {
    if (IS_USER_TELEGRAM_CONNECTED) {
      setIsTelegramModalOpen(false)
      return
    }
  }

  const handleRetryTx = () => {
    if (continueButtonDisabled) {
      toast.error('Something went wrong')
      return
    }
    setIsApproveModalOpen(false)
    setIsInitTxModalOpen(true)
    setIsTxSuccessModalOpen(false)
    setIsTxFailedModalOpen(false)
    setIsTelegramModalOpen(false)
  }

  return (
    <div
      className="container mt-10 grid h-full min-h-[calc(100vh-7rem)] w-full grid-cols-[280px_1fr] gap-5 pb-[60px] max-lg:grid-cols-1"
      id="borrow-page"
    >
      <StyledModal
        isOpen={isApproveModalOpen}
        onOpenChange={setIsApproveModalOpen}
        iconSrc="/icons/approve.png"
        title="Approve Investment"
        description="Approve your USDC to get started"
        primaryButtonText="Approve"
        primaryButtonProps={{
          onPress: handleApproveUSDC,
          color: 'primary',
          isDisabled: isLoading,
          isLoading,
        }}
        secondaryButtonText="Review Transaction Details"
        secondaryButtonProps={{
          onPress: () => {
            setIsApproveModalOpen(false)
          },
          isDisabled: isLoading,
        }}
        hideCloseButton
        isDismissable={!isLoading}
        isKeyboardDismissDisabled={isLoading}
      />

      <StyledModal
        isOpen={isInitTxModalOpen}
        onOpenChange={setIsInitTxModalOpen}
        iconSrc="/icons/initiate.png"
        title="Initiate Transaction"
        description="Approve loan transaction to get your bitcoin"
        primaryButtonText="Initiate"
        primaryButtonProps={{
          onPress: handleLoan,
          color: 'primary',
          isDisabled: isLoading,
          isLoading,
        }}
        hideCloseButton
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      />

      <StyledModal
        isOpen={isTelegramModalOpen}
        onOpenChange={setIsTelegramModalOpen}
        iconSrc="/icons/telegram.png"
        title="Receive Notifications"
        description="Connect with Bitmor via Telegram to receive latest updates of your loan"
        primaryButtonText="Connect Telegram"
        primaryButtonProps={{
          onPress: handleTelegramConnect,
          color: 'primary',
        }}
      />

      <StyledModal
        isOpen={isTxSuccessModalOpen}
        onOpenChange={setIsTxSuccessModalOpen}
        iconSrc="/icons/success.png"
        title="Transaction Successful"
        description="Congratulations! Your loan has been approved successfully."
        primaryButtonText="View My Portfolio"
        primaryButtonProps={{
          as: NextLink,
          href: '/portfolio',
          color: 'primary',
        }}
      />

      <StyledModal
        isOpen={isTxFailedModalOpen}
        onOpenChange={setIsTxFailedModalOpen}
        iconSrc="/icons/failed.png"
        title="Transaction Failed"
        description="Oops! Something went wrong. Please try again."
        primaryButtonText="Retry"
        primaryButtonProps={{
          onPress: handleRetryTx,
          color: 'primary',
        }}
        secondaryButtonText="Exit"
        secondaryButtonProps={{
          onPress: () => {
            setIsTxFailedModalOpen(false)
          },
        }}
      />

      <div className="flex h-full w-full flex-col gap-4">
        <Card className="min-h-fit w-full space-y-6 rounded-2xl border border-default-200/40 bg-default-100/80 p-7 pb-[30px]">
          <div>
            <div className="text-xs text-default-a">Your BTC Balance</div>
            <div className="mt-0.5 text-[28px] font-bold leading-tight text-primary">
              {formattedBtcBalance} <span className="text-xl">BTC</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-default-a">
              BTC Borrowers on Bitmor
            </div>
            <div className="mt-0.5 text-[28px] font-bold leading-tight text-default-d">
              {formattedBtcBorrowers}
            </div>
          </div>

          <div>
            <div className="text-xs text-default-a">BTC Borrowed on Bitmor</div>
            <div className="mt-0.5 text-[28px] font-bold leading-tight text-default-d">
              {formattedTotalLoanInBTC} <span className="text-xl">BTC</span>
            </div>
          </div>
        </Card>

        <Card className="min-h-fit w-full rounded-2xl border border-default-200/40 bg-default-100/80 p-4 pb-6">
          <div className="mb-5 flex items-center justify-between border-b border-default-200 pb-3.5 pl-1 text-base font-medium text-default-d">
            <span>Fear and Greed Index</span>
            <Tooltip content="Fear and Greed Index">
              <LuInfo size={14} className="cursor-pointer text-default-600" />
            </Tooltip>
          </div>

          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-[32px] font-bold leading-tight text-default-d">
                {fgi?.value}
              </span>
              <span className="text-sm font-medium leading-tight text-default-a">
                {fgi?.valueText}
              </span>
            </div>

            <div className="h-12 w-px bg-default-300" />

            <div>
              <Image
                src="/extras/fear-and-greed.png"
                alt="Fear and Greed Index"
                width={120}
                height={62}
              />
            </div>
          </div>
        </Card>

        <Card className="h-full w-full rounded-2xl border border-default-200/40 bg-default-100/80 p-4">
          <div className="mb-[18px] border-b border-default-200 pb-3.5 pl-1 text-base font-medium text-default-d">
            Bitmor Way
          </div>

          <Carousel
            opts={{ loop: true }}
            plugins={[Autoplay({ delay: 4000 })]}
            className="mb-4"
          >
            <CarouselContent>
              <CarouselItem>
                <div className="flex items-center gap-3 max-lg:justify-center">
                  <div className="rounded-full bg-success-50 p-[5px]">
                    <Image
                      src="/icons/shield-money.png"
                      alt="Shield Money Icon"
                      width={18}
                      height={18}
                      className="size-[18px] min-w-[18px]"
                    />
                  </div>
                  <div className="text-sm text-default-d">
                    Transparent monthly
                    <br />
                    payments, no hidden fees
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="flex items-center gap-3 max-lg:justify-center">
                  <div className="rounded-full bg-[#2C1542]/10 p-[5px] dark:bg-[#2C1542]">
                    <Image
                      src="/icons/up-down.png"
                      alt="Up Down Icon"
                      width={18}
                      height={18}
                      className="size-[18px] min-w-[18px]"
                    />
                  </div>
                  <div className="text-sm text-default-d">
                    Failed to Pay a month?
                    <br />
                    Micro Liquidation.
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="flex items-center gap-3 max-lg:justify-center">
                  <div className="min-w-7 rounded-full bg-primary-50 p-[5px]">
                    <Image
                      src="/icons/btc-outline.svg"
                      alt="Bitcoin"
                      width={18}
                      height={18}
                      className="size-[18px] min-w-[18px]"
                    />
                  </div>
                  <div className="text-sm text-default-d">
                    Yield on 100% BTC from
                    <br />
                    Day 1
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="flex items-center gap-3 max-lg:justify-center">
                  <div className="rounded-full bg-secondary-50 p-[5px]">
                    <Image
                      src="/icons/clock.png"
                      alt="Clock Icon"
                      width={18}
                      height={18}
                      className="size-[18px] min-w-[18px]"
                    />
                  </div>
                  <div className="text-sm text-default-d">
                    No complex paperwork.
                    <br />
                    Own Bitcoin in minutes
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPagination />
          </Carousel>

          <div className="!mt-auto flex w-full border-t border-default-200 pb-0.5 pt-4">
            <Link
              as={NextLink}
              href="/"
              color="primary"
              className="mx-auto text-sm font-medium"
            >
              Talk to a Representative
            </Link>
          </div>
        </Card>
      </div>

      {step === 0 && (
        <BTCGoal
          setStep={setStep}
          usdcBalanceValue={usdcBalanceValue}
          availableLoanAmountInBTC={
            borrowStats?.data?.data?.availableLoanAmountInBTC || 0
          }
          usdcAmount={usdcAmount}
          setUsdcAmount={setUsdcAmount}
          btcAmount={btcAmount}
          setBtcAmount={setBtcAmount}
          duration={duration}
          setDuration={setDuration}
          interestRate={interestRate}
          setInterestRate={setInterestRate}
          TIME_PERIOD={TIME_PERIOD}
          INTEREST_RATE={INTEREST_RATE}
          sliderInputInsufficient={sliderInputInsufficient}
          acceptAndcontinueButtonDisabled={acceptAndContinueButtonDisabled}
          acceptAndcontinueButtonTooltipContent={
            acceptAndContinueButtonTooltipContent
          }
          disableUSDCInput={!loanSummary}
          minUsdcAmount={minUsdcAmount}
          maxUsdcAmount={maxUsdcAmount}
          loanSummary={loanSummary?.data?.data?.loanSummary || undefined}
          isLoanSummaryFetching={isLoanSummaryFetching}
        />
      )}
      {step === 1 && (
        <LoanConditions
          setStep={setStep}
          isOpen={isConditionOpen}
          setIsOpen={setIsConditionOpen}
          conditions={conditions}
          setConditions={setConditions}
          setIsApproveModalOpen={setIsApproveModalOpen}
          isLoading={isLoading}
          continueButtonDisabled={continueButtonDisabled}
          continueButtonTooltipContent={continueButtonTooltipContent}
          loanSummary={loanSummary?.data?.data?.loanSummary || undefined}
          TIME_PERIOD={TIME_PERIOD}
        />
      )}
    </div>
  )
}
