'use client'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Spinner,
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
import { Pie, PieChart } from 'recharts'

type Props = {
  isLoading: boolean
  interestOverTimeData?: {
    type: 'interest' | 'principal'
    amount: number
    fill: string
  }[]
}

export const LoanConditions = ({ isLoading, interestOverTimeData }: Props) => {
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

      <CardBody className="grid grid-cols-1 gap-6 p-6 text-sm md:grid-cols-2">
        <div className="flex w-full items-start gap-1">
          <div className="mt-1">
            <Checkbox
              checked={conditions.interestOverTime}
              onValueChange={(value) =>
                setConditions((prev) => ({ ...prev, interestOverTime: value }))
              }
            />
          </div>

          <Card className="w-full">
            <CardHeader className="z-0 flex items-center gap-2 bg-default-300 px-3 py-1.5 font-bold">
              <span>Interest Over Time</span>

              <Tooltip content="Interest Over Time">
                <LuInfo />
              </Tooltip>
            </CardHeader>

            <CardBody className="bg-default-200/50">
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

          <Card className="w-full">
            <CardHeader className="z-0 flex items-center gap-2 bg-default-300 px-3 py-1.5 font-bold">
              <span>Fees</span>

              <Tooltip content="Fees">
                <LuInfo />
              </Tooltip>
            </CardHeader>

            <CardBody className="bg-default-200/50">chart herer</CardBody>
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

          <Card className="w-full">
            <CardHeader className="z-0 flex items-center gap-2 bg-default-300 px-3 py-1.5 font-bold">
              <span>Unlock Schedule</span>

              <Tooltip content="Unlock Schedule">
                <LuInfo />
              </Tooltip>
            </CardHeader>

            <CardBody className="bg-default-200/50">chart herer</CardBody>
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

          <Card className="w-full">
            <CardHeader className="z-0 flex items-center gap-2 bg-default-300 px-3 py-1.5 font-bold">
              <span>Liquidation Threshold</span>

              <Tooltip content="Liquidation Threshold">
                <LuInfo />
              </Tooltip>
            </CardHeader>

            <CardBody className="bg-default-200/50">chart herer</CardBody>
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
            >
              Get Loan
            </Button>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  )
}
