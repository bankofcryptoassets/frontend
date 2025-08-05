'use client'

import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Slider,
  Checkbox,
  NumberInput,
  Radio,
  RadioGroup,
  RadioProps,
  cn,
  Chip,
} from '@heroui/react'
import { LuCalendar, LuInfo } from 'react-icons/lu'
import numeral from 'numeral'

interface Props {
  loanAmount: number | undefined
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
  liquidationInsuranceCost: number
  onLiquidationInsuranceCostChange: (value: number) => void
  dcaCadence: 'daily' | 'weekly' | 'monthly'
  onDcaCadenceChange: (value: 'daily' | 'weekly' | 'monthly') => void
  btcYield: number
  onBtcYieldChange: (value: number) => void
  dcaWithoutDownPayment: boolean
  onDcaWithoutDownPaymentChange: (value: boolean) => void
}

export function LoanVsDCASidebar({
  loanAmount,
  onLoanAmountChange,
  timePeriod,
  onTimePeriodChange,
  // downPayment,
  onDownPaymentChange,
  // loanAPR,
  onLoanAPRChange,
  // startDate,
  onStartDateChange,
  // endDate,
  onEndDateChange,
  // liquidationInsuranceCost,
  onLiquidationInsuranceCostChange,
  dcaCadence,
  onDcaCadenceChange,
  btcYield,
  onBtcYieldChange,
  dcaWithoutDownPayment,
  onDcaWithoutDownPaymentChange,
}: Props) {
  // const minAmount = 1000
  // const maxAmount = 1000000

  return (
    <Card className="border-default-200 h-full border lg:max-h-[640px]">
      <CardHeader className="p-4 pb-0">
        <h3 className="border-default-200 text-default-d w-full border-b px-1 pb-3.5 text-base font-medium">
          Loan vs DCA Calculator
        </h3>
      </CardHeader>

      <CardBody className="gap-4 px-0 py-4">
        <div className="space-y-4 px-4">
          <NumberInput
            hideStepper
            isWheelDisabled
            placeholder="Loan Amount in USD"
            value={loanAmount}
            onChange={(value) => {
              if (typeof value === 'number') {
                onLoanAmountChange(value)
              }
            }}
            classNames={{
              inputWrapper:
                'dark:bg-[#1F1F1F] dark:data-[hover=true]:[#1F1F1F] text-default-600 border border-default-300/50',
            }}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-default-a text-sm font-medium">
                Time Period (in Months)
              </label>
              <NumberInput
                step={1}
                minValue={12}
                maxValue={60}
                value={timePeriod}
                className="flex-1 text-right"
                onChange={(value) => {
                  if (typeof value === 'number') onTimePeriodChange(value)
                }}
                classNames={{
                  inputWrapper:
                    'dark:bg-[#1F1F1F] dark:data-[hover=true]:[#1F1F1F] text-default-600 border border-default-300/50 w-28',
                  input: 'text-center',
                }}
              />
            </div>
            <p className="text-default-a text-right text-xs">
              Between 12 - 60 Months
            </p>
          </div>
        </div>

        <h4 className="bg-default-200/70 text-default-a mt-4 flex items-center justify-between gap-2 px-5 py-1.5 text-sm font-medium">
          Advanced Options:{' '}
          <Chip size="sm" variant="flat" color="default">
            Coming Soon
          </Chip>
        </h4>

        <div className="space-y-4 px-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-default-a text-sm font-medium">
                Enter Down Payment
              </label>
              <NumberInput
                hideStepper
                isDisabled
                // value={downPayment}
                className="flex-1 text-right"
                onChange={(v) =>
                  typeof v === 'number' && onDownPaymentChange(v)
                }
                classNames={{
                  inputWrapper: 'bg-transparent w-20',
                  input: 'text-right',
                }}
              />
            </div>
            <Slider
              size="sm"
              step={1}
              minValue={0}
              maxValue={(loanAmount || 0) * 0.5}
              // value={downPayment}
              onChange={(value) => onDownPaymentChange(value as number)}
              className="w-full"
              isDisabled
              classNames={{
                thumb: 'bg-default-300',
                track: 'bg-default-200',
                filler: 'bg-default-300',
              }}
            />
            <div className="text-default-a flex justify-between text-xs">
              <span>0 Min.</span>
              <span className="text-right">
                {numeral((loanAmount || 0) * 0.5).format('0,0')} USDC Max.
              </span>
            </div>
          </div>

          <Input
            placeholder="Enter Loan APR"
            isDisabled
            // value={loanAPR.toString()}
            onChange={(e) => onLoanAPRChange(parseFloat(e.target.value) || 0)}
            endContent={<span className="text-default-a">%</span>}
            classNames={{
              inputWrapper: 'bg-default/35 data-[hover=true]:bg-default/50',
            }}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              // type="date"
              placeholder="Start Date"
              // value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              startContent={<LuCalendar className="text-default-a" size={16} />}
              isDisabled
              classNames={{
                inputWrapper: 'bg-default/35 data-[hover=true]:bg-default/50',
              }}
            />
            <Input
              // type="date"
              placeholder="End Date"
              // value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              startContent={<LuCalendar className="text-default-a" size={16} />}
              isDisabled
              classNames={{
                inputWrapper: 'bg-default/35 data-[hover=true]:bg-default/50',
              }}
            />
          </div>

          <Input
            placeholder="Liquidation Insurance Cost"
            isDisabled
            // value={liquidationInsuranceCost.toString()}
            onChange={(e) =>
              onLiquidationInsuranceCostChange(parseFloat(e.target.value) || 0)
            }
            classNames={{
              inputWrapper: 'bg-default/35 data-[hover=true]:bg-default/50',
            }}
          />

          <div className="space-y-2">
            <label className="text-default-a text-sm font-medium">
              DCA Cadence:
            </label>
            <RadioGroup
              orientation="horizontal"
              value={dcaCadence}
              onValueChange={(value) =>
                onDcaCadenceChange(value as 'daily' | 'weekly' | 'monthly')
              }
              classNames={{ wrapper: 'gap-2' }}
              isDisabled
            >
              {(['daily', 'weekly', 'monthly'] as const).map((cadence) => (
                <CustomRadio key={cadence} value={cadence}>
                  {cadence.charAt(0).toUpperCase() + cadence.slice(1)}
                </CustomRadio>
              ))}
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-default-a text-sm font-medium">
              BTC Yield:
            </label>
            <NumberInput
              hideStepper
              isWheelDisabled
              value={btcYield}
              onChange={(v) => typeof v === 'number' && onBtcYieldChange(v)}
              endContent={<span className="text-default-a">%</span>}
              isDisabled
              className="flex-1 text-right"
              classNames={{
                inputWrapper:
                  'bg-default/35 data-[hover=true]:bg-default/50 w-28',
                input: 'text-center',
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              isSelected={dcaWithoutDownPayment}
              onValueChange={onDcaWithoutDownPaymentChange}
              isDisabled
              classNames={{
                base: 'items-start',
                wrapper: 'mr-3 mt-1',
                label: 'text-default-a text-sm',
              }}
            >
              DCA without Down Payment
            </Checkbox>
            <LuInfo className="text-default-400" size={16} />
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

const CustomRadio = (props: RadioProps) => {
  const { children, className, ...otherProps } = props

  return (
    <Radio
      {...otherProps}
      className={cn('group', className)}
      classNames={{
        base: 'm-0 rounded-lg bg-default-200 transition hover:bg-primary/5 data-[selected=true]:bg-primary/5 border border-default-300/50 data-[selected=true]:border-primary/50',
        wrapper: 'hidden',
        labelWrapper:
          'ml-0 ms-0 px-3 [&>span]:group-data-[selected=true]:text-primary [&>span]:text-default-a [&>span]:font-medium [&>span]:group-data-[selected=true]:font-semibold',
      }}
    >
      {children}
    </Radio>
  )
}
