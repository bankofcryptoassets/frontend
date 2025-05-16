import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Progress,
  Select,
  SelectItem,
  Tooltip,
} from '@heroui/react'
import { MY_BORROWINGS, SORTINGS } from './data'

export const BorrowList = () => {
  return (
    <div className="space-y-8">
      <div className="text-right">
        <Select className="max-w-xs" label="Sort by">
          {SORTINGS.map((sorting) => (
            <SelectItem key={sorting.key}>{sorting.label}</SelectItem>
          ))}
        </Select>
      </div>

      <div className="grid h-full w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {MY_BORROWINGS.map((borrowing) => (
          <LoanCard key={borrowing.id} borrowing={borrowing} />
        ))}
      </div>
    </div>
  )
}

const LoanCard = ({
  borrowing,
}: {
  borrowing: (typeof MY_BORROWINGS)[number]
}) => {
  return (
    <Card className="px-1 py-2">
      <CardBody className="space-y-6">
        <div className="text-center font-mono font-medium">
          ID: {borrowing.id}
        </div>

        <div className="flex items-center justify-between gap-4 px-1">
          <div className="whitespace-nowrap text-lg">
            <span className="font-mono font-bold">{borrowing.loanAmount}</span>{' '}
            BTC
          </div>

          <div className="relative z-0 w-full">
            <div className="absolute inset-0 bottom-0.5 z-[1] grid place-items-center text-sm font-medium leading-none text-foreground">
              {borrowing?.loanStatus === 'Active'
                ? `Loan Health: ${borrowing.loanHealth}%`
                : `Loan ${borrowing.loanStatus}${borrowing.defaultDuration ? ` - ${borrowing.defaultDuration}` : ''}`}
            </div>

            <Progress
              aria-label="Loan Health"
              size="lg"
              value={borrowing.loanHealth}
              color={
                borrowing.loanStatus === 'Liquidated' ||
                borrowing.loanStatus === 'Defaulted'
                  ? 'danger'
                  : borrowing.loanHealth >= 66 ||
                      borrowing?.loanStatus === 'Closed'
                    ? 'success'
                    : borrowing.loanHealth >= 33
                      ? 'warning'
                      : 'danger'
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition hover:bg-default-200">
            <div>Outstanding Amount</div>
            <div>
              <span className="font-mono font-bold">
                {borrowing.outstandingAmount}
              </span>{' '}
              USDC
            </div>
          </div>

          <div className="flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition hover:bg-default-200">
            <div>BTC Received</div>
            <div>
              <span className="font-mono font-bold">
                {borrowing.btcReceived}
              </span>{' '}
              USDC
            </div>
          </div>

          <div className="flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition hover:bg-default-200">
            <div>Principal Paid</div>
            <div>
              <span className="font-mono font-bold">
                {borrowing.principalPaid}
              </span>{' '}
              USDC
            </div>
          </div>

          <div className="flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition hover:bg-default-200">
            <div>Interest Paid</div>
            <div>
              <span className="font-mono font-bold">
                {borrowing.interestPaid}
              </span>{' '}
              USDC
            </div>
          </div>
        </div>
      </CardBody>

      <CardFooter className="flex w-full items-center gap-4">
        <Tooltip content="Coming Soon">
          <Button
            variant="ghost"
            color="primary"
            fullWidth
            size="sm"
            isDisabled
            className="pointer-events-auto data-[disabled=true]:cursor-not-allowed"
          >
            Set Up Alerts
          </Button>
        </Tooltip>

        <Tooltip content="Coming Soon">
          <Button
            variant="shadow"
            color="primary"
            fullWidth
            size="sm"
            isDisabled
            className="pointer-events-auto data-[disabled=true]:cursor-not-allowed"
          >
            Close The Loan
          </Button>
        </Tooltip>
      </CardFooter>
    </Card>
  )
}
