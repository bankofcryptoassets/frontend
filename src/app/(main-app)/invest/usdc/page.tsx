'use client'
import {
  Button,
  Card,
  Checkbox,
  cn,
  Link,
  NumberInput,
  Radio,
  RadioGroup,
  Slider,
  Tooltip,
} from '@heroui/react'
import Image from 'next/image'
import NextLink from 'next/link'
import { LuCircleDollarSign, LuInfo, LuTrendingUp } from 'react-icons/lu'
import { useState } from 'react'
import numeral from 'numeral'
import { toast } from 'sonner'
import { StyledModal } from '@/components/StyledModal'
import { useAccount, useBalance } from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/utils/constants'
import { useAuth } from '@/auth/useAuth'
import { useQuery } from '@tanstack/react-query'
import axios from '@/utils/axios'
import { LendingListData, LendingStats } from '@/types'
import Big from 'big.js'
import { useUSDCApproval } from '@/hooks/useUSDCApproval'
import { publicClient } from '@/auth/client'
import { sleep } from '@/utils/sleep'
import { useDepositUSDC } from '@/hooks/useDepositUSDC'
import { trackEvent } from '@/utils/trackEvent'
import { ConnectTelegramButton } from '@/components/ConnectTelegramButton'
import { ShareButtons } from '@/components/ShareButtons'

const DEFAULT_USDC_BALANCE = 1_000_000
const IS_USER_TELEGRAM_CONNECTED = false

