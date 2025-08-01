'use client'

import { Card, CardBody } from '@heroui/react'

interface EMIStatsProps {
  emiAmount: number
  dcaAmount: number
}

export function EMIStats({ emiAmount, dcaAmount }: EMIStatsProps) {
  return (
    <Card className="border border-default-200">
      <CardBody className="flex flex-row flex-wrap items-center justify-between gap-6 p-6">
        <div>
          <p className="mb-1 text-sm font-medium text-default-d">
            EMI (Monthly)
          </p>
          <p className="text-[28px] font-bold text-primary">
            {emiAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
            <span className="text-lg">USDC</span>
          </p>
        </div>

        <div>
          <p className="mb-1 text-sm font-medium text-default-d">DCA</p>
          <p className="text-[28px] font-bold text-secondary">
            {dcaAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
            <span className="text-lg">USDC</span>
          </p>
        </div>
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
}

export function StrategyStats({
  loanBTC,
  dcaBTC,
  loanReturns,
  dcaReturns,
  loanCostPerBTC,
  dcaCostPerBTC,
}: StrategyStatsProps) {
  return (
    <Card className="border border-default-200 max-lg:overflow-x-auto">
      <CardBody className="px-5 py-4 max-lg:min-w-[640px]">
        <table className="w-full">
          <thead>
            <tr className="divide-x divide-default-200 border-b border-default-200 text-sm">
              <th className="pb-3.5 pl-3 font-medium text-default-a">
                Strategy
              </th>
              <th className="pb-3.5 pl-5 font-medium text-default-a">
                Total BTC Owned
              </th>
              <th className="pb-3.5 pl-5 font-medium text-default-a">
                Dollar Value of BTC Held
              </th>
              <th className="pb-3.5 pl-5 font-medium text-default-a">
                Cost per BTC
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="divide-x divide-default-200">
              <td className="pl-3 pt-4 text-base font-medium text-default-d">
                Loan
              </td>
              <td className="pl-5 pt-4 text-lg font-bold text-primary">
                {loanBTC?.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                })}{' '}
                BTC
              </td>
              <td className="pl-5 pt-4 text-lg font-bold text-primary">
                {loanReturns.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{' '}
                USDC
              </td>
              <td className="pl-5 pt-4 text-lg font-bold text-primary">
                {loanCostPerBTC.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{' '}
                USDC
              </td>
            </tr>

            <tr className="divide-x divide-default-200">
              <td className="pb-2 pl-3 pt-3.5 text-base font-medium text-default-d">
                DCA
              </td>
              <td className="pb-2 pl-5 pt-3.5 text-lg font-bold text-secondary">
                {dcaBTC?.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                })}{' '}
                BTC
              </td>
              <td className="pb-2 pl-5 pt-3.5 text-lg font-bold text-secondary">
                {dcaReturns.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{' '}
                USDC
              </td>
              <td className="pb-2 pl-5 pt-3.5 text-lg font-bold text-secondary">
                {dcaCostPerBTC.toLocaleString(undefined, {
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
