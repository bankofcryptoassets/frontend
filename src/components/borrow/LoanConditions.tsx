import {
  Button,
  Card,
  Checkbox,
  cn,
  Popover,
  Tooltip,
  PopoverContent,
  PopoverTrigger,
} from '@heroui/react'
import { LuArrowLeft } from 'react-icons/lu'
import { BsCaretDownFill, BsCaretUpFill } from 'react-icons/bs'
import { SetStateAction, Dispatch, useEffect, useRef, useState } from 'react'
import numeral from 'numeral'
import { LoanSummary } from '@/types'
import { TIME_PERIOD } from '@/utils/constants'

type LoanConditionsProps = {
  setStep: Dispatch<SetStateAction<number>>
  isOpen: number | undefined
  setIsOpen: Dispatch<SetStateAction<number | undefined>>
  conditions: {
    first: boolean
    second: boolean
    third: boolean
    fourth: boolean
  }
  setConditions: Dispatch<
    SetStateAction<{
      first: boolean
      second: boolean
      third: boolean
      fourth: boolean
    }>
  >
  setIsApproveModalOpen: Dispatch<SetStateAction<boolean>>
  isLoading: boolean
  continueButtonDisabled: boolean
  continueButtonTooltipContent: string | undefined
  loanSummary?: LoanSummary | null
}

export const LoanConditions = ({
  setStep,
  isOpen,
  setIsOpen,
  conditions,
  setConditions,
  setIsApproveModalOpen,
  isLoading,
  continueButtonDisabled,
  continueButtonTooltipContent,
  loanSummary,
}: LoanConditionsProps) => {
  return (
    <Card className="rounded-2xl border border-default-200 bg-default-100 px-7 pb-5 pt-[18px]">
      <div className="mb-7 border-b border-default-200 pb-4 pl-1 text-base font-medium text-default-d">
        Loan Conditions
      </div>

      <div className="mb-8 flex w-full justify-between gap-16 max-xl:flex-col">
        <div className="w-full sm:min-w-[360px]">
          <div className="w-full rounded-xl border border-default-200 bg-[#eaeaee] p-5 dark:bg-[#1F1F22]">
            <div className="mb-5 border-b border-default-300 px-1 pb-3.5 text-base font-medium text-default-d">
              Loan Summary
            </div>

            <div className="mb-5 flex items-center gap-12 border-b border-default-300 px-1 pb-4">
              <div className="flex flex-col gap-0.5">
                <div className="text-xs leading-tight text-default-d">
                  Borrowed Amount
                </div>
                <div className="text-[32px] font-bold leading-tight text-primary">
                  {numeral(loanSummary?.initialBtcCollateral).format(
                    '0,0.000[0000]'
                  )}{' '}
                  BTC
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="text-xs leading-tight text-default-d">
                  Loan Duration
                </div>
                <div className="text-[32px] font-bold leading-tight text-default-d">
                  {TIME_PERIOD.find(
                    (item) => item.value === loanSummary?.term?.toString()
                  )?.y || 0}
                  Y
                </div>
              </div>
            </div>

            <div className="space-y-3 px-1 text-sm text-default-a">
              <div className="flex items-center justify-between gap-2">
                <span>Total Paid</span>
                <span className="text-right font-bold text-default-d">
                  {formatUSDC(loanSummary?.totalPayment)} USDC
                </span>
              </div>
              <div className="relative ml-7 flex items-center justify-between gap-2">
                <span className="absolute -left-6 -top-2.5 size-5 border-b border-l border-default-300" />
                <span>Principal</span>
                <span className="text-right">
                  {formatUSDC(loanSummary?.principal)} USDC
                </span>
              </div>
              <div className="relative ml-7 flex items-center justify-between gap-2">
                <span className="absolute -left-6 -top-6 size-5 h-9 border-b border-l border-default-300" />
                <span>Interest ({loanSummary?.interestRate}%)</span>
                <span className="text-right">
                  {formatUSDC(loanSummary?.totalInterest)} USDC
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>Loan Origination Fees (1%)</span>
                <span className="text-right font-bold text-default-d">
                  {formatUSDC(loanSummary?.openingFee)} USDC
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>Down Payment + Fees</span>
                <span className="text-right font-bold text-default-d">
                  {formatUSDC(loanSummary?.firstTransaction?.amountSent)} USDC
                </span>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-default-300 px-1 pt-4 text-base font-medium text-default-d">
              <span>Monthly Payment</span>
              <span className="text-right text-xl font-bold text-primary">
                {formatUSDC(loanSummary?.monthlyPayment)} USDC
              </span>
            </div>
            <div className="mt-1 px-1 text-xs text-default-a">
              starting 10th May 2025
            </div>
          </div>
        </div>

        <div className="h-full w-full px-2 sm:min-w-[400px]">
          <div className="mb-4 border-b border-default-300 px-1 pb-3.5 text-base font-medium text-default-d">
            Loan Conditions
          </div>

          <LoanConditionItem
            isOpen={isOpen === 1}
            setIsOpen={(isOpen) => setIsOpen(isOpen ? 1 : undefined)}
            text="If I Fail to Pay for a Month, a portion of my Bitcoin will be sold
            to cover monthly payments."
            isOtherOpen={!!isOpen && isOpen !== 1}
            isChecked={conditions.first}
            onValueChange={(value) =>
              setConditions((prev) => ({ ...prev, first: value }))
            }
          />
          <LoanConditionItem
            isOpen={isOpen === 2}
            setIsOpen={(isOpen) => setIsOpen(isOpen ? 2 : undefined)}
            text="I understand that if i pay regularly on time, my interest rates
              will come down. If I miss, the interest rate discounts will
              disappear."
            isOtherOpen={!!isOpen && isOpen !== 2}
            isChecked={conditions.second}
            onValueChange={(value) =>
              setConditions((prev) => ({ ...prev, second: value }))
            }
          />
          <LoanConditionItem
            isOpen={isOpen === 3}
            setIsOpen={(isOpen) => setIsOpen(isOpen ? 3 : undefined)}
            text="I understand that based on an unlock schedule, every month, I will
              be able to transfer a portion of my Bitcoin to any wallet."
            isOtherOpen={!!isOpen && isOpen !== 3}
            isChecked={conditions.third}
            onValueChange={(value) =>
              setConditions((prev) => ({ ...prev, third: value }))
            }
          />
          <LoanConditionItem
            isOpen={isOpen === 4}
            setIsOpen={(isOpen) => setIsOpen(isOpen ? 4 : undefined)}
            text="I understand that at any point in the loan’s term, I will be able
              to close the loan early by selling sufficient amount of my Bitcoin
              to pay lenders. All profits will be mine."
            isOtherOpen={!!isOpen && isOpen !== 4}
            isChecked={conditions.fourth}
            onValueChange={(value) =>
              setConditions((prev) => ({ ...prev, fourth: value }))
            }
          />

          <div className="mt-4 border-t border-default-300 pl-3.5 pt-5">
            <Checkbox
              color="primary"
              className="!m-0 p-0"
              classNames={{
                base: 'items-start',
                wrapper: 'mr-3 mt-0 before:border-primary',
                label: 'text-primary text-sm',
              }}
              isSelected={
                conditions.first &&
                conditions.second &&
                conditions.third &&
                conditions.fourth
              }
              onValueChange={(value) =>
                setConditions({
                  first: value,
                  second: value,
                  third: value,
                  fourth: value,
                })
              }
            >
              Accept all loan conditions
            </Checkbox>
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2.5">
        <Button
          size="lg"
          startContent={<LuArrowLeft />}
          variant="light"
          className="px-0 text-[#777777] hover:!bg-transparent hover:text-default-d"
          onPress={() => setStep(0)}
          isLoading={isLoading}
        >
          Go Back
        </Button>

        <Tooltip
          content={continueButtonTooltipContent}
          isDisabled={!continueButtonDisabled}
          color="danger"
        >
          <Button
            className="font-bold data-[disabled=true]:pointer-events-auto data-[disabled=true]:cursor-not-allowed"
            color="primary"
            size="lg"
            isLoading={isLoading}
            onPress={() => setIsApproveModalOpen(true)}
            isDisabled={continueButtonDisabled}
          >
            Continue
          </Button>
        </Tooltip>
      </div>
    </Card>
  )
}

