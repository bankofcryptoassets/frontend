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
import { NoData } from '../NoData'
import { AmortizationSchedule } from '@/types'
import numeral from 'numeral'

type Props = {
  isLoading: boolean
  unlockScheduleData?: AmortizationSchedule[]
}

export const LoanConditions = ({ isLoading, unlockScheduleData }: Props) => {
  const [conditions, setConditions] = useState({
    yieldOverTime: false,
    withdrawalConditions: false,
    unlockSchedule: false,
    earlyExit: false,
  })

  const isAccepted = Object.values(conditions).every((value) => value)

  return (
    <Card className="relative w-full">
      {isLoading && (
        <div className="absolute inset-0 z-[1] grid place-items-center bg-default/50 p-4 backdrop-blur-sm">
          <Spinner color="secondary" />
        </div>
      )}

      <CardHeader className="bg-default-300 px-4 py-3 font-bold">
        Loan Conditions
      </CardHeader>

      <CardBody className="grid grid-cols-1 gap-6 p-4 text-sm xl:grid-cols-2">
        <div className="flex w-full items-start gap-1">
          <div className="mt-1">
            <Checkbox
              color="secondary"
              checked={conditions.yieldOverTime}
              onValueChange={(value) =>
                setConditions((prev) => ({ ...prev, yieldOverTime: value }))
              }
            />
          </div>

          <Card className="h-full w-full">
            <CardHeader className="z-0 flex items-center gap-2 bg-default-300 px-3 py-1.5 font-bold">
              <span>Yield Over Time</span>

              <Tooltip content="Yield Over Time">
                <LuInfo />
              </Tooltip>
            </CardHeader>

            <CardBody className="bg-default-200/50">
              <NoData />
            </CardBody>
          </Card>
        </div>

        <div className="flex w-full items-start gap-1">
          <div className="mt-1">
            <Checkbox
              color="secondary"
              checked={conditions.withdrawalConditions}
              onValueChange={(value) =>
                setConditions((prev) => ({
                  ...prev,
                  withdrawalConditions: value,
                }))
              }
            />
          </div>

          <Card className="h-full w-full">
            <CardHeader className="z-0 flex items-center gap-2 bg-default-300 px-3 py-1.5 font-bold">
              <span>Wallet Funds Withdrawal Condition</span>

              <Tooltip content="Wallet Funds Withdrawal Condition">
                <LuInfo />
              </Tooltip>
            </CardHeader>

            <CardBody className="bg-default-200/50">
              <NoData />
            </CardBody>
          </Card>
        </div>

        <div className="flex w-full items-start gap-1">
          <div className="mt-1">
            <Checkbox
              color="secondary"
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
              color="secondary"
              checked={conditions.earlyExit}
              onValueChange={(value) =>
                setConditions((prev) => ({ ...prev, earlyExit: value }))
              }
            />
          </div>

          <Card className="h-full w-full">
            <CardHeader className="z-0 flex items-center gap-2 bg-default-300 px-3 py-1.5 font-bold">
              <span>Early Exit</span>

              <Tooltip content="Liquidation Threshold">
                <LuInfo />
              </Tooltip>
            </CardHeader>

            <CardBody className="bg-default-200/50 py-4">
              <NoData />
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
              color="secondary"
              size="lg"
              className="pointer-events-auto font-semibold"
              isDisabled={!isAccepted}
              onClick={() => {
                console.log('clicked...')
              }}
            >
              Supply
            </Button>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  )
}
