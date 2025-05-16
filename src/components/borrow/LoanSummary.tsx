import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Spinner,
  Tooltip,
} from '@heroui/react'
import { LuInfo } from 'react-icons/lu'

type Props = {
  loanSummary: {
    minDownPayment: string
    principalAmount: string
    monthlyEMI: string
    interestAmount: string
    totalPayable: string
    assetReceived: string
  }
  isLoading: boolean
}

export const LoanSummary = ({ loanSummary, isLoading }: Props) => {
  return (
    <Card className="relative z-0 w-full">
      {isLoading && (
        <div className="absolute inset-0 z-[1] grid place-items-center bg-default/50 p-4 backdrop-blur-sm">
          <Spinner color="primary" />
        </div>
      )}

      <CardHeader className="bg-default-300 p-3 px-4 font-bold">
        Loan Summary
      </CardHeader>

      <CardBody className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition hover:bg-default-200">
            <div className="flex items-center gap-1.5">
              Minimum Down Payment
              <Tooltip content="The upfront amount you need to pay before the loan is approved">
                <LuInfo />
              </Tooltip>
            </div>
            <div>
              <span className="font-mono font-bold">
                {loanSummary?.minDownPayment}
              </span>{' '}
              USDC
            </div>
          </div>

          <div className="flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition hover:bg-default-200">
            <div className="flex items-center gap-1.5">
              Loan Amount (Principal)
              <Tooltip content="The core amount you're borrowing, not including interest or fees">
                <LuInfo />
              </Tooltip>
            </div>
            <div>
              <span className="font-mono font-bold">
                {loanSummary?.principalAmount}
              </span>{' '}
              USDC
            </div>
          </div>

          <div className="flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition hover:bg-default-200">
            <div className="flex items-center gap-1.5">
              Total Interest
              <Tooltip content="The total interest you'll pay over the loan duration">
                <LuInfo />
              </Tooltip>
            </div>
            <div>
              <span className="font-mono font-bold">
                {loanSummary?.interestAmount}
              </span>{' '}
              USDC
            </div>
          </div>

          <div className="flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition hover:bg-default-200">
            <div className="flex items-center gap-1.5">
              Total Repayment Amount
              <Tooltip content="This is the full amount you'll repay including interest and principal">
                <LuInfo />
              </Tooltip>
            </div>
            <div>
              <span className="font-mono font-bold">
                {loanSummary?.totalPayable}
              </span>{' '}
              USDC
            </div>
          </div>
        </div>
      </CardBody>

      <CardFooter className="flex w-full gap-4 p-0">
        <div className="w-full space-y-2 bg-default-300 p-2">
          <div className="flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition hover:bg-default-200">
            <div>BTC You Will Receive</div>
            <div>
              <span className="font-mono font-bold">
                {loanSummary?.assetReceived}
              </span>{' '}
              cbBTC
            </div>
          </div>

          <div className="flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition hover:bg-default-200">
            <div className="flex items-center gap-1.5">
              Monthly Payment (EMI)
              <Tooltip content="Your monthly installment including principal and interest">
                <LuInfo />
              </Tooltip>
            </div>
            <div>
              <span className="font-mono font-bold">
                {loanSummary?.monthlyEMI}
              </span>{' '}
              USDC
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
