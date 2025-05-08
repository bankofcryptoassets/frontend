'use client'
import {
  Button,
  Card,
  Divider,
  NumberInput,
  Radio,
  RadioGroup,
  Select,
  Selection,
  SelectItem,
  Tooltip,
} from '@heroui/react'
import { MagicCard } from '../MagicCard'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useMemo, useState } from 'react'
import numeral from 'numeral'
import SlotCounter from 'react-slot-counter'

const BITCOIN_PRICE = 1_00_000

export const BorrowersCalculator = () => {
  const { resolvedTheme: theme } = useTheme()

  const [btcAmount, setBtcAmount] = useState<number>()
  const [loanTerm, setLoanTerm] = useState<Selection>(new Set([]))
  const [interestType, setInterestType] = useState('fixed')

  const calculateLoanAmounts = useMemo(() => {
    if (!btcAmount || loanTerm === 'all' || !loanTerm.size) {
      return {
        upfront: '0.0',
        monthly: '0.0',
        total: '0.0',
      }
    }

    // Get loan term in months from the selection
    const termMonths = parseInt(Array.from(loanTerm)[0] as string)

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
      upfront: numeral(upfrontAmount).format('0,0.0'),
      monthly: numeral(monthlyPayment).format('0,0.0'),
      total: numeral(totalPayment).format('0,0.0'),
    }
  }, [btcAmount, loanTerm])

  console.log('calculateLoanAmounts', calculateLoanAmounts)

  return (
    <Card className="w-full max-w-lg bg-background" radius="md">
      <MagicCard
        gradientColor={theme === 'dark' ? '#333333' : '#D9D9D999'}
        className="p-0"
      >
        <div className="p-6">
          <div className="mb-2 text-xl font-semibold">
            How Much BTC Can You Borrow?
          </div>

          <div className="my-6 flex w-full flex-col gap-6">
            <NumberInput
              hideStepper
              isWheelDisabled
              label="Bitcoin Amount (BTC)"
              name="btc"
              size="lg"
              endContent="BTC"
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
                    numeral(value?.target?.value ?? 0).value() || undefined
                  )
              }}
            />

            <Select
              label="Loan Term"
              name="loanTerm"
              size="lg"
              fullWidth
              selectedKeys={loanTerm}
              onSelectionChange={setLoanTerm}
            >
              {[3, 6, 12, 24, 36, 48].map((term) => (
                <SelectItem key={term} textValue={`${term} Months`}>
                  {term} Months
                </SelectItem>
              ))}
            </Select>

            <RadioGroup
              label="Interest Type"
              orientation="horizontal"
              classNames={{ wrapper: 'gap-6' }}
              value={interestType}
              onValueChange={setInterestType}
            >
              <Radio value="fixed">Fixed Rate</Radio>

              <Tooltip content="Coming Soon">
                <Radio
                  value="variable"
                  isDisabled
                  className="pointer-events-auto"
                >
                  Variable Rate
                </Radio>
              </Tooltip>
            </RadioGroup>

            <Divider />

            <div className="flex flex-col gap-2">
              <div className="flex justify-between gap-2">
                <div>Upfront Cost:</div>
                <Counter value={calculateLoanAmounts?.upfront} />
              </div>

              <div className="flex justify-between gap-2">
                <div>Monthly Payment:</div>
                <Counter value={calculateLoanAmounts?.monthly} />
              </div>

              <div className="flex justify-between gap-2">
                <div>Total Paid:</div>
                <Counter value={calculateLoanAmounts?.total} />
              </div>
            </div>
          </div>

          <div className="w-full space-y-3 rounded-xl bg-default-100 p-3">
            <p className="text-sm">
              Want your full repayment schedule, BTC unlock plan, and
              pre-closure projections?
            </p>
            <Button
              color="primary"
              variant="shadow"
              as={Link}
              href="/borrow"
              className="font-medium"
              fullWidth
            >
              Enter the App to Get Full Quote
            </Button>
          </div>
        </div>
      </MagicCard>
    </Card>
  )
}

const Counter = ({ value }: { value: string }) => {
  return (
    <div className="flex items-center">
      <span className="font-semibold">$</span>
      <SlotCounter
        useMonospaceWidth
        value={value}
        charClassName="font-semibold"
        separatorClassName="font-semibold"
      />
    </div>
  )
}
