import {
  Button,
  Card,
  Checkbox,
  cn,
  NumberInput,
  Radio,
  RadioGroup,
  RadioProps,
  Slider,
  Tooltip,
} from '@heroui/react'
import { LuInfo } from 'react-icons/lu'
import numeral from 'numeral'
import { FaGear } from 'react-icons/fa6'
import { Dispatch, SetStateAction } from 'react'
import { LoanSummary } from '@/types'
import { INTEREST_RATE, TIME_PERIOD } from '@/utils/constants'
import { trackEvent } from '@/utils/trackEvent'

type BTCGoalProps = {
  address?: string
  setStep: Dispatch<SetStateAction<number>>
  usdcBalanceValue: number
  availableLoanAmountInBTC: number
  usdcAmount: number
  setUsdcAmount: Dispatch<SetStateAction<number>>
  btcAmount: number | undefined
  setBtcAmount: Dispatch<SetStateAction<number | undefined>>
  duration: string | undefined
  setDuration: Dispatch<SetStateAction<string | undefined>>
  interestRate: string
  setInterestRate: Dispatch<SetStateAction<string>>
  sliderInputInsufficient: boolean
  acceptAndcontinueButtonDisabled: boolean
  acceptAndcontinueButtonTooltipContent: string | undefined
  disableUSDCInput: boolean
  minUsdcAmount: number
  maxUsdcAmount: number
  loanSummary?: LoanSummary | null
  isLoanSummaryFetching: boolean
  refetchLoanSummary: (value: number) => Promise<{ data: any }>
}

