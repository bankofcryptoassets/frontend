'use client'
import {
  Button,
  Card,
  cn,
  Divider,
  NumberInput,
  Radio,
  RadioGroup,
  RadioProps,
} from '@heroui/react'
import { MagicCard } from '../MagicCard'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useMemo, useState } from 'react'
import numeral from 'numeral'
import SlotCounter from 'react-slot-counter'
import { INTEREST_RATE, TIME_PERIOD } from '@/utils/constants'
import { trackEvent } from '@/utils/trackEvent'

const BITCOIN_PRICE = 1_00_000

export const BorrowersCalculator = () => {
  const { resolvedTheme: theme } = useTheme()

  const [btcAmount, setBtcAmount] = useState<number>()
  const [loanTerm, setLoanTerm] = useState<string>()

  const calculateLoanAmounts = useMemo(() => {
    if (!btcAmount || loanTerm === 'all' || !loanTerm) {
      return {
        upfront: '0.00',
        monthly: '0.00',
        total: '0.00',
      }
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

    // Interest rate (assuming 10% APR for fixed rate)
    const annualInterestRate = 0.1
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
    <Card className="w-full max-w-md rounded-2xl bg-background">
      <MagicCard
        gradientColor={theme === 'dark' ? '#333333' : '#D9D9D9aa'}
        className="p-0"
      >
        <div className="px-6 py-5">
          <div className="mb-4 text-base font-medium text-default-d">
            How Much BTC Can You Borrow?
          </div>

          <div className="my-6 flex w-full flex-col gap-6">
            <NumberInput
              hideStepper
              isWheelDisabled
              label="Bitcoin Amount (BTC)"
              name="btc"
              fullWidth
              minValue={0}
              value={btcAmount}
              formatOptions={{
                maximumFractionDigits: 8,
              }}
              onChange={(value) => {
                if (typeof value === 'number') setBtcAmount(value)
                else if (value?.target)
                  setBtcAmount(
                    numeral(value?.target?.value || 0).value() || undefined
                  )
              }}
              classNames={{
                inputWrapper: 'bg-default/35 data-[hover=true]:bg-default/50',
              }}
            />

            <RadioGroup
              label="Select Loan Duration:"
              orientation="horizontal"
              value={loanTerm}
              onValueChange={setLoanTerm}
              classNames={{
                label: 'text-sm font-medium text-default-d',
              }}
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
              value={INTEREST_RATE[0]}
              classNames={{
                label: 'text-sm font-medium text-default-d',
              }}
            >
              {INTEREST_RATE.map((term) => (
                <CustomRadio key={term} value={term.toString()}>
                  {term}%
                </CustomRadio>
              ))}
            </RadioGroup>

            <Divider />

            <div className="flex flex-col gap-2">
              <div className="flex justify-between gap-2">
                <div className="text-sm font-medium text-default-d">
                  Down Payment:
                </div>
                <Counter value={calculateLoanAmounts?.upfront} />
              </div>

              <div className="flex justify-between gap-2">
                <div className="text-sm font-medium text-default-d">
                  Monthly EMI:
                </div>
                <Counter value={calculateLoanAmounts?.monthly} />
              </div>

              <div className="flex justify-between gap-2">
                <div className="text-sm font-medium text-default-d">
                  Total Paid:
                </div>
                <Counter value={calculateLoanAmounts?.total} />
              </div>
            </div>
          </div>

          <Button
            color="primary"
            variant="light"
            as={Link}
            href="/borrow"
            className="text-lg font-medium"
            fullWidth
            onPress={() => {
              trackEvent('clicked "Get Full Quote in App"', {
                btc_amount: btcAmount,
                loan_term: loanTerm,
                interest_rate: INTEREST_RATE[0],
              })
            }}
          >
            Get Full Quote in App
          </Button>
        </div>
      </MagicCard>
    </Card>
  )
}

const Counter = ({ value }: { value: string }) => {
  return (
    <div className="flex select-none items-center gap-1">
      <SlotCounter
        useMonospaceWidth
        value={value}
        charClassName="font-bold text-sm text-default-e"
        separatorClassName="font-bold text-sm text-default-e"
      />
      <span className="text-sm font-bold text-default-e">USDC</span>
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
        base: 'm-0 rounded-lg bg-default-200 transition hover:bg-primary/5 data-[selected=true]:bg-primary/5 border border-default-300/50 data-[selected=true]:border-primary/50',
        wrapper: 'hidden',
        labelWrapper: cn(
          'ml-0 ms-0 px-8 [&>span]:group-data-[selected=true]:text-primary [&>span]:text-default-a [&>span]:font-medium [&>span]:group-data-[selected=true]:font-semibold',
          labelClassName
        ),
      }}
    >
      {children}
    </Radio>
  )
}
