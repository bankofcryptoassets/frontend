import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Tooltip,
} from '@heroui/react'
import { MY_BORROWINGS } from './data'
import numeral from 'numeral'

export const BorrowList = () => {
  return (
    <div className="grid h-full w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {MY_BORROWINGS.map((borrowing) => (
        <LoanCard key={borrowing.id} borrowing={borrowing} />
      ))}
      {/* <NoData /> */}
    </div>
  )
}

const LoanCard = ({
  borrowing,
}: {
  borrowing: (typeof MY_BORROWINGS)[number]
}) => {
  return (
    <Card className="px-3 py-4">
      <CardBody className="space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-xs text-default-600">Loan ID</div>
            <div className="text-lg font-semibold">#BTM-{borrowing.id}</div>
          </div>

          <Chip
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
            size="sm"
            classNames={{ content: 'font-medium' }}
          >
            Loan Status: {borrowing.loanStatus}
          </Chip>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-default-600">BTC Loaned</div>
            <div className="text-lg font-semibold text-primary">
              {numeral(borrowing.loanAmount).format('0,0.[00000000]')} BTC
            </div>
          </div>
          <div>
            <div className="text-xs text-default-600">Outstanding</div>
            <div className="font-semibold">
              {numeral(borrowing.outstandingAmount).format('0,0.[00000000]')}{' '}
              USDC
            </div>
          </div>
          <div>
            <div className="text-xs text-default-600">BTC Recieved</div>
            <div className="font-semibold">
              {numeral(borrowing.btcReceived).format('0,0.[00000000]')} BTC
            </div>
          </div>
          <div>
            <div className="text-xs text-default-600">Principal Paid</div>
            <div className="font-semibold">
              {numeral(borrowing.principalPaid).format('0,0.[00000000]')} USDC
            </div>
          </div>
        </div>

        {/* <div className="relative z-0 w-full">
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
        </div> */}
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