export default function InvestUSDCPage() {
  const [usdcAmount, setUsdcAmount] = useState<number>(0)
  const [tncAccepted, setTncAccepted] = useState(false)
  const [reinvest, setReinvest] = useState(true)
  const [loading, setLoading] = useState(false)

  const { address } = useAccount()
  const { isAuth } = useAuth()
  const { data: usdcBalance } = useBalance({
    address,
    token: CONTRACT_ADDRESSES.USDC,
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

  const usdcBalanceValue = isAuth
    ? usdcBalance?.value
      ? new Big(String(usdcBalance.value))
          .div(10 ** usdcBalance.decimals)
          .round(0, Big.roundDown)
          .toNumber()
      : 0
    : DEFAULT_USDC_BALANCE

  const formattedUsdcBalance = numeral(usdcBalanceValue).format('0,0')

  const investmentOnBitmor = lendingList?.lendings.reduce(
    (acc, curr) =>
      new Big(acc || 0).plus(curr.lending_amount_approved || 0).toNumber(),
    0
  )

  const avgAPR = new Big(lendingStats?.baseAPR || 0)
    .plus(lendingStats?.loanAPR || 0)
    .div(2)
    .toNumber()

  const formattedEarningsOnBitmor = numeral(
    new Big(investmentOnBitmor || 0)
      .times(new Big(avgAPR).mul(100))
      .div(100)
      .toNumber()
  ).format('$0,0.00')

  const formattedGlobalInvested = numeral(
    lendingStats?.totalUSDInvested || 0
  ).format('0,0')

  const sliderInputInsufficient = usdcAmount > usdcBalanceValue

  const formattedEarningsBasedOnBaseAPR = numeral(
    new Big(usdcAmount || 0)
      .times(new Big(lendingStats?.baseAPR || 0).mul(100))
      .div(100)
      .toNumber()
  ).format('0,0.[00]')

  const formattedEarningsBasedOnLoanAPR = numeral(
    new Big(usdcAmount || 0)
      .times(new Big(lendingStats?.loanAPR || 0).mul(100))
      .div(100)
      .toNumber()
  ).format('0,0.[00]')

  const formattedEarningsBasedOnAvgAPR = numeral(
    new Big(usdcAmount || 0).times(new Big(avgAPR).mul(100)).div(100).toNumber()
  ).format('0,0.[00]')

  const continueButtonDisabled =
    !isAuth || !tncAccepted || sliderInputInsufficient || !usdcAmount

  const continueButtonTooltipContent = !isAuth
    ? 'Please connect your wallet to continue'
    : !tncAccepted
      ? 'Please accept the terms and conditions to continue'
      : sliderInputInsufficient
        ? 'Insufficient USDC balance'
        : !usdcAmount
          ? 'Please enter a valid amount'
          : undefined

  // steps
  // approve
  // if approve fails, show error modal
  // if approve success, show init tx modal
  // when waiting for init tx, show telegram modal
  // (show only if IS_USER_TELEGRAM_CONNECTED is false, and hide the modal if clicked on any action or close button or init tx is done)
  // if init tx success, show tx success modal
  // if init tx fails, show tx failed modal

  const { approveUSDC, approvalQuery } = useUSDCApproval()
  const { depositUSDC, depositQuery } = useDepositUSDC()

  const isLoading = loading || approvalQuery.isPending || depositQuery.isPending

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [isInitTxModalOpen, setIsInitTxModalOpen] = useState(false)
  const [isTxSuccessModalOpen, setIsTxSuccessModalOpen] = useState(false)
  const [isTxFailedModalOpen, setIsTxFailedModalOpen] = useState(false)
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false)

  const handleApproveUSDC = async () => {
    if (!isAuth || !address || !usdcAmount) {
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

  const handleDepositUSDC = async () => {
    if (!isAuth || !address || !usdcAmount) {
      toast.error('Something went wrong')
      return
    }

    setLoading(true)
    // setTimeout(
    //   () => !IS_USER_TELEGRAM_CONNECTED && setIsTelegramModalOpen(true),
    //   2000
    // )
    await depositUSDC(usdcAmount?.toString(), reinvest).then(async (hash) => {
      toast.promise(publicClient.waitForTransactionReceipt({ hash }), {
        dismissible: false,
        loading: 'Waiting for USDC deposit to be confirmed...',
        success: async (data) => {
          if (data?.status === 'reverted')
            throw new Error('USDC deposit transaction failed')

          await sleep(10000)
          setLoading(false)
          setIsInitTxModalOpen(false)
          setIsTelegramModalOpen(false)
          setIsTxSuccessModalOpen(true)
          trackEvent('investment_success', {
            wallet_address: address,
            usdc_amount: usdcAmount,
            reinvest: reinvest ? 'Yes' : 'No',
          })
          return `USDC deposited successfully!`
        },
        error: (err: Error) => {
          setLoading(false)
          setIsInitTxModalOpen(false)
          setIsTelegramModalOpen(false)
          setIsTxFailedModalOpen(true)
          trackEvent('investment_failed', {
            usdc_amount: usdcAmount,
            reinvest: reinvest ? 'Yes' : 'No',
            error: err.message || 'USDC deposit transaction failed',
          })
          return err.message || 'USDC deposit transaction failed'
        },
      })
    })
  }

  const handleTelegramConnect = () => {
    window.open(
      `${window.location.origin}/connect-telegram`,
      'connect-telegram',
      'width=500,height=500'
    )
  }

  const handleRetryTx = () => {
    if (!isAuth || !address || !usdcAmount) {
      toast.error('Something went wrong')
      return
    }
    setIsApproveModalOpen(false)
    setIsInitTxModalOpen(true)
    setIsTxSuccessModalOpen(false)
    setIsTxFailedModalOpen(false)
    setIsTelegramModalOpen(false)
  }

  // TODO: floating slider input position
  // const sliderInputPosition = useMemo(() => {
  //   const minValue = 0
  //   const maxValue = formattedUsdcBalance
  //   const percentage = (
  //     ((usdcAmount - minValue) / (maxValue - minValue)) *
  //     100
  //   ).toFixed(2)
  //   return Math.min(Math.max(15, Number(percentage) || 0), 75) + '%'
  // }, [usdcAmount, formattedUsdcBalance])

  return (
    <div
      className="container mt-10 grid h-full min-h-[calc(100vh-8.5rem)] w-full grid-cols-[280px_1fr] gap-5 pb-[60px] max-lg:grid-cols-1"
      id="invest-page"
    >
      <StyledModal
        isOpen={isApproveModalOpen}
        onOpenChange={setIsApproveModalOpen}
        iconSrc="/icons/approve.png"
        title="Approve Investment"
        description="Approve your USDC for investment"
        primaryButtonText="Approve"
        primaryButtonProps={{
          onPress: handleApproveUSDC,
          color: 'secondary',
          isDisabled: isLoading,
          isLoading,
        }}
        secondaryButtonText="Review Investment Details"
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
        description="Deposit your USDC to start earning interest"
        primaryButtonText="Initiate"
        primaryButtonProps={{
          onPress: handleDepositUSDC,
          color: 'secondary',
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

      <StyledModal
        isOpen={isTxSuccessModalOpen}
        onOpenChange={setIsTxSuccessModalOpen}
        iconSrc="/icons/success.png"
        title="Transaction Successful"
        description={
          <>
            <p>
              Congratulations! Your USDC has been deposited and you are now
              earning interest.
            </p>

            <div className="mt-6 -mb-10 flex w-full flex-col gap-2">
              <ShareButtons type="deposit" amount={usdcAmount} />
            </div>
          </>
        }
        primaryButtonText="View My Portfolio"
        primaryButtonProps={{
          as: NextLink,
          href: '/portfolio',
          color: 'secondary',
        }}
        showConfetti
        continueConfettiIndefinitely
      />

      <StyledModal
        isOpen={isTxFailedModalOpen}
        onOpenChange={setIsTxFailedModalOpen}
        iconSrc="/icons/failed.png"
        title="Transaction Failed"
        description="Oops! Something went wrong. Please try again."
        primaryButtonText="Retry"
        primaryButtonProps={{ onPress: handleRetryTx, color: 'secondary' }}
        secondaryButtonText="Exit"
        secondaryButtonProps={{
          onPress: () => {
            setIsTxFailedModalOpen(false)
          },
        }}
      />

      <div className="flex h-full w-full flex-col gap-4">
        <Card className="border-default-200/40 bg-default-100/80 min-h-fit w-full space-y-6 rounded-2xl border p-7 pb-[30px]">
          <div>
            <div className="text-default-a text-xs">Your USDC Investments</div>
            <div className="text-secondary mt-0.5 text-[28px] leading-tight font-bold">
              {numeral(investmentOnBitmor).format('0,0')}{' '}
              <span className="text-xl">USDC</span>
            </div>
          </div>

          <div>
            <div className="text-default-a text-xs">Interest Earned</div>
            <div className="text-default-d mt-0.5 text-[28px] leading-tight font-bold">
              {formattedEarningsOnBitmor}
            </div>
          </div>

          <div>
            <div className="text-default-a text-xs">Global Invested</div>
            <div className="text-default-d mt-0.5 text-[28px] leading-tight font-bold">
              {formattedGlobalInvested} <span className="text-xl">USDC</span>
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

        <ConnectTelegramButton onlyButton className="min-h-10 w-full" />
      </div>

      <Card className="border-default-200 bg-default-100 rounded-2xl border px-7 pt-[18px] pb-10 max-sm:px-4">
        <div className="border-default-200 text-default-d mb-7 border-b pb-4 pl-1 text-base font-medium">
          Investment
        </div>

        <div className="flex w-full justify-between gap-16 max-xl:flex-col">
          <div className="h-full w-full space-y-8 px-2 max-sm:px-0 sm:min-w-[400px]">
            <div className="border-default-300/50 rounded-xl border bg-[#eaeaee] p-5 pt-[18px] pb-4 max-sm:w-full dark:bg-[#1F1F1F]">
              {/* <div className="mb-16 pb-3.5 pl-1 text-base font-medium text-default-d"> */}
              <div className="text-default-d mb-4 pb-3.5 pl-1 text-base font-medium">
                How Much USDC?
              </div>

              <div className="mb-7 px-1">
                <div className="relative">
                  <div
                    // className="absolute -top-14 h-12"
                    // style={{
                    //   left: sliderInputPosition,
                    //   transform: 'translateX(-40%)',
                    // }}
                    className="mb-2 w-full"
                  >
                    {sliderInputInsufficient && (
                      <span className="text-danger absolute -top-5 left-1.5 mb-2 text-xs">
                        Insufficient Balance
                      </span>
                    )}
                    <NumberInput
                      hideStepper
                      isWheelDisabled
                      name="usdc"
                      size="sm"
                      endContent={
                        <span className="mt-auto mb-0.5 text-sm font-medium">
                          USDC
                        </span>
                      }
                      fullWidth
                      aria-label="USDC Amount"
                      minValue={0}
                      step={1}
                      formatOptions={{ maximumFractionDigits: 0 }}
                      classNames={{
                        inputWrapper: cn(
                          'bg-default-50',
                          sliderInputInsufficient && 'border border-danger'
                        ),
                        input: 'text-2xl font-bold',
                      }}
                      color={sliderInputInsufficient ? 'danger' : 'secondary'}
                      // className="w-36"
                      className="w-full"
                      value={usdcAmount}
                      onChange={(value) => {
                        if (typeof value === 'number') setUsdcAmount(value || 0)
                        else if (value?.target)
                          setUsdcAmount(
                            numeral(value?.target?.value || 0).value() || 0
                          )
                      }}
                    />
                  </div>

                  <Slider
                    className="w-full"
                    maxValue={usdcBalanceValue}
                    minValue={0}
                    step={1}
                    color={sliderInputInsufficient ? 'danger' : 'secondary'}
                    size="sm"
                    aria-label="USDC Amount"
                    value={usdcAmount}
                    onChange={(value) => {
                      if (typeof value === 'number') setUsdcAmount(value)
                      else if (value?.length === 1) setUsdcAmount(value[0])
                    }}
                    renderThumb={(props) => (
                      <div
                        {...props}
                        className="group relative top-1/2 cursor-grab rounded-full data-[dragging=true]:cursor-grabbing"
                      >
                        <span
                          className={cn(
                            'block size-5 rounded-full transition-transform group-data-[dragging=true]:scale-80',
                            sliderInputInsufficient
                              ? 'bg-danger'
                              : 'bg-secondary'
                          )}
                        />
                      </div>
                    )}
                  />
                </div>

                <div className="text-default-500 flex items-start justify-between font-medium">
                  <div className="text-default-a text-sm">0</div>
                  <div className="text-default-a flex flex-col items-end text-left text-sm">
                    <div className="text-left">
                      {numeral(formattedUsdcBalance).format('0,0')}{' '}
                      <span className="text-xs">USDC</span>
                    </div>
                    <div className="text-left text-xs text-[#65656B]">
                      Available Balance
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-default-300 border-t pt-4">
                <RadioGroup
                  label="Reinvest Earnings"
                  orientation="horizontal"
                  classNames={{
                    label: 'text-default-d text-sm',
                    wrapper: 'gap-5',
                  }}
                  color="secondary"
                  size="sm"
                  value={reinvest ? '1' : '0'}
                  onValueChange={(value) => setReinvest(value === '1')}
                >
                  <Radio
                    value="1"
                    classNames={{ label: 'text-default-d text-base' }}
                  >
                    Yes
                  </Radio>
                  <Radio
                    value="0"
                    classNames={{ label: 'text-default-d text-base' }}
                  >
                    No
                  </Radio>
                </RadioGroup>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-default-a flex items-center gap-2 text-xs">
                  Base APR (
                  {numeral(lendingStats?.baseAPR || 0).format('0.[00]%')}){' '}
                  <Tooltip content="lorem ipsum dolor sit amet">
                    <LuInfo className="text-default-600 pointer-events-auto cursor-pointer outline-none" />
                  </Tooltip>
                </div>
                <div className="text-secondary mt-0.5 text-2xl leading-tight font-bold">
                  {formattedEarningsBasedOnBaseAPR}{' '}
                  <span className="text-base">USDC</span>
                </div>
              </div>

              <div>
                <div className="text-default-a flex items-center gap-2 text-xs">
                  Loan APR (
                  {numeral(lendingStats?.loanAPR || 0).format('0.[00]%')}){' '}
                  <Tooltip content="lorem ipsum dolor sit amet">
                    <LuInfo className="text-default-600 pointer-events-auto cursor-pointer outline-none" />
                  </Tooltip>
                </div>
                <div className="text-secondary mt-0.5 text-2xl leading-tight font-bold">
                  {formattedEarningsBasedOnLoanAPR}{' '}
                  <span className="text-base">USDC</span>
                </div>
              </div>

              <div>
                <div className="text-default-a flex items-center gap-2 text-xs">
                  Historical APR{' '}
                  <Tooltip content="lorem ipsum dolor sit amet">
                    <LuInfo className="text-default-600 pointer-events-auto cursor-pointer outline-none" />
                  </Tooltip>
                </div>
                <div className="mt-0.5 text-2xl leading-tight font-bold text-[#65656B]">
                  {formattedEarningsBasedOnAvgAPR}{' '}
                  <span className="text-base">USDC</span>
                </div>
              </div>
            </div>

            <div>
              <Checkbox
                color="secondary"
                className="py-0 pr-0"
                classNames={{
                  base: 'items-start',
                  wrapper: 'mr-3 mt-1',
                  label: 'text-default-d text-sm',
                }}
                isSelected={tncAccepted}
                onValueChange={setTncAccepted}
              >
                I understand that my USDC is being deposited into Aave and I
                will earn interest on my USDC.
              </Checkbox>
            </div>

            <Tooltip
              content={continueButtonTooltipContent}
              isDisabled={!continueButtonDisabled}
              color="danger"
            >
              <Button
                className="w-full font-bold text-white data-[disabled=true]:pointer-events-auto data-[disabled=true]:cursor-not-allowed"
                size="lg"
                color="secondary"
                onPress={() => {
                  setIsApproveModalOpen(true)
                  trackEvent('clicked "Continue with the Investment"', {
                    wallet_address: address,
                    usdc_amount: usdcAmount,
                    reinvest: reinvest ? 'Yes' : 'No',
                  })
                }}
                isDisabled={continueButtonDisabled}
                isLoading={isLoading}
              >
                Continue with the Investment
              </Button>
            </Tooltip>
          </div>

          <div className="w-full max-sm:hidden sm:min-w-[360px]"></div>
        </div>
      </Card>
    </div>
  )
}
