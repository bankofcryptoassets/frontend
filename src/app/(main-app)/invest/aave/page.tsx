'use client'
import {
  Button,
  Card,
  Checkbox,
  Link,
  NumberInput,
  Slider,
  Tooltip,
} from '@heroui/react'
import Image from 'next/image'
import NextLink from 'next/link'
import { LuCircleDollarSign, LuInfo, LuTrendingUp } from 'react-icons/lu'
import InlineSVG from 'react-inlinesvg'
import { Fragment, useState } from 'react'
import numeral from 'numeral'

export default function InvestAavePage() {
  const [btcAmount, setBtcAmount] = useState<number>(0)

  return (
    <div
      className="container mt-10 grid h-full min-h-[calc(100vh-7rem)] w-full grid-cols-[280px_1fr] gap-5 pb-[60px] max-lg:grid-cols-1"
      id="invest-page"
    >
      <div className="flex h-full w-full flex-col gap-4">
        <Card className="min-h-fit w-full space-y-6 rounded-2xl border border-default-200/40 bg-default-100/80 p-7 pb-[30px]">
          <div className="text-default-d border-b border-default-200 pb-3.5 pl-1 text-base font-medium">
            <InlineSVG
              src="/icons/aave.svg"
              className="[&_*]:fill-default-d h-4 w-24"
            />
          </div>

          <div>
            <div className="text-default-a text-xs">Your BTC Balance</div>
            <div className="mt-0.5 text-[28px] font-bold leading-tight text-primary">
              1.54 <span className="text-xl">BTC</span>
            </div>
          </div>

          <div>
            <div className="text-default-a text-xs">APR on BTC</div>
            <div className="text-default-d mt-0.5 text-[28px] font-bold leading-tight">
              5%
            </div>
          </div>

          <div>
            <div className="text-default-a text-xs">
              Bitmor Investors on Aave
            </div>
            <div className="text-default-d mt-0.5 text-[28px] font-bold leading-tight">
              12,375
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
          Investment on Aave
        </div>

        <div className="w-[456px] space-y-8 px-2">
          <div className="rounded-xl border border-default-300/50 bg-[#e0e0e0] p-5 pb-4 pt-[18px] dark:bg-[#1F1F1F] max-sm:w-full">
            <div className="text-default-d mb-16 pb-3.5 pl-1 text-base font-medium">
              How Much BTC?
            </div>

            <div className="mb-7 px-1">
              <Slider
                className="w-full"
                maxValue={1.54}
                minValue={0}
                step={0.00000001}
                color="secondary"
                size="sm"
                value={btcAmount}
                onChange={(value) => {
                  if (typeof value === 'number') setBtcAmount(value)
                  else if (value?.length === 1) setBtcAmount(value[0])
                }}
                renderThumb={(props) => (
                  <Fragment>
                    <div
                      className="absolute -top-11 left-1/2 h-12 -translate-x-1/2"
                      style={props.style}
                    >
                      <NumberInput
                        hideStepper
                        isWheelDisabled
                        name="btc"
                        size="sm"
                        endContent={
                          <span className="mb-0.5 mt-auto text-base font-bold">
                            BTC
                          </span>
                        }
                        fullWidth
                        minValue={0}
                        maxValue={1.54}
                        step={0.00000001}
                        formatOptions={{ maximumFractionDigits: 8 }}
                        classNames={{
                          inputWrapper:
                            'bg-[#e9e9e7] dark:bg-[#161618] dark:data-[hover=true]:bg-[#161618]/50 data-[hover=true]:bg-[#e9e9e7]/50',
                          input: 'text-2xl font-bold',
                        }}
                        color="secondary"
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

                    <div
                      {...props}
                      className="group relative top-1/2 cursor-grab rounded-full data-[dragging=true]:cursor-grabbing"
                    >
                      <span className="block size-5 rounded-full bg-secondary transition-transform group-data-[dragging=true]:scale-80" />
                    </div>
                  </Fragment>
                )}
              />

              <div className="flex items-center justify-between font-medium text-default-500">
                <div className="text-sm">0</div>
                <div className="text-sm">
                  1.54 <span className="text-xs">BTC</span>
                </div>
              </div>
            </div>

            <div className="border-t border-default-300 pt-[18px]">
              <div className="text-default-a mb-1 flex items-center gap-2 text-lg">
                Expected Yield{' '}
                <Tooltip content="lorem ipsum dolor sit amet">
                  <LuInfo className="pointer-events-auto cursor-pointer text-default-600 outline-none" />
                </Tooltip>
              </div>
              <div className="text-default-e text-[32px] font-bold leading-tight">
                <div className="text-default-d mt-0.5 text-[32px] font-bold leading-tight">
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
