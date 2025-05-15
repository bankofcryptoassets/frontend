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
}

export const LoanConditions = ({
  isLoading,
  interestOverTimeData,
  unlockScheduleData,
}: Props) => {
  const [conditions, setConditions] = useState({
    interestOverTime: false,
    fees: false,
    unlockSchedule: false,
    liquidationThreshold: false,
  })

  const isAccepted = Object.values(conditions).every((value) => value)

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

      <CardBody className="grid grid-cols-1 gap-6 p-4 text-sm xl:grid-cols-2">
        <div className="flex w-full items-start gap-1">
          <div className="mt-1">
            <Checkbox
              checked={conditions.interestOverTime}
              onValueChange={(value) =>
                setConditions((prev) => ({ ...prev, interestOverTime: value }))
              }
            />
          </div>

          <Card className="h-full w-full">
            <CardHeader className="z-0 flex items-center gap-2 bg-default-300 px-3 py-1.5 font-bold">
              <span>Interest Over Time</span>

              <Tooltip content="Interest Over Time">
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
        </div>

        <div className="flex w-full items-start gap-1">
          <div className="mt-1">
            <Checkbox
              checked={conditions.fees}
              onValueChange={(value) =>
                setConditions((prev) => ({ ...prev, fees: value }))
              }
            />
          </div>

          <Card className="h-full w-full">
            <CardHeader className="z-0 flex items-center gap-2 bg-default-300 px-3 py-1.5 font-bold">
              <span>Fees</span>

              <Tooltip content="Fees">
                <LuInfo />
              </Tooltip>
            </CardHeader>

            <CardBody className="bg-default-200/50 p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span>Loan Origination Fees (1%)</span>
                  <Tooltip content="Fees">
                    <LuInfo />
                  </Tooltip>
                </div>

                <div className="flex items-center gap-2">
                  <span>Pre Closure Fees (1%)</span>
                  <Tooltip content="Fees">
                    <LuInfo />
                  </Tooltip>
                </div>

                <div className="flex items-center gap-2">
                  <span>Non Repayment Fees</span>
                  <Tooltip content="Fees">
                    <LuInfo />
                  </Tooltip>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="flex w-full items-start gap-1">
          <div className="mt-1">
            <Checkbox
              checked={conditions.unlockSchedule}
              onValueChange={(value) =>
                setConditions((prev) => ({ ...prev, unlockSchedule: value }))
              }
            />
          </div>

          <Card className="h-full w-full">
            <CardHeader className="z-0 flex items-center gap-2 bg-default-300 px-3 py-1.5 font-bold">
              <span>Unlock Schedule</span>

              <Tooltip content="Unlock Schedule">
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
        </div>

        <div className="flex w-full items-start gap-1">
          <div className="mt-1">
            <Checkbox
              checked={conditions.liquidationThreshold}
              onValueChange={(value) =>
                setConditions((prev) => ({
                  ...prev,
                  liquidationThreshold: value,
                }))
              }
            />
          </div>

          <Card className="h-full w-full">
            <CardHeader className="z-0 flex items-center gap-2 bg-default-300 px-3 py-1.5 font-bold">
              <span>Liquidation Threshold</span>

              <Tooltip content="Liquidation Threshold">
                <LuInfo />
              </Tooltip>
            </CardHeader>

            <CardBody className="bg-default-200/50 py-4">
              {!!unlockScheduleData?.length ? (
                <ChartContainer
                  config={{
                    threshhold: {
                      label: 'Threshhold',
                      color: 'hsl(var(--heroui-primary))',
                    },
                  }}
                  className="my-auto"
                >
                  <LineChart
                    accessibilityLayer
                    data={[
                      { month: '1', threshhold: 186 },
                      { month: '2', threshhold: 305 },
                      { month: '3', threshhold: 237 },
                      { month: '4', threshhold: 73 },
                      { month: '5', threshhold: 209 },
                      { month: '6', threshhold: 214 },
                    ]}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
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
                        offset: 0,
                      }}
                      tickMargin={8}
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
        </div>
      </CardBody>

      <CardFooter className="flex w-full gap-4 p-0">
        <div className="flex w-full flex-col items-center justify-between gap-3 bg-default-300 p-4">
          <div className="text-bold">
            I understand and Accept the conditions above for loans.
          </div>

          <Tooltip
            content={!isAccepted && 'Please accept all the conditions above'}
            isDisabled={isAccepted}
          >
            <Button
              variant="shadow"
              color="primary"
              size="lg"
              className="pointer-events-auto font-semibold"
              isDisabled={!isAccepted}
              onPress={() => {
                console.log('clicked...')
              }}
            >
              Get Loan
            </Button>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  )
}
