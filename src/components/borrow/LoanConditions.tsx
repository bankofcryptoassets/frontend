import { Button, Card, Checkbox } from '@heroui/react'
import { LuArrowLeft } from 'react-icons/lu'
import { BsCaretDownFill } from 'react-icons/bs'

type LoanConditionsProps = {
  setStep: (step: number) => void
  setIsModalOpen: (isOpen: boolean) => void
}

export const LoanConditions = ({
  setStep,
  setIsModalOpen,
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
                  1.22 BTC
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="text-xs leading-tight text-default-d">
                  Loan Duration
                </div>
                <div className="text-[32px] font-bold leading-tight text-default-d">
                  7Y
                </div>
              </div>
            </div>

            <div className="space-y-3 px-1 text-sm text-default-a">
              <div className="flex items-center justify-between gap-2">
                <span>Total Paid</span>
                <span className="text-right font-bold text-default-d">
                  20,000 USDC
                </span>
              </div>
              <div className="relative ml-7 flex items-center justify-between gap-2">
                <span className="absolute -left-6 -top-2.5 size-5 border-b border-l border-default-300" />
                <span>Principal</span>
                <span className="text-right">5,000 USDC</span>
              </div>
              <div className="relative ml-7 flex items-center justify-between gap-2">
                <span className="absolute -left-6 -top-6 size-5 h-9 border-b border-l border-default-300" />
                <span>Interest (11%)</span>
                <span className="text-right">2,200 USDC</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>Loan Origination Fees (1%)</span>
                <span className="text-right font-bold text-default-d">
                  100 USDC
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>Down Payment + Fees</span>
                <span className="text-right font-bold text-default-d">
                  1,000 USDC
                </span>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-default-300 px-1 pt-4 text-base font-medium text-default-d">
              <span>Monthly Payment</span>
              <span className="text-right text-xl font-bold text-primary">
                27,300 USDC
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

          <div className="flex rounded-[10px] px-3.5 py-2.5 pr-2.5 transition hover:bg-default-200/70">
            <Checkbox
              color="primary"
              className="!m-0 p-0"
              classNames={{
                base: 'items-start',
                wrapper: 'mr-3 mt-0.5',
                label: 'text-default-d text-sm',
              }}
            >
              If I Fail to Pay for a Month, a portion of my Bitcoin will be sold
              to cover monthly payments.
            </Checkbox>

            <span className="mt-0.5 p-1 text-default-a" role="button">
              <BsCaretDownFill />
            </span>
          </div>

          <div className="flex rounded-[10px] px-3.5 py-2.5 pr-2.5 transition hover:bg-default-200/70">
            <Checkbox
              color="primary"
              className="!m-0 p-0"
              classNames={{
                base: 'items-start',
                wrapper: 'mr-3 mt-0.5',
                label: 'text-default-d text-sm',
              }}
            >
              I understand that if i pay regularly on time, my interest rates
              will come down. If I miss, the interest rate discounts will
              disappear.
            </Checkbox>

            <span className="mt-0.5 p-1 text-default-a" role="button">
              <BsCaretDownFill />
            </span>
          </div>

          <div className="flex rounded-[10px] px-3.5 py-2.5 pr-2.5 transition hover:bg-default-200/70">
            <Checkbox
              color="primary"
              className="!m-0 p-0"
              classNames={{
                base: 'items-start',
                wrapper: 'mr-3 mt-0.5',
                label: 'text-default-d text-sm',
              }}
            >
              I understand that based on an unlock schedule, every month, I will
              be able to transfer a portion of my Bitcoin to any wallet.
            </Checkbox>

            <span className="mt-0.5 p-1 text-default-a" role="button">
              <BsCaretDownFill />
            </span>
          </div>

          <div className="flex rounded-[10px] px-3.5 py-2.5 pr-2.5 transition hover:bg-default-200/70">
            <Checkbox
              color="primary"
              className="!m-0 p-0"
              classNames={{
                base: 'items-start',
                wrapper: 'mr-3 mt-0.5',
                label: 'text-default-d text-sm',
              }}
            >
              I understand that at any point in the loan’s term, I will be able
              to close the loan early by selling sufficient amount of my Bitcoin
              to pay lenders. All profits will be mine.
            </Checkbox>

            <span className="mt-0.5 p-1 text-default-a" role="button">
              <BsCaretDownFill />
            </span>
          </div>

          <div className="mt-4 border-t border-default-300 pl-3.5 pt-5">
            <Checkbox
              color="primary"
              className="!m-0 p-0"
              classNames={{
                base: 'items-start',
                wrapper: 'mr-3 mt-0 before:border-primary',
                label: 'text-primary text-sm',
              }}
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
        >
          Go Back
        </Button>

        <Button
          className="font-bold"
          color="primary"
          size="lg"
          onPress={() => setIsModalOpen(true)}
        >
          Continue
        </Button>
      </div>
    </Card>
  )
}
