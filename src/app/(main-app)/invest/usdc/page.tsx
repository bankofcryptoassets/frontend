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
import { useMemo, useState } from 'react'
import numeral from 'numeral'
import { StyledModal } from '@/components/StyledModal'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/Chart'
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts'

const USER_USDC_BALANCE = 12932

export default function InvestUSDCPage() {
  const [usdcAmount, setUsdcAmount] = useState<number>(0)

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

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div
      className="container mt-10 grid h-full min-h-[calc(100vh-7rem)] w-full grid-cols-[280px_1fr] gap-5 pb-[60px] max-lg:grid-cols-1"
      id="invest-page"
    >
      <StyledModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      <div className="flex h-full w-full flex-col gap-4">
        <Card className="min-h-fit w-full space-y-6 rounded-2xl border border-default-200/40 bg-default-100/80 p-7 pb-[30px]">
          <div>
            <div className="text-xs text-default-a">Your USDC Investments</div>
            <div className="mt-0.5 text-[28px] font-bold leading-tight text-secondary">
              12,932 <span className="text-xl">USDC</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-default-a">Interest Earned</div>
            <div className="mt-0.5 text-[28px] font-bold leading-tight text-default-d">
              $100.24
            </div>
          </div>

          <div>
            <div className="text-xs text-default-a">Global Invested</div>
            <div className="mt-0.5 text-[28px] font-bold leading-tight text-default-d">
              999,243 <span className="text-xl">USDC</span>
            </div>
          </div>
        </Card>

        <Card className="h-full w-full rounded-2xl border border-default-200/40 bg-default-100/80 p-4">
          <div className="mb-[18px] border-b border-default-200 pb-3.5 pl-1 text-base font-medium text-default-d">
            Bitmor Stats
          </div>

          <div className="!mb-[18px] space-y-6">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-success-50 p-[5px]">
                <LuCircleDollarSign className="text-success" size={18} />
              </div>
              <div className="text-sm text-default-d">
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
              <div className="text-sm text-default-d">
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
              <div className="text-sm text-default-d">
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

      <Card className="rounded-2xl border border-default-200 bg-default-100 px-7 pb-10 pt-[18px]">
        <div className="mb-7 border-b border-default-200 pb-4 pl-1 text-base font-medium text-default-d">
          Investment
        </div>

        <div className="flex w-full justify-between gap-16 max-xl:flex-col">
          <div className="h-full w-full space-y-8 px-2 sm:min-w-[400px]">
            <div className="rounded-xl border border-default-300/50 bg-[#eaeaee] p-5 pb-4 pt-[18px] dark:bg-[#1F1F1F] max-sm:w-full">
              <div className="mb-16 pb-3.5 pl-1 text-base font-medium text-default-d">
                How Much USDC?
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
                      color={sliderInputInsufficient ? 'danger' : 'secondary'}
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

                <div className="flex items-start justify-between font-medium text-default-500">
                  <div className="text-sm text-default-a">0</div>
                  <div className="flex flex-col items-end text-left text-sm text-default-a">
                    <div className="text-left">
                      12,932 <span className="text-xs">USDC</span>
                    </div>
                    <div className="text-left text-xs text-[#65656B]">
                      Available Balance
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-default-300 pt-4">
                <RadioGroup
                  label="Reinvest Earnings"
                  orientation="horizontal"
                  classNames={{
                    label: 'text-default-d text-sm',
                    wrapper: 'gap-5',
                  }}
                  color="secondary"
                  size="sm"
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
                <div className="flex items-center gap-2 text-xs text-default-a">
                  Base APR (6%){' '}
                  <Tooltip content="lorem ipsum dolor sit amet">
                    <LuInfo className="pointer-events-auto cursor-pointer text-default-600 outline-none" />
                  </Tooltip>
                </div>
                <div className="mt-0.5 text-2xl font-bold leading-tight text-secondary">
                  100 <span className="text-base">USDC</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs text-default-a">
                  Loan APR (9%){' '}
                  <Tooltip content="lorem ipsum dolor sit amet">
                    <LuInfo className="pointer-events-auto cursor-pointer text-default-600 outline-none" />
                  </Tooltip>
                </div>
                <div className="mt-0.5 text-2xl font-bold leading-tight text-secondary">
                  1000 <span className="text-base">USDC</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs text-default-a">
                  Historical APR{' '}
                  <Tooltip content="lorem ipsum dolor sit amet">
                    <LuInfo className="pointer-events-auto cursor-pointer text-default-600 outline-none" />
                  </Tooltip>
                </div>
                <div className="mt-0.5 text-2xl font-bold leading-tight text-[#65656B]">
                  1000 <span className="text-base">USDC</span>
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
              I understand that my USDC is being deposited into Aave and I will
              earn interest on my USDC.
            </Checkbox>

            <Button
              className="w-full font-bold text-white"
              size="lg"
              color="secondary"
              onPress={() => setIsModalOpen(true)}
            >
              Continue with the Invesment
            </Button>
          </div>

          <div className="w-full rounded-xl border border-default-200 bg-[#e8e8e8] p-5 dark:bg-[#181818] sm:min-w-[360px]">
            <div className="text-base font-medium text-default-d">
              Annualized Yield Comparison across Lending Scenarios
            </div>

            <div className="mt-7">
              <ChartContainer
                config={{
                  apy: {
                    label: 'APY (%)',
                    color: 'hsl(var(--heroui-secondary))',
                  },
                }}
                className="min-h-[430px] w-full [&_*]:outline-none"
              >
                <BarChart
                  accessibilityLayer
                  data={[
                    { category: 'Maximum Earning by Reinvesting', apy: 29 },
                    { category: 'Higher Earnings by Reinvesting', apy: 17 },
                    { category: 'Average Bitmor Earnings', apy: 8 },
                    { category: 'Average DeFi Earnings', apy: 3 },
                  ]}
                  barCategoryGap={10}
                >
                  <Bar
                    dataKey="apy"
                    fill="var(--color-apy)"
                    radius={[8, 8, 0, 0]}
                  >
                    <LabelList
                      position="top"
                      offset={12}
                      className="fill-default-d"
                      formatter={(value: number) => `${value}%`}
                      fontSize={14}
                      fontWeight={500}
                    />
                  </Bar>
                  <XAxis
                    dataKey="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={true}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis
                    dataKey="apy"
                    tickLine={true}
                    tickMargin={10}
                    axisLine={true}
                    label={{
                      value: `APY (%)`,
                      style: { textAnchor: 'middle' },
                      angle: -90,
                      position: 'left',
                      offset: -16,
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        formatter={(value) => (
                          <div className="flex items-center gap-2">
                            <div className="">APY</div>
                            <div className="">{value}%</div>
                          </div>
                        )}
                      />
                    }
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
