'use client'
import { LoanAvailabilityType, LoanSummaryResponse } from '@/types'
import axios from '@/utils/axios'
import {
  cn,
  NumberInput,
  Radio,
  RadioGroup,
  RadioProps,
  Select,
  Selection,
  SelectItem,
  Tooltip,
} from '@heroui/react'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import numeral from 'numeral'
import { useMemo, useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { TIME_PERIOD_AND_INTEREST_RATES } from './data'
import { LoanSummary } from './LoanSummary'
import { LoanConditions } from './LoanConditions'
import { LuInfo } from 'react-icons/lu'
import { useAccount, useBalance } from 'wagmi'
import { useAuth } from '@/auth/useAuth'
import { useUSDCApproval } from '@/hooks/useUSDCApproval'
import { useLendingPoolLoan } from '@/hooks/useLendingPoolLoan'
import { toast } from 'sonner'
import { publicClient } from '@/auth/client'
import { sleep } from '@/utils/sleep'
import { CONTRACT_ADDRESSES } from '@/utils/constants'
import { formatUnits } from 'viem'
import { useRouter } from 'next/navigation'

type LoanMatchResponse = {
  success: boolean
  message: string
  data?: {
    matched_lenders?: {
      lender_id: string
      lender_address: `0x${string}`
      amount: number
    }[]
    total_amount_matched?: number
  }
}

const getLoanObjectIdFromLog = async (log: any) => {
  try {
    const maxRetries = 3
    const retryInterval = 10000 // 10 seconds in milliseconds

    await sleep(retryInterval)

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const loanId = log?.logs?.[log?.logs?.length - 1]?.data?.slice(0, 66) // 0x + 64 characters
        if (!loanId || loanId?.length !== 66 || !loanId?.startsWith('0x'))
          return undefined

        const loanById = await axios.get(`/loan/${loanId}`)
        const loanObjectId = loanById?.data?.loan?._id

        if (loanObjectId) return loanObjectId

        // If we didn't get a result and this isn't the last attempt, wait before retrying
        if (attempt < maxRetries - 1) {
          await sleep(retryInterval)
        }
      } catch (error) {
        // If this is the last attempt, throw the error
        if (attempt === maxRetries - 1) throw error
        // Otherwise wait and retry
        await sleep(retryInterval)
      }
    }
    return undefined
  } catch {
    return undefined
  }
}

