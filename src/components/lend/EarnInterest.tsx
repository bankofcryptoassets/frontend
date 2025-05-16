import {
  NumberInput,
  Radio,
  RadioGroup,
  RadioProps,
  Select,
  Selection,
  SelectItem,
  Tooltip,
} from '@heroui/react'
import numeral from 'numeral'
import { useMemo, useState } from 'react'
import { TIME_PERIOD_AND_INTEREST_RATES } from '../borrow/data'
import { LoanConditions } from './LoanConditions'
import { Summary } from './Summary'
import { AmortizationSchedule } from '@/types'

const isLoading = false

export const EarnInterest = () => {
  const [usdcAmount, setUsdcAmount] = useState<number>()
  const [loanTerm, setLoanTerm] = useState<Selection>(new Set([]))
  const [interestRate, setInterestRate] = useState<string>()

  // Generate amortization schedule based on simple interest
  const generateAmortizationSchedule = (
    principal: number,
    interestRatePercent: number,
    termMonths: number
  ): AmortizationSchedule[] => {
    if (!principal || !interestRatePercent || !termMonths) return []

    const schedule: AmortizationSchedule[] = []
    const monthlyPrincipalPayment = principal / termMonths
    const annualInterestRate = interestRatePercent / 100
    const monthlyInterestRate = annualInterestRate / 12

    let remainingBalance = principal

    for (let month = 1; month <= termMonths; month++) {
      // For simple interest, interest is calculated on the original principal
      const interestPayment = principal * monthlyInterestRate

      // Principal payment is the same each month
      const principalPayment = monthlyPrincipalPayment

      // Update remaining balance
      remainingBalance -= principalPayment

      schedule.push({
        month,
        interestPayment: interestPayment.toFixed(2),
        principalPayment: principalPayment.toFixed(2),
        remainingBalance: remainingBalance.toFixed(2),
      })
    }

    return schedule
  }

  // Calculate loan summary based on user inputs
  const loanSummary = useMemo(() => {
    // Default values if inputs are missing
    if (!usdcAmount || !interestRate || !Array.from(loanTerm).length) {
      return {
        lendingAmount: '0.00',
        maxTimePeriod: '0',
        monthlyReceivable: '0.00',
        maximumYieldRecieved: '0.00',
      }
    }

    // Get loan term in months
    const termMonths = parseInt(Array.from(loanTerm)[0] as string)

    // Convert interest rate to a number
    const interestRateNum = parseFloat(interestRate)

    // Calculate simple interest
    // Simple Interest = Principal × Rate × Time (in years)
    const annualInterestRate = interestRateNum / 100
    const termYears = termMonths / 12
    const totalInterest = usdcAmount * annualInterestRate * termYears

    // Calculate monthly payment (principal + interest)
    const monthlyPrincipal = usdcAmount / termMonths
    const monthlyInterest = totalInterest / termMonths
    const monthlyPayment = monthlyPrincipal + monthlyInterest

    return {
      lendingAmount: numeral(usdcAmount).format('0,0.00[00]'),
      maxTimePeriod: String(termMonths), // Keep as months
      monthlyReceivable: numeral(monthlyPayment).format('0,0.00[00]'),
      maximumYieldRecieved: numeral(totalInterest).format('0,0.00[00]'),
    }
  }, [usdcAmount, interestRate, loanTerm])

  // Calculate amortization schedule for the loan conditions component
  const amortizationSchedule = useMemo(() => {
    if (!usdcAmount || !interestRate || !Array.from(loanTerm).length) {
      return []
    }

    const termMonths = parseInt(Array.from(loanTerm)[0] as string)
    const interestRateNum = parseFloat(interestRate)

    return generateAmortizationSchedule(usdcAmount, interestRateNum, termMonths)
  }, [usdcAmount, interestRate, loanTerm])

  console.log('Loan summary:', loanSummary)

  // Function to handle time period selection and update interest rate accordingly
  const handleTimePeriodChange = (selection: Selection) => {
    setLoanTerm(selection)

    // If a time period is selected, find the corresponding interest rate
    if (selection && selection !== 'all') {
      const selectedValues = Array.from(selection)
      if (selectedValues.length > 0) {
        const selectedTimePeriod = selectedValues[0] as string
        const matchingTerm = TIME_PERIOD_AND_INTEREST_RATES.find(
          (term) => term.timePeriod === selectedTimePeriod
        )
        if (matchingTerm) setInterestRate(matchingTerm.interestRate)
      }
    }
  }

  // Function to handle interest rate selection and update time period accordingly
  const handleInterestRateChange = (value: string) => {
    setInterestRate(value)

    // Skip for "variable" rate which doesn't have a corresponding time period
    if (value !== 'variable') {
      const matchingTerm = TIME_PERIOD_AND_INTEREST_RATES.find(
        (term) => term.interestRate === value
      )
      if (matchingTerm) setLoanTerm(new Set([matchingTerm.timePeriod]))
    }
  }

  const handleSupply = () => {
    console.log('supply clicked...')
    // get approval for usdcAmount
  }

  return (
    <div className="grid h-full w-full grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="w-full space-y-8 lg:col-span-1">
        <div className="flex w-full flex-col gap-4">
          <NumberInput
            hideStepper
            isWheelDisabled
            label="USDC To Be Lent"
            name="usdc"
            size="lg"
            endContent="USDC"
            fullWidth
            minValue={0}
            value={usdcAmount}
            formatOptions={{
              maximumFractionDigits: 8,
            }}
            onChange={(value) => {
              if (typeof value === 'number') setUsdcAmount(value)
              else if (value?.target)
                setUsdcAmount(
                  numeral(value?.target?.value ?? 0).value() || undefined
                )
            }}
            classNames={{
              inputWrapper:
                'bg-default/35 data-[hover=true]:bg-default/50 text-secondary-600',
              label: 'text-secondary-600',
            }}
            color="secondary"
          />

          <Select
            color="secondary"
            label="Time Period"
            name="loanTerm"
            size="lg"
            fullWidth
            selectedKeys={loanTerm}
            onSelectionChange={handleTimePeriodChange}
            disallowEmptySelection
            classNames={{
              trigger:
                'bg-default/35 data-[hover=true]:bg-default/50 transition-colors data-[open=true]:bg-secondary-50',
              innerWrapper: '[&>span]:text-secondary-600',
              label: 'text-secondary-600',
              selectorIcon: 'text-secondary-600',
            }}
          >
            {TIME_PERIOD_AND_INTEREST_RATES.map((term) => (
              <SelectItem
                key={term.timePeriod}
                textValue={`${term.timePeriod} Months`}
              >
                {term.timePeriod} Months
              </SelectItem>
            ))}
          </Select>

          <RadioGroup
            label="Rate of Interest"
            orientation="horizontal"
            value={interestRate}
            onValueChange={handleInterestRateChange}
          >
            {TIME_PERIOD_AND_INTEREST_RATES.map((term) => (
              <CustomRadio
                key={term.interestRate}
                value={term.interestRate.toString()}
              >
                {term.interestRate}%
              </CustomRadio>
            ))}

            <Tooltip content="Coming Soon">
              <CustomRadio
                value="variable"
                isDisabled
                className="pointer-events-auto"
              >
                Variable
              </CustomRadio>
            </Tooltip>
          </RadioGroup>
        </div>

        <Summary loanSummary={loanSummary} isLoading={isLoading} />
      </div>

      <div className="lg:col-span-2">
        <LoanConditions
          isLoading={isLoading}
          unlockScheduleData={amortizationSchedule}
          handleSupply={handleSupply}
        />
      </div>
    </div>
  )
}

export const CustomRadio = (props: RadioProps) => {
  const { children, ...otherProps } = props

  return (
    <Radio
      {...otherProps}
      className="group"
      classNames={{
        base: 'm-0 rounded-lg bg-default/35 transition hover:bg-default/50 data-[selected=true]:bg-secondary',
        wrapper: 'hidden',
        labelWrapper:
          'ml-0 ms-0 px-3 [&>span]:font-medium [&>span]:group-data-[selected=true]:font-semibold',
      }}
    >
      {children}
    </Radio>
  )
}
