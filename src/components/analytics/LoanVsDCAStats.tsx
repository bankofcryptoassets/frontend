'use client'

import { Card, CardBody } from '@heroui/react'

interface EMIStatsProps {
  emiAmount: number
  dcaAmount: number
  dcasRemaining?: number
}

export function EMIStats({
  emiAmount,
  dcaAmount,
  dcasRemaining,
}: EMIStatsProps) {
  return (
    <Card className="border-default-200 border">
      <CardBody className="flex flex-row flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <p className="text-default-d mb-1 text-sm font-medium">
            EMI (Monthly)
          </p>
          <p className="text-primary text-[28px] font-bold">
            {emiAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
            <span className="text-lg">USDC</span>
          </p>
        </div>

        <div>
          <p className="text-default-d mb-1 text-sm font-medium">DCA</p>
          <p className="text-secondary text-[28px] font-bold">
            {dcaAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
            <span className="text-lg">USDC</span>
          </p>
        </div>

        {!!dcasRemaining && (
          <div>
            <p className="text-default-d mb-1 text-sm font-medium">
              DCAs Remaining
            </p>
            <p className="text-secondary text-[28px] font-bold">
              {dcasRemaining.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}{' '}
              <span className="text-lg">months</span>
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

interface StrategyStatsProps {
  loanBTC: number
  dcaBTC: number
  loanReturns: number
  dcaReturns: number
  loanCostPerBTC: number
  dcaCostPerBTC: number
  loanTotalSpent: number
  dcaTotalSpent: number
}

export function StrategyStats({
  loanBTC,
  dcaBTC,
  loanReturns,
  dcaReturns,
  loanCostPerBTC,
  dcaCostPerBTC,
  loanTotalSpent,
  dcaTotalSpent,
}: StrategyStatsProps) {
  return (
    <Card className="border-default-200 border max-lg:overflow-x-auto">
      <CardBody className="px-5 py-4 max-lg:min-w-[640px]">
        <table className="w-full">
          <thead>
            <tr className="divide-default-200 border-default-200 divide-x border-b text-sm">
              <th className="text-default-a pb-3.5 pl-3 font-medium">
                Strategy
              </th>
              <th className="text-default-a pb-3.5 pl-5 font-medium">
                Total BTC Owned
              </th>
              <th className="text-default-a pb-3.5 pl-5 font-medium">
                Dollar Value of BTC Held
              </th>
              <th className="text-default-a pb-3.5 pl-5 font-medium">
                Cost per BTC
              </th>
              <th className="text-default-a pb-3.5 pl-5 font-medium">
                Total Dollar Spent
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="divide-default-200 divide-x">
              <td className="text-default-d pt-4 pl-3 text-base font-medium">
                Loan
              </td>
              <td className="text-primary pt-4 pl-5 text-lg font-bold">
                {loanBTC?.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                })}{' '}
                BTC
              </td>
              <td className="text-primary pt-4 pl-5 text-lg font-bold">
                {loanReturns.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{' '}
                USDC
              </td>
              <td className="text-primary pt-4 pl-5 text-lg font-bold">
                {loanCostPerBTC.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{' '}
                USDC
              </td>
              <td className="text-primary pt-4 pl-5 text-lg font-bold">
                {loanTotalSpent.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{' '}
                USDC
              </td>
            </tr>

            <tr className="divide-default-200 divide-x">
              <td className="text-default-d pt-3.5 pb-2 pl-3 text-base font-medium">
                DCA
              </td>
              <td className="text-secondary pt-3.5 pb-2 pl-5 text-lg font-bold">
                {dcaBTC?.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                })}{' '}
                BTC
              </td>
              <td className="text-secondary pt-3.5 pb-2 pl-5 text-lg font-bold">
                {dcaReturns.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{' '}
                USDC
              </td>
              <td className="text-secondary pt-3.5 pb-2 pl-5 text-lg font-bold">
                {dcaCostPerBTC.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{' '}
                USDC
              </td>
              <td className="text-secondary pt-3.5 pb-2 pl-5 text-lg font-bold">
                {dcaTotalSpent.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{' '}
                USDC
              </td>
            </tr>
          </tbody>
        </table>
      </CardBody>
    </Card>
  )
}