export const ApplyLoan = () => {
  const router = useRouter()
  const { data: btcAvailability } = useQuery({
    queryKey: ['/initialisation/loanavailability'],
    queryFn: () =>
      axios.get<LoanAvailabilityType>(`/initialisation/loanavailability`),
  })
  const availableLoanAmountInBTC =
    btcAvailability?.data?.data?.availableLoanAmountInBTC

  const [btcAmount, setBtcAmount] = useState<number>()
  const [loanTerm, setLoanTerm] = useState<Selection>(new Set([]))
  const term = Array.from(loanTerm)[0]
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

  const [waiting, setWaiting] = useState(false)
  const { address } = useAccount()
  const { userId, isAuth } = useAuth()
  const { approveUSDC, approvalQuery } = useUSDCApproval()
  const { mutate, isPending: isPendingMatch } = useMutation({
    mutationFn: async ({
      borrower_address,
      interest_rate,
      duration_months,
      loan_amount,
    }: {
      borrower_address: string
      interest_rate: number
      duration_months: number
      loan_amount: number
    }) => {
      const response = await axios.post<LoanMatchResponse>(
        '/loan/match',
        {
          borrower_address,
          interest_rate,
          duration_months,
          loan_amount,
        },
        { headers: { 'Content-Type': 'application/json' } }
      )
      return response.data
    },
  })
  const { loanQuery, takeLoan } = useLendingPoolLoan()
  const isPending =
    isPendingMatch || approvalQuery.isPending || loanQuery.isPending || waiting

  const handleLoan = async () => {
    // Get the original string values from the API response instead of using numeral
    const loanAmountString =
      data?.data?.data?.loanSummary?.principal?.toString() || '0'
    const totalAmountString =
      data?.data?.data?.loanSummary?.totalPayment?.toString() || '0'

    // For validation, you can still convert to numbers
    const loanAmountNumber = Number(loanAmountString)
    const totalAmountNumber = Number(totalAmountString)

    const totalAmountParsed = BigInt(
      data?.data?.data?.loanSummary?.contract?.totalLoanAmount as string
    )
    // const parsedBorrowerDeposit = BigInt(data?.data?.data?.loanSummary?.contract?.borrowerDeposit as string)

    if (
      !isAuth ||
      !address ||
      !btcAmount ||
      !term ||
      !interestRate ||
      !userId ||
      !loanAmountNumber ||
      !totalAmountNumber
    )
      return

    // Use string values for the contract call
    approveUSDC(totalAmountString).then(async (hash) => {
      setWaiting(true)
      const data = await publicClient.waitForTransactionReceipt({ hash })
      await sleep(10000)
      setWaiting(false)

      if (data?.status === 'reverted') {
        toast.error('Failed to approve USDC')
        return
      }

      // For the API call, still use numbers as expected by your backend
      mutate(
        {
          borrower_address: address,
          interest_rate: Number(interestRate),
          duration_months: Number(term),
          loan_amount: loanAmountNumber, // Use number for API
        },
        {
          onError: () => {
            toast.error('Failed to match loan')
          },
          onSuccess: (matchData) => {
            toast.success(matchData?.message || 'Successfully matched loan')

            const lenderAddresses = matchData?.data?.matched_lenders?.map(
              (lender) => lender.lender_address
            )

            // IMPORTANT: Keep these as strings to preserve precision
            const lenderAmounts = matchData?.data?.matched_lenders?.map(
              (lender) => lender.amount.toString() // Convert to string immediately
            )

            if (
              !lenderAddresses?.length ||
              !lenderAmounts?.length ||
              !totalAmountString
            ) {
              toast.error('Failed to match loan')
              return
            }

            // call loan contract
            takeLoan(
              totalAmountParsed,
              Number(term || 0),
              Number(interestRate),
              lenderAddresses,
              lenderAmounts
            ).then(async (hash) => {
              setWaiting(true)
              toast.promise(
                // Wait for transaction receipt
                publicClient.waitForTransactionReceipt({
                  hash,
                }),
                {
                  dismissible: false,
                  loading: 'Waiting for loan transaction to be confirmed...',
                  success: async (data) => {
                    if (data?.status === 'reverted')
                      throw new Error('Loan transaction failed')

                    // Get the loan ID from the transaction receipt
                    const loanId = await getLoanObjectIdFromLog(data)
                    if (loanId) router.push(`/borrow?insuranceLoanId=${loanId}`)

                    return `Loan approved successfully!`
                  },
                  error: (err: Error) => {
                    return err.message || 'Loan transaction failed'
                  },
                  finally: () => {
                    setWaiting(false)
                  },
                }
              )
            })
          },
        }
      )
    })
  }

  const { data: usdcBalance } = useBalance({
    address,
    token: CONTRACT_ADDRESSES.USDC,
    query: { enabled: !!address },
  })

  return (
    <div className="grid h-full w-full grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="w-full space-y-8 lg:col-span-1">
        <div className="flex w-full flex-col gap-4">
          <NumberInput
            hideStepper
            isWheelDisabled
            label={
              <span className="flex items-center gap-1.5">
                <span>Amount to Borrow</span>
                <Tooltip content="Enter how much Bitcoin (BTC) you want to borrow">
                  <LuInfo className="pointer-events-auto outline-none" />
                </Tooltip>
              </span>
            }
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
              <span className="flex flex-col gap-1">
                <span className="text-sm">
                  Available to be Borrowed:{' '}
                  <strong>{availableLoanAmountInBTC ?? 0} BTC</strong>
                </span>

                <span className="text-sm text-foreground">
                  Available Balance:{' '}
                  <strong>
                    {numeral(
                      formatUnits(
                        usdcBalance?.value || BigInt(0),
                        usdcBalance?.decimals || 6
                      )
                    )?.format('0,0.00[00]')}{' '}
                    USCD
                  </strong>
                </span>
              </span>
            }
          />

          <Select
            color="primary"
            label={
              <span className="flex items-center gap-1.5">
                <span className="text-sm">Loan Duration</span>
                <Tooltip content="Select how long you want to take to repay the loan">
                  <LuInfo className="pointer-events-auto outline-none" />
                </Tooltip>
              </span>
            }
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
            label="Interest Rate"
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

            <Tooltip content="Interest rate may change based on market conditions">
              <CustomRadio
                value="variable"
                isDisabled
                className="pointer-events-auto"
              >
                Variable Rate (Coming Soon?)
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
          invalidInputs={!btcAmount || !term || !interestRate}
          isPending={isPending}
        />
      </div>
    </div>
  )
}

export const CustomRadio = (props: RadioProps) => {
  const { children, className, ...otherProps } = props

  return (
    <Radio
      {...otherProps}
      className={cn('group', className)}
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
