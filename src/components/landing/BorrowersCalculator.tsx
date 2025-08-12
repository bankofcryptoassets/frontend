'use client'
import {
  Card,
  cn,
  Divider,
  Link,
  NumberInput,
  Radio,
  RadioGroup,
  RadioProps,
} from '@heroui/react'
import { useMemo, useState } from 'react'
import numeral from 'numeral'
import SlotCounter from 'react-slot-counter'
import { INTEREST_RATE, TIME_PERIOD } from '@/utils/constants'
import { trackEvent } from '@/utils/trackEvent'
import NextLink from 'next/link'

const BITCOIN_PRICE = 1_00_000

export const BorrowersCalculator = () => {
  const [btcAmount, setBtcAmount] = useState<number>()
  const [loanTerm, setLoanTerm] = useState<string>()

  const calculateLoanAmounts = useMemo(() => {
    if (!btcAmount || loanTerm === 'all' || !loanTerm) {
      return { upfront: '0.00', monthly: '0.00', total: '0.00' }
    }

    // Get loan term in months from the selection
    const termMonths = parseInt(loanTerm)

    // Calculate BTC value in USD
    const btcValue = btcAmount * BITCOIN_PRICE

    // 20% upfront as per benefits
    const upfrontPercentage = 0.2
    const upfrontAmount = btcValue * upfrontPercentage

    // Calculate financing amount (80% of BTC value)
    const financingAmount = btcValue - upfrontAmount

    // Interest rate
    const annualInterestRate =
      (TIME_PERIOD.find((term) => term.value === loanTerm)
        ?.interestForLandingPage || TIME_PERIOD[0]?.interestForLandingPage) /
      100
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
  }, [btcAmount, loanTerm])

  return (
    <Card className="bg-default-50/90 border-default-100 w-full max-w-md rounded-2xl border shadow-[0px_1px_0px_0px_#FEFEFE1A,0px_0px_4px_0px_#FFFFFF1F]">
      <div className="p-6">
        <div className="text-foreground/90 mb-4 text-center text-xl leading-[1] font-medium">
          Ownership Calculator
        </div>

        <Divider />

        <div className="my-6 flex w-full flex-col gap-6">
          <NumberInput
            hideStepper
            isWheelDisabled
            label="Amount of BTC"
            endContent={<span>BTC</span>}
            name="btc"
            fullWidth
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
              inputWrapper:
                'bg-transparent bg-[linear-gradient(86.84deg,_rgba(247,_147,_26,_0.01)_17.87%,_rgba(255,_255,_255,_0.02)_52.56%,_rgba(255,_255,_255,_0.04)_77.29%)] border border-default-100',
            }}
          />

          <RadioGroup
            label="Select Loan Duration:"
            orientation="horizontal"
            value={loanTerm}
            onValueChange={setLoanTerm}
            classNames={{ label: 'text-sm font-medium text-default-d' }}
          >
            {TIME_PERIOD.map((term) => (
              <CustomRadio
                key={term.value}
                value={term.value}
                labelClassName="px-5"
              >
                {term.label}
              </CustomRadio>
            ))}
          </RadioGroup>

          <RadioGroup
            label="Interest Rate:"
            orientation="horizontal"
            value={loanTerm}
            onValueChange={setLoanTerm}
            classNames={{ label: 'text-sm font-medium text-default-d' }}
          >
            {TIME_PERIOD.map((term) => (
              <CustomRadio key={term.value} value={term.value}>
                {term.interestForLandingPage}%
              </CustomRadio>
            ))}
          </RadioGroup>

          <Divider />

          <div className="flex flex-col gap-2">
            <div className="flex justify-between gap-2">
              <div className="text-default-d text-sm font-medium">
                Down Payment
              </div>
              <Counter value={calculateLoanAmounts?.upfront} />
            </div>

            <div className="flex justify-between gap-2">
              <div className="text-default-d text-sm font-medium">
                Monthly EMI
              </div>
              <Counter value={calculateLoanAmounts?.monthly} />
            </div>

            <div className="flex justify-between gap-2">
              <div className="text-default-d text-sm font-medium">
                Total Paid
              </div>
              <Counter value={calculateLoanAmounts?.total} />
            </div>
          </div>
        </div>

        <Link
          color="primary"
          as={NextLink}
          href="/borrow"
          className="flex! w-full items-center justify-center text-center text-base leading-tight"
          onPress={() => {
            trackEvent('clicked "Get Full Quote in App"', {
              btc_amount: btcAmount,
              loan_term: loanTerm,
              interest_rate: INTEREST_RATE[0],
            })
          }}
        >
          Get Full Quote in App
        </Link>
      </div>
    </Card>
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
        base: 'm-0 rounded-lg bg-[linear-gradient(86.84deg,_rgba(247,_147,_26,_0.01)_17.87%,_rgba(255,_255,_255,_0.02)_52.56%,_rgba(255,_255,_255,_0.04)_77.29%)] border border-default-100 transition-colors hover:bg-primary/10 data-[selected=true]:bg-primary/10  data-[selected=true]:border-primary/30',
        wrapper: 'hidden',
        labelWrapper: cn(
          'ml-0 ms-0 px-8 [&>span]:group-data-[selected=true]:text-primary/80 [&>span]:text-default-a [&>span]:font-medium [&>span]:group-data-[selected=true]:font-semibold',
          labelClassName
        ),
      }}
    >
      {children}
    </Radio>
  )
}
