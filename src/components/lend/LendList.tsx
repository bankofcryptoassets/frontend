import { Button, Card, CardBody, CardFooter, Tooltip } from '@heroui/react'
import { MY_LENDINGS } from '../borrow/data'
import numeral from 'numeral'

export const LendList = () => {
  return (
    <div className="grid h-full w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {MY_LENDINGS.map((lending) => (
        <LoanCard key={lending.id} lending={lending} />
      ))}
    </div>
  )
}

const LoanCard = ({ lending }: { lending: (typeof MY_LENDINGS)[number] }) => {
  return (
    <Card className="px-3 py-4">
      <CardBody className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-default-600">Approved Amount</div>
            <div className="text-lg font-semibold">
              {numeral(lending.approved).format('0,0.[00000000]')} USDC
            </div>
          </div>
          <div>
            <div className="text-xs text-default-600">Utilised Amount</div>
            <div className="text-lg font-semibold">
              {numeral(lending.utilised).format('0,0.[00000000]')} USDC
            </div>
          </div>
          <div>
            <div className="text-xs text-default-600">Yield Earned</div>
            <div className="text-lg font-semibold">
              {numeral(lending.yieldEarned).format('0,0.[00000000]')} USDC
            </div>
          </div>
          <div>
            <div className="text-xs text-default-600">Principal Returned</div>
            <div className="text-lg font-semibold">
              {numeral(lending.principalReturned).format('0,0.[00000000]')} USDC
            </div>
          </div>
        </div>

        {/* <div className="flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition hover:bg-default-200">
          <div>Approved Amount</div>
          <div>
            <span className="font-mono font-bold">{lending.approved}</span> USDC
          </div>
        </div>

        <div className="flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition hover:bg-default-200">
          <div>Utilised Amount</div>
          <div>
            <span className="font-mono font-bold">{lending.utilised}</span> USDC
          </div>
        </div>

        <div className="flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition hover:bg-default-200">
          <div>Yield Earned</div>
          <div>
            <span className="font-mono font-bold">{lending.yieldEarned}</span>{' '}
            USDC
          </div>
        </div>

        <div className="flex justify-between gap-2 rounded-lg px-2 py-1 text-sm font-medium transition hover:bg-default-200">
          <div>Principal Returned</div>
          <div>
            <span className="font-mono font-bold">
              {lending.principalReturned}
            </span>{' '}
            USDC
          </div>
        </div> */}
      </CardBody>

      <CardFooter className="flex w-full items-center gap-4">
        <Tooltip content="Coming Soon">
          <Button
            variant="ghost"
            color="secondary"
            fullWidth
            size="sm"
            isDisabled
            className="pointer-events-auto data-[disabled=true]:cursor-not-allowed"
          >
            Set Up Alerts
          </Button>
        </Tooltip>

        {/* <Tooltip content="Coming Soon">
          <Button
            variant="shadow"
            color="secondary"
            fullWidth
            size="sm"
            isDisabled
            className="pointer-events-auto data-[disabled=true]:cursor-not-allowed"
          >
            Withdraw
          </Button>
        </Tooltip> */}
      </CardFooter>
    </Card>
  )
}
