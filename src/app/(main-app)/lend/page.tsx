'use client'
import { MY_LENDINGS } from '@/components/borrow/data'
import { subtitle, title } from '@/components/primitives'
import Link from 'next/link'
import { LuPlus } from 'react-icons/lu'
import { Button, Card, CardBody, CardFooter, Tooltip } from '@heroui/react'
import numeral from 'numeral'
import { NoData } from '@/components/NoData'

export default function LendPage() {
  return (
    <div className="container mt-10 flex h-full w-full flex-col gap-4 pb-10">
      <div className="mb-8 flex items-center justify-between gap-4 max-lg:flex-col max-lg:text-center">
        <div>
          <h1 className={title({ size: 'sm', className: 'text-secondary' })}>
            My Lendings
          </h1>
          <h2 className={subtitle({ className: '!text-lg' })}>
            View your lending portfolio and your interest income
          </h2>
        </div>

        <Button
          startContent={<LuPlus />}
          color="secondary"
          variant="shadow"
          size="lg"
          as={Link}
          href="/lend/earn"
          className="font-medium"
        >
          Earn Interest
        </Button>
      </div>

      {MY_LENDINGS?.length ? (
        <div className="grid h-full w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {MY_LENDINGS.map((lending) => (
            <LendingCard key={lending.id} lending={lending} />
          ))}
        </div>
      ) : (
        <div className="space-y-2 text-center">
          <NoData message="You have no lending portfolio" />

          <Button
            startContent={<LuPlus />}
            color="secondary"
            variant="shadow"
            size="lg"
            as={Link}
            href="/lend/earn"
            className="font-medium"
          >
            Start Earning Interest
          </Button>
        </div>
      )}
    </div>
  )
}

const LendingCard = ({
  lending,
}: {
  lending: (typeof MY_LENDINGS)[number]
}) => {
  return (
    <Card className="px-3 py-4">
      <CardBody className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-default-600">Approved Amount</div>
            <div className="text-lg font-semibold text-secondary">
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
      </CardFooter>
    </Card>
  )
}
