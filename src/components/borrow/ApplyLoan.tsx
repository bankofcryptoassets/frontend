import { LoanAvailabilityType, LoanSummaryResponse } from '@/types'
import axios from '@/utils/axios'
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
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import numeral from 'numeral'
import { useMemo, useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { TIME_PERIOD_AND_INTEREST_RATES } from './data'
import { LoanSummary } from './LoanSummary'
import { LoanConditions } from './LoanConditions'

export const ApplyLoan = () => {
  const { data: btcAvailability } = useQuery({
    queryKey: ['/initialisation/loanavailability'],
    queryFn: () =>
      axios.get<LoanAvailabilityType>(`/initialisation/loanavailability`),
  })
  const availableLoanAmountInBTC =
    btcAvailability?.data?.data?.availableLoanAmountInBTC

  const [btcAmount, setBtcAmount] = useState<number>()
  const [loanTerm, setLoanTerm] = useState<Selection>(new Set([]))
  const [interestRate, setInterestRate] = useState<string>()
  const [debouncedPayload] = useDebounceValue(
    {
      amount: btcAmount,
      term: Number(Array.from(loanTerm)[0]),
      interestRate: Number(interestRate),
    },
    500,
    {
      equalityFn: (left, right) =>
        JSON.stringify(left) === JSON.stringify(right),
    }
  )
  const { data, isLoading } = useQuery({
    queryKey: ['/initialisation/loansummary', debouncedPayload],
    enabled:
      !!debouncedPayload?.amount &&
      !!debouncedPayload?.term &&
      !!debouncedPayload?.interestRate,
    queryFn: ({ signal }) =>
      axios.post<LoanSummaryResponse>(
        `/initialisation/loansummary`,
        debouncedPayload,
        { headers: { 'Content-Type': 'application/json' }, signal }
      ),
    placeholderData: keepPreviousData,
  })

  const loanSummary = useMemo(() => {
    if (!data?.data?.data?.loanSummary)
      return {
        minDownPayment: '0.00',
        principalAmount: '0.00',
        monthlyEMI: '0.00',
        interestAmount: '0.00',
        totalPayable: '0.00',
        assetReceived: '0',
      }

    const loanSummaryData = data?.data?.data?.loanSummary
    return {
      minDownPayment: numeral(loanSummaryData.downPayment).format('0,0.00[00]'),
      principalAmount: numeral(loanSummaryData.principal).format('0,0.00[00]'),
      monthlyEMI: numeral(loanSummaryData.monthlyPayment).format('0,0.00[00]'),
      interestAmount: numeral(loanSummaryData.totalInterest).format(
        '0,0.00[00]'
      ),
      totalPayable: numeral(loanSummaryData.totalPayment).format('0,0.00[00]'),
      assetReceived: String(btcAmount || 0),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  console.log('isLoading, data', isLoading, data)

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

  const handleLoan = () => {
    console.log('loan clicked...')
    // get approval for minDownPayment + totalPayable
    // call /match with loanSummary
    // call loan contract
  }

  return (
    <div className="grid h-full w-full grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="w-full space-y-8 lg:col-span-1">
        <div className="flex w-full flex-col gap-4">
          <NumberInput
            hideStepper
            isWheelDisabled
            label="BTC To Be Borrowed"
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
            classNames={{
              inputWrapper: 'bg-default/35 data-[hover=true]:bg-default/50',
            }}
            color="primary"
            description={
              <span className="text-sm">
                Available to be Borrowed:{' '}
                <strong>{availableLoanAmountInBTC ?? 0} BTC</strong>
              </span>
            }
          />

          <Select
            color="primary"
            label="Time Period"
            name="loanTerm"
            size="lg"
            fullWidth
            selectedKeys={loanTerm}
            onSelectionChange={handleTimePeriodChange}
            disallowEmptySelection
            classNames={{
              trigger:
                'bg-default/35 data-[hover=true]:bg-default/50 transition-colors data-[open=true]:bg-primary-50',
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

        <LoanSummary loanSummary={loanSummary} isLoading={isLoading} />
      </div>

      <div className="lg:col-span-2">
        <LoanConditions
          isLoading={isLoading}
          interestOverTimeData={
            numeral(loanSummary?.interestAmount).value() &&
            numeral(loanSummary?.principalAmount).value()
              ? [
                  {
                    type: 'interest',
                    amount: numeral(loanSummary?.interestAmount).value() ?? 0,
                    fill: 'hsl(var(--heroui-secondary))',
                  },
                  {
                    type: 'principal',
                    amount: numeral(loanSummary?.principalAmount).value() ?? 0,
                    fill: 'hsl(var(--heroui-primary))',
                  },
                ]
              : undefined
          }
          unlockScheduleData={
            data?.data?.data?.loanSummary?.amortizationSchedule
          }
          liquidationData={data?.data?.data?.loanSummary?.liquidationChart}
          currentBtcPrice={data?.data?.data?.loanSummary?.currentBtcPrice}
          handleLoan={handleLoan}
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
        base: 'm-0 rounded-lg bg-default/35 transition hover:bg-default/50 data-[selected=true]:bg-primary',
        wrapper: 'hidden',
        labelWrapper:
          'ml-0 ms-0 px-3 [&>span]:group-data-[selected=true]:text-background [&>span]:font-medium [&>span]:group-data-[selected=true]:font-semibold',
      }}
    >
      {children}
    </Radio>
  )
}
