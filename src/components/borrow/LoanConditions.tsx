'use client'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@heroui/react'
import { useState } from 'react'
import { LuInfo } from 'react-icons/lu'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '../Chart'
import {
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts'
import { NoData } from '../NoData'
import { AmortizationSchedule } from '@/types'
import numeral from 'numeral'

type Props = {
  isLoading: boolean
  interestOverTimeData?: {
    type: 'interest' | 'principal'
    amount: number
    fill: string
  }[]
  unlockScheduleData?: AmortizationSchedule[]
  liquidationData?: {
    months: number[]
    liquidationPrices: number[]
  }
  currentBtcPrice?: string
  handleLoan: () => void
}

export const LoanConditions = ({
  isLoading,
  interestOverTimeData,
  unlockScheduleData,
  liquidationData,
  currentBtcPrice,
  handleLoan,
}: Props) => {
  const [isAccepted, setIsAccepted] = useState(false)

  const liquidationChartData = liquidationData?.liquidationPrices.map(
    (price, index) => ({
      month: index,
      threshhold: price,
    })
  )

  return (
    <Card className="relative w-full">
      {isLoading && (
        <div className="absolute inset-0 z-[1] grid place-items-center bg-default/50 p-4 backdrop-blur-sm">
          <Spinner color="primary" />
        </div>
      )}

      <CardHeader className="bg-default-300 px-4 py-3 font-bold">
        Loan Conditions
      </CardHeader>

      <CardBody className="grid grid-cols-1 gap-4 p-4 text-sm xl:grid-cols-2">
        <Card className="h-full w-full">
          <CardHeader className="z-0 flex items-center gap-2 bg-default-300 px-3 py-1.5 font-bold">
            <span>Interest Schedule</span>

            <Tooltip content="Shows how interest accrues over time for the loan">
              <LuInfo />
            </Tooltip>
          </CardHeader>

          <CardBody className="bg-default-200/50">
            {interestOverTimeData ? (
              <ChartContainer
                config={{
                  amount: { label: 'Amount' },
                  interest: { label: 'Interest' },
                  principal: { label: 'Principal ' },
                }}
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={interestOverTimeData}
                    dataKey="amount"
                    nameKey="type"
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="type" />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <NoData />
            )}
          </CardBody>
        </Card>

        <Card className="h-full w-full">
          <CardHeader className="z-0 flex items-center gap-2 bg-default-300 px-3 py-1.5 font-bold">
            <span>Loan Fees</span>

            <Tooltip content="Various fees associated with the loan (e.g. origination, early closure)">
              <LuInfo />
            </Tooltip>
          </CardHeader>

          <CardBody className="bg-default-200/50 p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span>Origination Fee (1%)</span>
                <Tooltip content="A one-time fee charged for processing your loan">
                  <LuInfo />
                </Tooltip>
              </div>

              <div className="flex items-center gap-2">
                <span>Early Repayment Fee (1%)</span>
                <Tooltip content="A fee for repaying your loan before the term ends">
                  <LuInfo />
                </Tooltip>
              </div>

              <div className="flex items-center gap-2">
                <span>Non Repayment Fees</span>
                <Tooltip content="Charged if you default on the loan">
                  <LuInfo />
                </Tooltip>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="h-full w-full">
          <CardHeader className="z-0 flex items-center gap-2 bg-default-300 px-3 py-1.5 font-bold">
            <span>Unlock Schedule</span>

            <Tooltip content="Timeline when your collateral becomes available after repayment">
              <LuInfo />
            </Tooltip>
          </CardHeader>

          <CardBody className="h-full bg-default-200/50">
            {!!unlockScheduleData?.length ? (
              <Table
                removeWrapper
                maxTableHeight={240}
                isHeaderSticky
                classNames={{
                  base: 'max-h-[240px]',
                }}
              >
                <TableHeader>
                  <TableColumn align="end">Month</TableColumn>
                  <TableColumn align="end">Interest</TableColumn>
                  <TableColumn align="end">Principal</TableColumn>
                  <TableColumn align="end">Remaining</TableColumn>
                </TableHeader>
                <TableBody>
                  {unlockScheduleData?.map((item) => (
                    <TableRow
                      key={item.month}
                      className="transition hover:bg-default-200"
                    >
                      <TableCell className="font-mono text-xs">
                        {item.month}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {numeral(item.interestPayment).format('0,0.00')}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {numeral(item.principalPayment).format('0,0.00')}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {numeral(item.remainingBalance).format('0,0.00')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <NoData />
            )}
          </CardBody>
        </Card>

        <Card className="h-full w-full">
          <CardHeader className="z-0 flex items-center gap-2 bg-default-300 px-3 py-1.5 font-bold">
            <span>BTC Liquidation Threshold</span>

            <Tooltip content="Price of BTC at which we have to sell off remaining BTC to cover unpaid loan">
              <LuInfo />
            </Tooltip>
          </CardHeader>

          <CardBody className="bg-default-200/50 py-4">
            {!!currentBtcPrice && (
              <div className="mb-6 ml-4">
                Current BTC Price:{' '}
                <span className="font-mono font-bold text-primary">
                  {numeral(currentBtcPrice).format('0,0.00')}
                </span>
                <span> USDC</span>
              </div>
            )}

            {!!unlockScheduleData?.length ? (
              <ChartContainer
                config={{
                  threshhold: {
                    label: 'Threshhold',
                    color: 'hsl(var(--heroui-primary))',
                  },
                }}
                className="my-auto overflow-hidden"
              >
                <LineChart
                  accessibilityLayer
                  data={liquidationChartData}
                  margin={{ left: 16, bottom: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    label={{
                      value: `Months`,
                      position: 'bottom',
                      offset: 0,
                    }}
                  />
                  <YAxis
                    dataKey="threshhold"
                    tickLine={false}
                    axisLine={false}
                    label={{
                      value: `Liquidation Threshold`,
                      style: { textAnchor: 'middle' },
                      angle: -90,
                      position: 'left',
                      offset: 8,
                    }}
                    tickMargin={8}
                    tickFormatter={(value) => numeral(value).format('0,0')}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey="threshhold"
                    type="linear"
                    stroke="var(--color-threshhold)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <NoData />
            )}
          </CardBody>
        </Card>
      </CardBody>

      <CardFooter className="flex w-full gap-4 p-0">
        <div className="before: flex w-full flex-col items-center justify-between gap-3 bg-default-300 p-4">
          <Checkbox
            color="primary"
            checked={isAccepted}
            onValueChange={(value) => setIsAccepted(value)}
            classNames={{
              label: 'text-bold',
              wrapper: 'before:!border-foreground/60',
            }}
          >
            I understand and accept the conditions above for loans
          </Checkbox>

          <Tooltip
            content={!isAccepted && 'Please accept the conditions'}
            isDisabled={isAccepted}
          >
            <Button
              variant="shadow"
              color="primary"
              size="lg"
              className="pointer-events-auto font-semibold"
              isDisabled={!isAccepted}
              onPress={handleLoan}
            >
              Confirm and Get Your Bitcoin
            </Button>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  )
}
