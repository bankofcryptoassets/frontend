'use client'
import {
  Button,
  Card,
  Checkbox,
  cn,
  Link,
  NumberInput,
  Slider,
  Tooltip,
} from '@heroui/react'
import Image from 'next/image'
import NextLink from 'next/link'
import { LuCircleDollarSign, LuInfo, LuTrendingUp } from 'react-icons/lu'
import InlineSVG from 'react-inlinesvg'
import { useMemo, useState } from 'react'
import numeral from 'numeral'

const USER_BTC_BALANCE = 1.54

export default function InvestAavePage() {
  const [btcAmount, setBtcAmount] = useState<number>(0)

  const sliderInputPosition = useMemo(() => {
    const minValue = 0
    const maxValue = USER_BTC_BALANCE
    const percentage = (
      ((btcAmount - minValue) / (maxValue - minValue)) *
      100
    ).toFixed(2)
    return Math.min(Math.max(16, Number(percentage) ?? 0), 83) + '%'
  }, [btcAmount])

  const sliderInputInsufficient = useMemo(() => {
    return btcAmount > USER_BTC_BALANCE
  }, [btcAmount])

  return (
    <div
      className="container mt-10 grid h-full min-h-[calc(100vh-8.5rem)] w-full grid-cols-[280px_1fr] gap-5 pb-[60px] max-lg:grid-cols-1"
      id="invest-page"
    >
      <div className="flex h-full w-full flex-col gap-4">
        <Card className="border-default-200/40 bg-default-100/80 min-h-fit w-full space-y-6 rounded-2xl border p-7 pb-[30px]">
          <div className="border-default-200 text-default-d border-b pb-3.5 pl-1 text-base font-medium">
            <InlineSVG
              src="/icons/aave.svg"
              className="[&_*]:fill-default-d h-4 w-24"
            />
          </div>

          <div>
            <div className="text-default-a text-xs">Your BTC Balance</div>
            <div className="text-primary mt-0.5 text-[28px] leading-tight font-bold">
              1.54 <span className="text-xl">BTC</span>
            </div>
          </div>

          <div>
            <div className="text-default-a text-xs">APR on BTC</div>
            <div className="text-default-d mt-0.5 text-[28px] leading-tight font-bold">
              5%
            </div>
          </div>

          <div>
            <div className="text-default-a text-xs">
              Bitmor Investors on Aave
            </div>
            <div className="text-default-d mt-0.5 text-[28px] leading-tight font-bold">
              12,375
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

      <Card className="border-default-200 bg-default-100 rounded-2xl border px-7 pt-[18px] pb-5">
        <div className="border-default-200 text-default-d mb-7 border-b pb-4 pl-1 text-base font-medium">
          Investment on Aave
        </div>

        <div className="w-full space-y-8 px-2 sm:w-[456px]">
          <div className="border-default-300/50 rounded-xl border bg-[#eaeaee] p-5 pt-[18px] pb-4 max-sm:w-full dark:bg-[#1F1F1F]">
            <div className="text-default-d mb-16 pb-3.5 pl-1 text-base font-medium">
              How Much BTC?
            </div>

            <div className="mb-7 px-1">
              <div className="relative">
                <div
                  className="absolute -top-14 h-12"
                  style={{
                    left: sliderInputPosition,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {sliderInputInsufficient && (
                    <span className="text-danger absolute -top-5 left-1.5 mb-2 text-xs">
                      Insufficient Balance
                    </span>
                  )}
                  <NumberInput
                    hideStepper
                    isWheelDisabled
                    name="btc"
                    size="sm"
                    endContent={
                      <span className="mt-auto mb-0.5 text-base font-bold">
                        BTC
                      </span>
                    }
                    fullWidth
                    aria-label="BTC Amount"
                    minValue={0}
                    step={0.00000001}
                    formatOptions={{ maximumFractionDigits: 8 }}
                    classNames={{
                      inputWrapper: cn(
                        'bg-default-50',
                        sliderInputInsufficient && 'border border-danger'
                      ),
                      input: 'text-2xl font-bold',
                    }}
                    color={sliderInputInsufficient ? 'danger' : 'secondary'}
                    className="w-32"
                    value={btcAmount}
                    onChange={(value) => {
                      if (typeof value === 'number') setBtcAmount(value)
                      else if (value?.target)
                        setBtcAmount(
                          numeral(value?.target?.value ?? 0).value() || 0
                        )
                    }}
                  />
                </div>

                <Slider
                  className="w-full"
                  maxValue={USER_BTC_BALANCE}
                  minValue={0}
                  step={0.00000001}
                  color={sliderInputInsufficient ? 'danger' : 'secondary'}
                  size="sm"
                  aria-label="BTC Amount"
                  value={btcAmount}
                  onChange={(value) => {
                    if (typeof value === 'number') setBtcAmount(value)
                    else if (value?.length === 1) setBtcAmount(value[0])
                  }}
                  renderThumb={(props) => (
                    <div
                      {...props}
                      className="group relative top-1/2 cursor-grab rounded-full data-[dragging=true]:cursor-grabbing"
                    >
                      <span
                        className={cn(
                          'block size-5 rounded-full transition-transform group-data-[dragging=true]:scale-80',
                          sliderInputInsufficient ? 'bg-danger' : 'bg-secondary'
                        )}
                      />
                    </div>
                  )}
                />
              </div>

              <div className="text-default-500 flex items-center justify-between font-medium">
                <div className="text-sm">0</div>
                <div className="text-sm">
                  1.54 <span className="text-xs">BTC</span>
                </div>
              </div>
            </div>

            <div className="border-default-300 border-t pt-[18px]">
              <div className="text-default-a mb-1 flex items-center gap-2 text-lg">
                Expected Yield{' '}
                <Tooltip content="lorem ipsum dolor sit amet">
                  <LuInfo className="text-default-600 pointer-events-auto cursor-pointer outline-none" />
                </Tooltip>
              </div>
              <div className="text-default-e text-[32px] leading-tight font-bold">
                <div className="text-default-d mt-0.5 text-[32px] leading-tight font-bold">
                  0.12 <span className="text-2xl font-medium">BTC</span>{' '}
                  <span className="text-base font-normal">
                    (~12,000,000 sats)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Checkbox
            color="secondary"
            className="py-0 pr-0"
            classNames={{
              base: 'items-start',
              wrapper: 'mr-3 mt-1',
              label: 'text-default-d text-sm',
            }}
          >
            I understand that my Bitcoin is being deposited into Aave and I will
            earn interest on my full BTC. I will be able to release from Aave
            and invest in other opportunities at any point.
          </Checkbox>

          <Button
            className="w-full font-bold text-white"
            size="lg"
            color="secondary"
          >
            Continue with the Invesment
          </Button>
        </div>
      </Card>
    </div>
  )
}
