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
    lendingAmount: string
    maxTimePeriod: string
    monthlyReceivable: string
    maximumYieldRecieved: string
  }
  isLoading: boolean
}

export const Summary = ({ loanSummary, isLoading }: Props) => {
  return (
    <Card className="relative z-0 w-full">
      {isLoading && (
        <div className="bg-default/50 absolute inset-0 z-1 grid place-items-center p-4 backdrop-blur-sm">
          <Spinner color="secondary" />
        </div>
      )}

      <CardHeader className="bg-default-300 p-3 px-4 font-bold">
        Summary
      </CardHeader>

      <CardBody className="space-y-6">
        <div className="space-y-2">
          <div className="hover:bg-default-200 flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition">
            <div className="flex items-center gap-1.5">
              Total Lending Amount
              <Tooltip content="The total amount of USDC you're committing to the lending pool">
                <LuInfo />
              </Tooltip>
            </div>
            <div>
              <span className="font-mono font-bold">
                {loanSummary?.lendingAmount}
              </span>{' '}
              USDC
            </div>
          </div>

          <div className="hover:bg-default-200 flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition">
            <div className="flex items-center gap-1.5">
              Maximum Duration
              <Tooltip content="The longest duration for which your funds could remain locked">
                <LuInfo />
              </Tooltip>
            </div>
            <div>
              <span className="font-mono font-bold">
                {loanSummary?.maxTimePeriod}
              </span>{' '}
              Months
            </div>
          </div>
        </div>
      </CardBody>

      <CardFooter className="flex w-full gap-4 p-0">
        <div className="bg-default-300 w-full space-y-2 p-2">
          <div className="hover:bg-default-200 flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition">
            <div className="flex items-center gap-1.5">
              Estimated Monthly Earnings
              <Tooltip content="The estimated amount of USDC you'll receive each month">
                <LuInfo />
              </Tooltip>
            </div>
            <div>
              <span className="font-mono font-bold">
                {loanSummary?.monthlyReceivable}
              </span>{' '}
              USDC
            </div>
          </div>

          <div className="hover:bg-default-200 flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition">
            <div className="flex items-center gap-1.5">
              Total Interest Earned
              <Tooltip content="The maximum interest you'll earn if the loan runs its full term">
                <LuInfo />
              </Tooltip>
            </div>
            <div>
              <span className="font-mono font-bold">
                {loanSummary?.maximumYieldRecieved}
              </span>{' '}
              USDC
            </div>
          </div>

          <div className="bg-content1 hover:bg-default-200 flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition">
            *Funds stay in your wallet until a borrower is matched.
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
