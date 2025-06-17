import {
  Button,
  Card,
  cn,
  NumberInput,
  Radio,
  RadioGroup,
  RadioProps,
  Slider,
  Tooltip,
} from '@heroui/react'
import { LuInfo } from 'react-icons/lu'
import { useMemo, useState } from 'react'
import numeral from 'numeral'
import { FaGear } from 'react-icons/fa6'

type BTCGoalProps = {
  setStep: (step: number) => void
}

const USER_USDC_BALANCE = 12932
const TIME_PERIOD = ['3', '5', '7']
const INTEREST_RATE = ['11']

export const BTCGoal = ({ setStep }: BTCGoalProps) => {
  const [usdcAmount, setUsdcAmount] = useState<number>(0)
  const [btcAmount, setBtcAmount] = useState<number | undefined>(undefined)
  const [duration, setDuration] = useState<string | undefined>(undefined)
  const [interestRate, setInterestRate] = useState<string>('11')
  const availableLoanAmountInBTC = 2.46

  const sliderInputPosition = useMemo(() => {
    const minValue = 0
    const maxValue = USER_USDC_BALANCE
    const percentage = (
      ((usdcAmount - minValue) / (maxValue - minValue)) *
      100
    ).toFixed(2)
    return Math.min(Math.max(16, Number(percentage) ?? 0), 83) + '%'
  }, [usdcAmount])

  const sliderInputInsufficient = useMemo(() => {
    return usdcAmount > USER_USDC_BALANCE
  }, [usdcAmount])

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
            formatOptions={{
              maximumFractionDigits: 8,
            }}
            onChange={(value) => {
              if (typeof value === 'number') setBtcAmount(value)
              else if (value?.target)
                setBtcAmount(
                  numeral(value?.target?.value ?? 0).value() || undefined
                )
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
                    {availableLoanAmountInBTC ?? 0} BTC
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
            onValueChange={setDuration}
          >
            {TIME_PERIOD.map((term) => (
              <CustomRadio key={term} value={term.toString()}>
                {term} Years
              </CustomRadio>
            ))}
          </RadioGroup>

          <div className="rounded-xl border border-default-300/50 bg-[#eaeaee] p-5 pb-4 pt-[18px] dark:bg-[#1F1F1F] max-sm:w-full">
            <div className="mb-16 flex items-center justify-between gap-2 pb-3.5 pl-1 text-base font-medium text-default-d">
              <span>Select Down Payment:</span>
              <Tooltip content="Enter how much down payment you want to make">
                <LuInfo className="cursor-pointer text-default-600 outline-none" />
              </Tooltip>
            </div>

            <div className="mb-4 px-1">
              <div className="relative">
                <div
                  className="absolute -top-14 h-12"
                  style={{
                    left: sliderInputPosition,
                    transform: 'translateX(-50%)',
                  }}
                >
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
                    minValue={0}
                    step={0.1}
                    formatOptions={{ maximumFractionDigits: 8 }}
                    classNames={{
                      inputWrapper: cn(
                        'bg-default-50',
                        sliderInputInsufficient && 'border border-danger'
                      ),
                      input: 'text-2xl font-bold',
                    }}
                    color={sliderInputInsufficient ? 'danger' : 'primary'}
                    className="w-32"
                    value={usdcAmount}
                    onChange={(value) => {
                      if (typeof value === 'number') setUsdcAmount(value)
                      else if (value?.target)
                        setUsdcAmount(
                          numeral(value?.target?.value ?? 0).value() || 0
                        )
                    }}
                  />
                </div>

                <Slider
                  className="w-full"
                  maxValue={USER_USDC_BALANCE}
                  minValue={0}
                  step={0.1}
                  color={sliderInputInsufficient ? 'danger' : 'primary'}
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
                          sliderInputInsufficient ? 'bg-danger' : 'bg-primary'
                        )}
                      />
                    </div>
                  )}
                />
              </div>

              <div className="flex items-start justify-between font-medium text-default-500">
                <div className="text-sm text-default-a">0</div>
                <div className="flex flex-col items-end text-left text-sm text-default-a">
                  <div className="text-left">
                    12,932 <span className="text-xs">USDC</span>
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
              onValueChange={setInterestRate}
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
                  20,000 USDC
                </span>
              </div>
              <div className="relative ml-7 flex items-center justify-between gap-2">
                <span className="absolute -left-6 -top-2.5 size-5 border-b border-l border-default-300" />
                <span>Principal</span>
                <span className="text-right">5,000 USDC</span>
              </div>
              <div className="relative ml-7 flex items-center justify-between gap-2">
                <span className="absolute -left-6 -top-6 size-5 h-9 border-b border-l border-default-300" />
                <span>Interest (11%)</span>
                <span className="text-right">2,200 USDC</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>Loan Origination Fees (1%)</span>
                <span className="text-right font-bold text-default-d">
                  100 USDC
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>Down Payment + Fees</span>
                <span className="text-right font-bold text-default-d">
                  1,000 USDC
                </span>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-default-300 px-1 pt-4 text-base font-medium text-default-d">
              <span>Monthly Payment</span>
              <span className="text-right text-xl font-bold text-primary">
                27,300 USDC
              </span>
            </div>
          </div>

          <div className="mt-7">
            <Button
              className="w-full font-bold"
              size="lg"
              color="primary"
              onPress={() => setStep(1)}
            >
              Accept and Continue
            </Button>
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
