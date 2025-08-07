'use client'
import {
  Card,
  CardBody,
  CardHeader,
  Slider,
  Checkbox,
  NumberInput,
  Radio,
  RadioGroup,
  RadioProps,
  cn,
  DatePicker,
  Tooltip,
  Spinner,
} from '@heroui/react'
import { LuInfo } from 'react-icons/lu'
import numeral from 'numeral'
import { parseDate } from '@internationalized/date'
import { MIN_DATE, MAX_DATE } from '@/utils/constants'
import { I18nProvider } from '@react-aria/i18n'

interface Props {
  loanAmount: number | undefined
  onLoanAmountChange: (value: number) => void
  timePeriod: number
  onTimePeriodChange: (value: number) => void
  downPayment: number
  onDownPaymentChange: (value: number) => void
  loanAPR: number
  onLoanAPRChange: (value: number) => void
  startDate?: string
  onStartDateChange?: (value: string) => void
  endDate?: string
  // onEndDateChange: (value: string) => void
  liquidationInsuranceCost: number
  onLiquidationInsuranceCostChange: (value: number) => void
  dcaCadence: 'daily' | 'weekly' | 'monthly'
  onDcaCadenceChange: (value: 'daily' | 'weekly' | 'monthly') => void
  btcYield: number
  onBtcYieldChange: (value: number) => void
  dcaWithoutDownPayment: boolean
  onDcaWithoutDownPaymentChange: (value: boolean) => void
  isFetching?: boolean
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
  // onEndDateChange,
  liquidationInsuranceCost,
  onLiquidationInsuranceCostChange,
  dcaCadence,
  onDcaCadenceChange,
  btcYield,
  onBtcYieldChange,
  dcaWithoutDownPayment,
  onDcaWithoutDownPaymentChange,
  isFetching,
}: Props) {
  return (
    <Card className="border-default-200 h-full border lg:max-h-[640px]">
      <CardHeader className="p-4 pb-0">
        <h3 className="border-default-200 text-default-d w-full border-b px-1 pb-3.5 text-base font-medium">
          Loan vs DCA Calculator
        </h3>
        {isFetching && <Spinner size="sm" className="pb-3.5" />}
      </CardHeader>

      <CardBody className="gap-6 px-0 py-4">
        <div className="space-y-6 px-4">
          <NumberInput
            hideStepper
            isWheelDisabled
            label="Loan Amount"
            value={loanAmount}
            onChange={(value) => {
              if (typeof value === 'number') {
                onLoanAmountChange(value)
                onDownPaymentChange(value * 0.2)
              }
            }}
            startContent={<span className="text-default-a -mb-0.5">$</span>}
            classNames={{
              inputWrapper:
                'bg-default-200 data-[hover=true]:bg-default-300/70 group-data-[focus=true]:bg-default-200 text-default-700 border border-default-300/50',
              label: 'text-default-700!',
            }}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="time-period"
                className="text-default-a text-sm font-medium"
              >
                Time Period (in Months)
              </label>
              <NumberInput
                id="time-period"
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
                    'bg-default-200 data-[hover=true]:bg-default-300/70 group-data-[focus=true]:bg-default-200 text-default-700 border border-default-300/50',
                }}
              />
            </div>
            <p className="text-default-a text-right text-xs">
              Between 12 - 60 Months
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <I18nProvider>
              <DatePicker
                label="Start Date"
                classNames={{
                  inputWrapper:
                    'bg-default-200 hover:bg-default-300/70! focus-within:hover:bg-default-300/70! text-default-700 border border-default-300/50',
                  label: 'text-default-700!',
                  selectorIcon: 'text-default-600!',
                }}
                value={startDate ? parseDate(startDate) : undefined}
                onChange={(value) =>
                  value && onStartDateChange?.(value.toString())
                }
                showMonthAndYearPickers
                calendarProps={{
                  minValue: parseDate(MIN_DATE),
                  maxValue: parseDate(MAX_DATE),
                }}
              />
              <DatePicker
                label="End Date"
                classNames={{
                  inputWrapper:
                    'bg-default-200 hover:bg-default-300/70! focus-within:hover:bg-default-300/70! text-default-700 border border-default-300/50',
                  label: 'text-default-700!',
                }}
                value={endDate ? parseDate(endDate) : undefined}
                calendarProps={{ isDisabled: true }}
              />
            </I18nProvider>
          </div>
        </div>

        <h4 className="bg-default-200/70 text-default-a mt-2 flex items-center justify-between gap-2 px-5 py-1.5 text-sm font-medium">
          Advanced Options
        </h4>

        <div className="space-y-6 px-4">
          <div>
            <div className="mb-3 flex items-center justify-between gap-4">
              <label
                htmlFor="down-payment"
                className="text-default-a text-sm font-medium"
              >
                Enter Down Payment
              </label>
              <NumberInput
                id="down-payment"
                hideStepper
                minValue={0}
                maxValue={(loanAmount || 0) * 0.5}
                value={downPayment}
                className="flex-1 text-right"
                onChange={(value) => {
                  if (typeof value === 'number') onDownPaymentChange(value)
                }}
                startContent={<span className="text-default-a -mb-0.5">$</span>}
                classNames={{
                  inputWrapper:
                    'bg-default-200 data-[hover=true]:bg-default-300/70 group-data-[focus=true]:bg-default-200 text-default-700 border border-default-300/50',
                }}
              />
            </div>

            <Slider
              size="sm"
              step={1}
              minValue={0}
              maxValue={(loanAmount || 0) * 0.5}
              value={downPayment}
              onChange={(value) => onDownPaymentChange(value as number)}
              className="w-full"
              showTooltip
            />
            <div className="text-default-a mt-1 flex justify-between text-xs">
              <span>$0 Min.</span>
              <span className="text-right">
                ${numeral((loanAmount || 0) * 0.5).format('0,0')} Max.
              </span>
            </div>
          </div>

          <NumberInput
            hideStepper
            isWheelDisabled
            label="Enter Loan APR"
            minValue={1}
            maxValue={100}
            value={loanAPR}
            onChange={(value) => {
              if (typeof value === 'number') {
                onLoanAPRChange(value)
              }
            }}
            endContent={<span className="text-default-a -mb-0.5">%</span>}
            classNames={{
              inputWrapper:
                'bg-default-200 data-[hover=true]:bg-default-300/70 group-data-[focus=true]:bg-default-200 text-default-700 border border-default-300/50',
              label: 'text-default-700!',
            }}
          />

          <NumberInput
            hideStepper
            isWheelDisabled
            label="Liquidation Insurance Cost"
            value={liquidationInsuranceCost}
            onChange={(value) => {
              if (typeof value === 'number') {
                onLiquidationInsuranceCostChange(value)
              }
            }}
            startContent={<span className="text-default-a -mb-0.5">$</span>}
            classNames={{
              inputWrapper:
                'bg-default-200 data-[hover=true]:bg-default-300/70 group-data-[focus=true]:bg-default-200 text-default-700 border border-default-300/50',
              label: 'text-default-700!',
            }}
          />

          <div className="space-y-2">
            <div className="text-default-a text-sm font-medium">
              DCA Cadence
            </div>
            <RadioGroup
              orientation="horizontal"
              value={dcaCadence}
              onValueChange={(value) =>
                onDcaCadenceChange(value as 'daily' | 'weekly' | 'monthly')
              }
              classNames={{ wrapper: 'gap-2' }}
            >
              {(['daily', 'weekly', 'monthly'] as const).map((cadence) => (
                <CustomRadio key={cadence} value={cadence}>
                  {cadence.charAt(0).toUpperCase() + cadence.slice(1)}
                </CustomRadio>
              ))}
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="btc-yield"
              className="text-default-a text-sm font-medium"
            >
              BTC Yield
            </label>

            <NumberInput
              id="btc-yield"
              hideStepper
              minValue={0}
              maxValue={10}
              value={btcYield}
              className="flex-1 text-right"
              endContent={<span className="text-default-a">%</span>}
              onChange={(value) => {
                if (typeof value === 'number') onBtcYieldChange(value)
              }}
              classNames={{
                inputWrapper:
                  'bg-default-200 data-[hover=true]:bg-default-300/70 group-data-[focus=true]:bg-default-200 text-default-700 border border-default-300/50',
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              isSelected={dcaWithoutDownPayment}
              onValueChange={onDcaWithoutDownPaymentChange}
              classNames={{
                base: 'items-start',
                wrapper: 'mr-3 mt-0',
                label: 'text-default-a text-sm',
              }}
            >
              DCA without Down Payment
            </Checkbox>

            <Tooltip content="DCA without Down Payment" placement="top">
              <LuInfo className="text-default-600" size={16} />
            </Tooltip>
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
