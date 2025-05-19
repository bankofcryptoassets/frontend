'use client'
import {
  Button,
  Checkbox,
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
import numeral from 'numeral'
import { useMemo, useState } from 'react'
import { TIME_PERIOD_AND_INTEREST_RATES } from '../borrow/data'
import { Summary } from './Summary'
import { LuInfo } from 'react-icons/lu'
import { useAuth } from '@/auth/useAuth'
import { useMutation } from '@tanstack/react-query'
import axios from '@/utils/axios'
import { useAccount } from 'wagmi'
import { useUSDCApproval } from '@/hooks/useUSDCApproval'
import { toast } from 'sonner'
import { publicClient } from '@/auth/client'
import { useRouter } from 'next/navigation'
import { sleep } from '@/utils/sleep'

type LendingPostData = {
  message: string
  allowance: {
    user_id: string
    user_address: string
    allowance_amount: string
    duration_preference: string
  }
}

export const EarnInterest = () => {
  const { isAuth } = useAuth()
  const router = useRouter()
  const [usdcAmount, setUsdcAmount] = useState<number>()
  const [loanTerm, setLoanTerm] = useState<Selection>(new Set([]))
  const term = Array.from(loanTerm)[0]
  const [interestRate, setInterestRate] = useState<string>()
  const [isAccepted, setIsAccepted] = useState(false)

  const invalidInputs = !usdcAmount || !interestRate || !term
  const isDisabled = !isAuth || invalidInputs || !isAccepted
  const message = !isAuth
    ? 'Please connect your wallet to continue'
    : invalidInputs
      ? 'Please fill in all the fields'
      : !isAccepted
        ? 'Please accept the conditions'
        : ''

  // Generate amortization schedule based on simple interest
  // const generateAmortizationSchedule = (
  //   principal: number,
  //   interestRatePercent: number,
  //   termMonths: number
  // ): AmortizationSchedule[] => {
  //   if (!principal || !interestRatePercent || !termMonths) return []

  //   const schedule: AmortizationSchedule[] = []
  //   const monthlyPrincipalPayment = principal / termMonths
  //   const annualInterestRate = interestRatePercent / 100
  //   const monthlyInterestRate = annualInterestRate / 12

  //   let remainingBalance = principal

  //   for (let month = 1; month <= termMonths; month++) {
  //     // For simple interest, interest is calculated on the original principal
  //     const interestPayment = principal * monthlyInterestRate

  //     // Principal payment is the same each month
  //     const principalPayment = monthlyPrincipalPayment

  //     // Update remaining balance
  //     remainingBalance -= principalPayment

  //     schedule.push({
  //       month,
  //       interestPayment: interestPayment.toFixed(2),
  //       principalPayment: principalPayment.toFixed(2),
  //       remainingBalance: remainingBalance.toFixed(2),
  //     })
  //   }

  //   return schedule
  // }

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
  // const amortizationSchedule = useMemo(() => {
  //   if (!usdcAmount || !interestRate || !Array.from(loanTerm).length) {
  //     return []
  //   }

  //   const termMonths = parseInt(Array.from(loanTerm)[0] as string)
  //   const interestRateNum = parseFloat(interestRate)

  //   return generateAmortizationSchedule(usdcAmount, interestRateNum, termMonths)
  // }, [usdcAmount, interestRate, loanTerm])

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

  const [loading, setLoading] = useState(false)
  const { address } = useAccount()
  const { userId } = useAuth()
  const { approveUSDC, approvalQuery } = useUSDCApproval()
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      user_id,
      user_address,
      allowance_amount,
      duration_preference,
    }: {
      user_id: string
      user_address: string
      allowance_amount: string
      duration_preference: string
    }) => {
      const response = await axios.post<LendingPostData>('/lending', {
        user_id,
        user_address,
        allowance_amount,
        duration_preference,
      })
      return response.data
    },
  })

  const isLoading = isPending || approvalQuery.isPending || loading

  const handleSupply = async () => {
    if (!isAuth || !address || !usdcAmount || !term || !interestRate || !userId)
      return

    // get approval for usdcAmount
    approveUSDC(usdcAmount?.toString()).then(async (hash) => {
      setLoading(true)
      const data = await publicClient.waitForTransactionReceipt({ hash })
      await sleep(10000)
      setLoading(false)

      if (data?.status === 'reverted') {
        toast.error('Failed to approve USDC')
        return
      }

      // call lending api
      mutate(
        {
          user_id: userId,
          user_address: address,
          allowance_amount: usdcAmount?.toString(),
          duration_preference: term as string,
        },
        {
          onError: () => {
            toast.error('Failed to supply USDC')
          },
          onSuccess: (data) => {
            toast.success(data?.message || 'Successfully supplied USDC')
            router.push('/lend')
          },
        }
      )
    })
  }

  return (
    <div className="grid h-full w-full grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="w-full space-y-8 lg:col-span-1">
        <div className="flex w-full flex-col gap-4">
          <NumberInput
            hideStepper
            isWheelDisabled
            label={
              <span className="flex items-center gap-1.5">
                <span>Amount to Lend</span>
                <Tooltip content="Enter how much USDC you want to lend and earn interest on">
                  <LuInfo className="pointer-events-auto outline-none" />
                </Tooltip>
              </span>
            }
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
            label={
              <span className="flex items-center gap-1.5">
                <span className="text-sm">Lending Duration</span>
                <Tooltip content="Select how long you want to keep your funds locked to earn interest">
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
            label={
              <span className="flex items-center gap-1.5">
                <span className="text-sm">Expected Interest Rate</span>
                <Tooltip content="Choose the fixed annual rate at which you'll earn interest on your funds">
                  <LuInfo className="pointer-events-auto outline-none" />
                </Tooltip>
              </span>
            }
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

            <Tooltip content="Interest rate that can fluctuate based on market demand and supply">
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

        <Summary loanSummary={loanSummary} isLoading={false} />

        <div className="flex w-full flex-col items-center justify-between gap-3">
          <Checkbox
            color="secondary"
            checked={isAccepted}
            onValueChange={(value) => setIsAccepted(value)}
            classNames={{
              label: 'text-bold',
              wrapper: 'before:!border-foreground/60',
            }}
          >
            I understand and accept the conditions
          </Checkbox>

          <Tooltip content={message} isDisabled={!isDisabled}>
            <Button
              variant="shadow"
              color="secondary"
              size="lg"
              className="pointer-events-auto font-semibold"
              isDisabled={isDisabled}
              onPress={handleSupply}
              fullWidth
              isLoading={isLoading}
            >
              Supply USDC and Start Earning
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* <div className="lg:col-span-2">
        <LoanConditions
          isLoading={isLoading}
          unlockScheduleData={amortizationSchedule}
          handleSupply={handleSupply}
        />
      </div> */}
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