export const BTCGoal = ({
  address,
  setStep,
  // usdcBalanceValue,
  availableLoanAmountInBTC,
  usdcAmount,
  setUsdcAmount,
  btcAmount,
  setBtcAmount,
  duration,
  setDuration,
  interestRate,
  setInterestRate,
  sliderInputInsufficient,
  acceptAndcontinueButtonDisabled,
  acceptAndcontinueButtonTooltipContent,
  disableUSDCInput,
  minUsdcAmount,
  maxUsdcAmount,
  loanSummary,
  isLoanSummaryFetching,
  refetchLoanSummary,
}: BTCGoalProps) => {
  return (
    <Card className="rounded-2xl border border-default-200 bg-default-100 px-7 pb-5 pt-[18px]">
      <div className="mb-7 border-b border-default-200 pb-4 pl-1 text-base font-medium text-default-d">
        Set BTC Goal
      </div>

      <div className="flex w-full justify-between gap-16 max-xl:flex-col">
        <div className="h-full w-full space-y-8 px-2 sm:min-w-[400px]">
          <NumberInput
            hideStepper
            isWheelDisabled
            placeholder="Enter BTC Goal"
            aria-label="BTC Goal"
            name="btc"
            size="sm"
            endContent={
              <Tooltip content="Enter how much Bitcoin (BTC) you want to borrow">
                <LuInfo className="pointer-events-auto outline-none" />
              </Tooltip>
            }
            fullWidth
            minValue={0}
            value={btcAmount}
            formatOptions={{ maximumFractionDigits: 8 }}
            onChange={(value) => {
              if (typeof value === 'number') {
                setBtcAmount(value || undefined)
                setUsdcAmount(0)
              } else if (value?.target) {
                setBtcAmount(
                  numeral(value?.target?.value || 0).value() || undefined
                )
                setUsdcAmount(0)
              }
            }}
            classNames={{
              inputWrapper:
                'dark:bg-[#1F1F1F] dark:data-[hover=true]:[#1F1F1F] text-default-600 border border-default-300/50',
            }}
            description={
              <span className="flex flex-col gap-1">
                <span className="text-sm text-default-a">
                  Available to be Borrowed:{' '}
                  <strong className="text-default-d">
                    {numeral(availableLoanAmountInBTC).format('0,0.000[0000]')}{' '}
                    BTC
                  </strong>
                </span>
              </span>
            }
          />

          <RadioGroup
            label={
              <span className="mb-1 flex items-center gap-2 text-sm font-medium text-default-d">
                <span>Select Loan Duration:</span>
                <Tooltip content="Select the duration of the loan">
                  <LuInfo className="cursor-pointer text-default-600 outline-none" />
                </Tooltip>
              </span>
            }
            orientation="horizontal"
            value={duration}
            onValueChange={(value) => {
              setDuration(value)
              setUsdcAmount(0)
            }}
          >
            {TIME_PERIOD.map((term) => (
              <CustomRadio key={term.value} value={term.value}>
                {term.label}
              </CustomRadio>
            ))}
          </RadioGroup>

          <div className="rounded-xl border border-default-300/50 bg-[#eaeaee] p-5 pb-4 pt-[18px] dark:bg-[#1F1F1F] max-sm:w-full">
            <div className="mb-4 flex items-center justify-between gap-2 pb-3.5 pl-1 text-base font-medium text-default-d">
              <span>Select Down Payment:</span>
              <Tooltip content="Enter how much down payment you want to make">
                <LuInfo className="cursor-pointer text-default-600 outline-none" />
              </Tooltip>
            </div>

            <div className="mb-4 px-1">
              <div className="relative">
                <div className="mb-2 w-full">
                  {sliderInputInsufficient && (
                    <span className="absolute -top-5 left-1.5 mb-2 text-xs text-danger">
                      Insufficient Balance
                    </span>
                  )}
                  <NumberInput
                    hideStepper
                    isWheelDisabled
                    name="usdc"
                    size="sm"
                    endContent={
                      <span className="mb-0.5 mt-auto text-base font-bold">
                        USDC
                      </span>
                    }
                    fullWidth
                    aria-label="USDC Amount"
                    minValue={minUsdcAmount || 0}
                    min={minUsdcAmount || 0}
                    step={0.01}
                    formatOptions={{ maximumFractionDigits: 2 }}
                    classNames={{
                      inputWrapper: cn(
                        'bg-default-50',
                        sliderInputInsufficient && 'border border-danger'
                      ),
                      input: 'text-2xl font-bold',
                    }}
                    color={sliderInputInsufficient ? 'danger' : 'primary'}
                    className="w-full"
                    value={usdcAmount}
                    onChange={(value) => {
                      if (typeof value === 'number') {
                        setUsdcAmount(value)
                        refetchLoanSummary(value)
                      } else if (Array.isArray(value) && value.length === 1) {
                        setUsdcAmount(value[0])
                        refetchLoanSummary(value[0])
                      }
                    }}
                    isDisabled={disableUSDCInput || isLoanSummaryFetching}
                  />
                </div>

                <Slider
                  className="w-full"
                  maxValue={maxUsdcAmount}
                  minValue={minUsdcAmount}
                  step={0.01}
                  color={sliderInputInsufficient ? 'danger' : 'primary'}
                  size="sm"
                  formatOptions={{ maximumFractionDigits: 2 }}
                  aria-label="USDC Amount"
                  value={usdcAmount}
                  onChange={(value) => {
                    if (typeof value === 'number') {
                      setUsdcAmount(value)
                      refetchLoanSummary(value)
                    } else if (Array.isArray(value) && value.length === 1) {
                      setUsdcAmount(value[0])
                      refetchLoanSummary(value[0])
                    }
                  }}
                  renderThumb={(props) => (
                    <div
                      {...props}
                      className="group relative top-1/2 cursor-grab rounded-full data-[dragging=true]:cursor-grabbing"
                    >
                      <span
                        className={cn(
                          'block size-5 rounded-full transition-transform group-data-[dragging=true]:scale-80',
                          sliderInputInsufficient ? 'bg-danger' : 'bg-primary'
                        )}
                      />
                    </div>
                  )}
                  isDisabled={disableUSDCInput || isLoanSummaryFetching}
                />
              </div>

              <div className="flex items-start justify-between font-medium text-default-500">
                <div className="text-sm text-default-a">
                  {numeral(minUsdcAmount).format('0,0.[00]')}
                </div>
                <div className="flex flex-col items-end text-left text-sm text-default-a">
                  <div className="text-left">
                    {numeral(maxUsdcAmount).format('0,0.[00]')}{' '}
                    <span className="text-xs">USDC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <RadioGroup
              label={
                <span className="mb-1 flex items-center gap-2 text-sm font-medium text-default-d">
                  <span>Interest Rate:</span>
                  <Tooltip content="Select the interest rate of the loan">
                    <LuInfo className="cursor-pointer text-default-600 outline-none" />
                  </Tooltip>
                </span>
              }
              orientation="horizontal"
              value={interestRate}
              onValueChange={(value) => {
                setInterestRate(value)
                setUsdcAmount(0)
              }}
            >
              {INTEREST_RATE.map((term) => (
                <CustomRadio key={term} value={term.toString()}>
                  {term}%
                </CustomRadio>
              ))}

              <div className="ml-2 flex items-center justify-center">
                <Tooltip content="Coming Soon">
                  <FaGear
                    className="cursor-not-allowed text-default-500 outline-none"
                    size={18}
                  />
                </Tooltip>
              </div>
            </RadioGroup>
          </div>

          <Tooltip content="Coming Soon">
            <Checkbox
              isSelected
              isDisabled
              className="!pointer-events-auto !mt-6 !cursor-not-allowed"
            >
              Opt in for Liquidation Insurance
            </Checkbox>
          </Tooltip>
        </div>

        <div className="w-full sm:min-w-[360px]">
          <div className="w-full rounded-xl border border-default-200 bg-[#eaeaee] p-5 dark:bg-[#1F1F22]">
            <div className="mb-5 border-b border-default-300 px-1 pb-3.5 text-base font-medium text-default-d">
              Loan Breakdown
            </div>

            <div className="space-y-3 px-1 text-sm text-default-a">
              <div className="flex items-center justify-between gap-2">
                <span>Total Paid</span>
                <span className="text-right font-bold text-default-d">
                  {formatUSDC(loanSummary?.totalPayment)} USDC
                </span>
              </div>
              <div className="relative ml-7 flex items-center justify-between gap-2">
                <span className="absolute -left-6 -top-2.5 size-5 border-b border-l border-default-300" />
                <span>Principal</span>
                <span className="text-right">
                  {formatUSDC(loanSummary?.principal)} USDC
                </span>
              </div>
              <div className="relative ml-7 flex items-center justify-between gap-2">
                <span className="absolute -left-6 -top-6 size-5 h-9 border-b border-l border-default-300" />
                <span>Interest ({loanSummary?.interestRate}%)</span>
                <span className="text-right">
                  {formatUSDC(loanSummary?.totalInterest)} USDC
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>Loan Origination Fees (1%)</span>
                <span className="text-right font-bold text-default-d">
                  {formatUSDC(loanSummary?.openingFee)} USDC
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>Down Payment + Fees</span>
                <span className="text-right font-bold text-default-d">
                  {formatUSDC(loanSummary?.firstTransaction?.amountSent)} USDC
                </span>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-default-300 px-1 pt-4 text-base font-medium text-default-d">
              <span>Monthly Payment</span>
              <span className="text-right text-xl font-bold text-primary">
                {formatUSDC(loanSummary?.monthlyPayment)} USDC
              </span>
            </div>
          </div>

          <div className="mt-7">
            <Tooltip
              content={acceptAndcontinueButtonTooltipContent}
              isDisabled={!acceptAndcontinueButtonDisabled}
              color="danger"
            >
              <Button
                className="w-full font-bold data-[disabled=true]:pointer-events-auto data-[disabled=true]:cursor-not-allowed"
                size="lg"
                color="primary"
                onPress={() => {
                  setStep(1)
                  trackEvent('clicked "Accept and Continue" on "BTC Goal"', {
                    wallet_address: address,
                    btc_amount: btcAmount,
                    loan_term: duration,
                    interest_rate: interestRate,
                    usdc_amount: usdcAmount,
                  })
                }}
                isDisabled={acceptAndcontinueButtonDisabled}
              >
                Accept and Continue
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </Card>
  )
}

export const CustomRadio = (props: RadioProps) => {
  const { children, className, ...otherProps } = props

  return (
    <Radio
      {...otherProps}
      className={cn('group', className)}
      classNames={{
        base: 'm-0 rounded-lg bg-default-200 transition hover:bg-primary/5 data-[selected=true]:bg-primary/5 border border-default-300/50 data-[selected=true]:border-primary/50',
        wrapper: 'hidden',
        labelWrapper:
          'ml-0 ms-0 px-3 [&>span]:group-data-[selected=true]:text-primary [&>span]:text-default-a [&>span]:font-medium [&>span]:group-data-[selected=true]:font-semibold',
      }}
    >
      {children}
    </Radio>
  )
}

const formatUSDC = (amount: number | string | undefined) => {
  return numeral(amount).format('0,0.[00]')
}