const LoanConditionItem = ({
  isOpen,
  setIsOpen,
  text,
  isOtherOpen,
  isChecked,
  onValueChange,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  text: string
  isOtherOpen: boolean
  isChecked: boolean
  onValueChange: (value: boolean) => void
}) => {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      if (!ref.current) return
      setSize({
        width: ref.current.clientWidth,
        height: ref.current.clientHeight,
      })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [ref])

  return (
    <Popover
      placement="bottom"
      offset={(size.height + 4) * -1}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      disableAnimation
      style={{ '--content-width': `${size.width}px` } as React.CSSProperties}
    >
      <PopoverTrigger>
        <div
          ref={ref}
          className={cn(
            'aria-expanded:scale-1 flex rounded-[10px] px-3.5 py-2.5 pr-2.5 transition hover:bg-default-200/70 aria-expanded:opacity-100',
            isOtherOpen && 'blur-sm'
          )}
        >
          <Checkbox
            color="primary"
            className="!m-0 p-0"
            classNames={{
              base: 'items-start',
              wrapper: 'mr-3 mt-0.5',
              label: 'text-default-d text-sm',
            }}
            isSelected={isChecked}
            onValueChange={onValueChange}
          >
            {text}
          </Checkbox>

          <span className="mt-0.5 p-1 text-default-a" role="button">
            {isOpen ? <BsCaretUpFill /> : <BsCaretDownFill />}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--content-width] bg-default-100 px-2 dark:bg-[#1F1F22]">
        <div className="mb-3 flex border-b border-default-300 px-1.5 py-2.5 pr-0.5 transition">
          <Checkbox
            color="primary"
            className="!m-0 p-0"
            classNames={{
              base: 'items-start',
              wrapper: 'mr-3 mt-0.5',
              label: 'text-default-d text-sm',
            }}
            isSelected={isChecked}
            onValueChange={onValueChange}
          >
            {text}
          </Checkbox>

          <span
            className="mt-0.5 p-1 text-default-a"
            role="button"
            onClick={() => setIsOpen(false)}
          >
            {isOpen ? <BsCaretUpFill /> : <BsCaretDownFill />}
          </span>
        </div>

        <div className="px-6 pb-4 text-sm text-default-d">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exe ullamco laboris nisi ut aliquip ex ea
          commod consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
        </div>
      </PopoverContent>
    </Popover>
  )
}

const formatUSDC = (amount: number | string | undefined) => {
  return numeral(amount).format('0,0.[00]')
}
