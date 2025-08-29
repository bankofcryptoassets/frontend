import {
  OWNERSHIP_CALC_INTEREST_RATE,
  OWNERSHIP_CALC_TIME_PERIOD,
} from '@/utils/constants'
import {
  cn,
  Divider,
  NumberInput,
  Radio,
  RadioGroup,
  RadioProps,
  Tab,
  Tabs,
} from '@heroui/react'
import numeral from 'numeral'
import { useMemo, useState } from 'react'
import SlotCounter from 'react-slot-counter'

export const LoanCalculator = ({ btcPrice }: { btcPrice: number }) => {
  const [btcAmount, setBtcAmount] = useState<number>()
  const [loanTerm, setLoanTerm] = useState<string>(
    OWNERSHIP_CALC_TIME_PERIOD[0].value
  )
  const [interestRate, setInterestRate] = useState<string>(
    OWNERSHIP_CALC_INTEREST_RATE[0].value
  )

  const calculateLoanAmounts = useMemo(() => {
    if (!btcAmount || loanTerm === 'all' || !loanTerm) {
      return { upfront: '0.00', monthly: '0.00', total: '0.00' }
    }

    // Get loan term in months from the selection
    const termMonths = parseInt(loanTerm)

    // Calculate BTC value in USD
    const btcValue = btcAmount * btcPrice

    // 20% upfront as per benefits
    const upfrontPercentage = 0.2
    const upfrontAmount = btcValue * upfrontPercentage

    // Calculate financing amount (80% of BTC value)
    const financingAmount = btcValue - upfrontAmount

    // Interest rate
    const annualInterestRate = (parseInt(interestRate) || 10) / 100
    const monthlyInterestRate = annualInterestRate / 12

    // Calculate monthly payment using loan formula
    const monthlyPayment =
      (financingAmount *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, termMonths)) /
      (Math.pow(1 + monthlyInterestRate, termMonths) - 1)

    // Calculate total payment
    const totalPayment = upfrontAmount + monthlyPayment * termMonths

    return {
      upfront: numeral(upfrontAmount).format('0,0.[00]'),
      monthly: numeral(monthlyPayment).format('0,0.[00]'),
      total: numeral(totalPayment).format('0,0.[00]'),
    }
  }, [btcAmount, loanTerm, btcPrice, interestRate])

  return (
    <div className="my-4 flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2.5 rounded-xl border border-[#19191C] bg-[linear-gradient(89.57deg,_rgba(247,_147,_26,_0.01)_17.87%,_rgba(255,_255,_255,_0.02)_52.56%,_rgba(255,_255,_255,_0.04)_77.29%)] p-3.5">
        <label htmlFor="btc" className="text-default-d text-sm font-medium">
          BTC Goal
        </label>
        <NumberInput
          hideStepper
          isWheelDisabled
          placeholder="BTC Goal (in BTC)"
          name="btc"
          id="btc"
          endContent={<span className="text-foreground/50 text-xs">BTC</span>}
          fullWidth
          size="sm"
          minValue={0}
          value={btcAmount}
          formatOptions={{ maximumFractionDigits: 8 }}
          onChange={(value) => {
            if (typeof value === 'number') setBtcAmount(value)
            else if (value?.target)
              setBtcAmount(
                numeral(value?.target?.value || 0).value() || undefined
              )
          }}
          classNames={{
            inputWrapper: 'bg-background/70 border border-default-100',
          }}
        />
      </div>

      <div className="flex flex-col gap-2.5 rounded-xl border border-[#19191C] bg-[linear-gradient(89.57deg,_rgba(247,_147,_26,_0.01)_17.87%,_rgba(255,_255,_255,_0.02)_52.56%,_rgba(255,_255,_255,_0.04)_77.29%)] p-3.5">
        <label
          htmlFor="loan-duration"
          className="text-default-d text-sm font-medium"
        >
          Select Loan Duration:
        </label>
        <Tabs
          selectedKey={loanTerm}
          onSelectionChange={(key) => setLoanTerm(key as string)}
          variant="solid"
          color="primary"
          classNames={{
            tabList: 'w-full bg-background/50',
            tabContent:
              'text-sm text-foreground group-data-[selected=true]:text-primary',
            cursor: 'bg-primary/20',
          }}
        >
          {OWNERSHIP_CALC_TIME_PERIOD.map((term) => (
            <Tab key={term.value} title={term.label} />
          ))}
        </Tabs>
      </div>

      <div className="flex flex-col gap-2.5 rounded-xl border border-[#19191C] bg-[linear-gradient(89.57deg,_rgba(247,_147,_26,_0.01)_17.87%,_rgba(255,_255,_255,_0.02)_52.56%,_rgba(255,_255,_255,_0.04)_77.29%)] p-3.5">
        <label
          htmlFor="interest-rate"
          className="text-default-d text-sm font-medium"
        >
          Interest Rate:
        </label>
        <RadioGroup
          id="interest-rate"
          orientation="horizontal"
          value={interestRate}
          onValueChange={setInterestRate}
          classNames={{ label: 'text-sm font-medium text-default-d' }}
        >
          {OWNERSHIP_CALC_INTEREST_RATE.map((interestRate) => (
            <CustomRadio key={interestRate.value} value={interestRate.value}>
              {interestRate.label}
            </CustomRadio>
          ))}
        </RadioGroup>
      </div>

      <Divider />

      <div className="flex flex-col gap-2">
        <div className="flex justify-between gap-2">
          <div className="text-default-d text-sm font-medium">Down Payment</div>
          <Counter value={calculateLoanAmounts?.upfront} />
        </div>

        <div className="flex justify-between gap-2">
          <div className="text-default-d text-sm font-medium">Monthly EMI</div>
          <Counter value={calculateLoanAmounts?.monthly} />
        </div>

        <div className="flex justify-between gap-2">
          <div className="text-default-d text-sm font-medium">Total Paid</div>
          <Counter value={calculateLoanAmounts?.total} />
        </div>
      </div>
    </div>
  )
}

const Counter = ({ value }: { value: string }) => {
  return (
    <div className="flex items-center gap-1 select-none">
      <SlotCounter
        useMonospaceWidth
        value={value}
        charClassName="font-bold text-sm text-default-e"
        separatorClassName="font-bold text-sm text-default-e"
      />
      <span className="text-default-e text-sm font-bold">USDC</span>
    </div>
  )
}

export const CustomRadio = (
  props: RadioProps & { labelClassName?: string }
) => {
  const { children, className, labelClassName, ...otherProps } = props

  return (
    <Radio
      {...otherProps}
      className={cn('group', className)}
      classNames={{
        base: 'm-0 rounded-lg bg-[linear-gradient(86.84deg,_rgba(247,_147,_26,_0.01)_17.87%,_rgba(255,_255,_255,_0.02)_52.56%,_rgba(255,_255,_255,_0.04)_77.29%)] border border-default-100 transition-colors hover:bg-primary/10 data-[selected=true]:bg-primary/20  data-[selected=true]:border-primary',
        wrapper: 'hidden',
        labelWrapper: cn(
          'ml-0 ms-0 px-6 [&>span]:group-data-[selected=true]:text-primary [&>span]:text-default-a [&>span]:font-medium [&>span]:group-data-[selected=true]:font-semibold max-lg:px-5',
          labelClassName
        ),
      }}
    >
      {children}
    </Radio>
  )
}
