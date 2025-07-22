'use client'

import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Slider,
  Divider,
  Chip,
} from '@heroui/react'
import { LuCalendar } from 'react-icons/lu'

interface Props {
  loanAmount: number
  onLoanAmountChange: (value: number) => void
  timePeriod: number
  onTimePeriodChange: (value: number) => void
  downPayment: number
  onDownPaymentChange: (value: number) => void
  loanAPR: number
  onLoanAPRChange: (value: number) => void
  startDate: string
  onStartDateChange: (value: string) => void
  endDate: string
  onEndDateChange: (value: string) => void
}

export function LoanVsDCASidebar({
  loanAmount,
  onLoanAmountChange,
  timePeriod,
  onTimePeriodChange,
  downPayment,
  onDownPaymentChange,
  loanAPR,
  onLoanAPRChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
}: Props) {
  const minAmount = 1000
  const maxAmount = 1000000

  return (
    <Card className="border border-default-200">
      <CardHeader className="p-4">
        <h3 className="text-lg font-semibold">Loan vs DCA Calculator</h3>
      </CardHeader>

      <CardBody className="gap-6 p-4">
        {/* Loan Amount */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Loan Amount in USD</label>
          <Input
            type="number"
            value={loanAmount.toString()}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0
              if (value >= minAmount && value <= maxAmount) {
                onLoanAmountChange(value)
              }
            }}
            startContent={<span className="text-default-400">$</span>}
            className="font-mono"
          />
        </div>

        {/* Time Period */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Time Period (in Months)</label>
          <div className="flex items-center gap-3">
            <Slider
              size="sm"
              step={12}
              minValue={12}
              maxValue={60}
              value={timePeriod}
              onChange={(value) => onTimePeriodChange(value as number)}
              className="flex-1"
              classNames={{
                thumb: 'bg-primary',
                track: 'bg-default-200',
                filler: 'bg-primary',
              }}
            />
            <div className="w-20 text-right font-mono text-sm">
              {timePeriod}
            </div>
          </div>
          <p className="text-xs text-default-400">Between 12 - 60 Months</p>
        </div>

        <Divider />

        {/* Advanced Options */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-default-600">
            Advanced Options:
          </h4>

          {/* Down Payment */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Enter Down Payment</label>
            <div className="flex items-center gap-3">
              <Slider
                size="sm"
                step={1}
                minValue={0}
                maxValue={50}
                value={downPayment}
                onChange={(value) => onDownPaymentChange(value as number)}
                className="flex-1"
                isDisabled
                classNames={{
                  thumb: 'bg-default-300',
                  track: 'bg-default-200',
                  filler: 'bg-default-300',
                }}
              />
              <div className="w-20 text-right">
                <Chip size="sm" variant="flat" color="default">
                  Coming Soon
                </Chip>
              </div>
            </div>
            <div className="flex justify-between text-xs text-default-400">
              <span>{downPayment}</span>
              <span>Min.</span>
              <span className="text-right">
                {(loanAmount * 0.5).toFixed(0)} USDC
                <br />
                Max.
              </span>
            </div>
          </div>

          {/* Loan APR */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Enter Loan APR</label>
            <Input
              type="number"
              value={loanAPR.toString()}
              onChange={(e) => onLoanAPRChange(parseFloat(e.target.value) || 0)}
              endContent={<span className="text-default-400">%</span>}
              isDisabled
              placeholder="Coming Soon"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                startContent={
                  <LuCalendar className="text-default-400" size={16} />
                }
                isDisabled
                placeholder="Coming Soon"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                startContent={
                  <LuCalendar className="text-default-400" size={16} />
                }
                isDisabled
                placeholder="Coming Soon"
              />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
