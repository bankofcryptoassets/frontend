'use client'
import { subtitle, title } from '@/components/primitives'
import Link from 'next/link'
import { LuPlus } from 'react-icons/lu'
import { Button, Card, CardBody, CardFooter, Tooltip } from '@heroui/react'
import numeral from 'numeral'
import { NoData } from '@/components/NoData'
import { useQuery } from '@tanstack/react-query'
import axios from '@/utils/axios'
import { useAccount } from 'wagmi'
import { useAuth } from '@/auth/useAuth'

type LendingData = {
  lendings: {
    _id: string
    user_id: string
    loan_id: string
    amount: number
    received_interest: number
    total_received: number
  }[]
}

// import { MY_LENDINGS } from '@/components/borrow/data'
// const data = {
//   lendings: MY_LENDINGS,
// }

export default function LendPage() {
  const { isAuth } = useAuth()
  const { address } = useAccount()

  const { data } = useQuery({
    queryKey: ['lending', address, isAuth],
    queryFn: async ({ signal }) => {
      const response = await axios.get<LendingData>('/lending', { signal })
      return response.data
    },
    enabled: !!address && !!isAuth,
  })

  return (
    <div
      className="container mt-10 flex h-full w-full flex-col gap-4 pb-10"
      id="lend-page"
    >
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

      {data?.lendings?.length ? (
        <div className="grid h-full w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data?.lendings?.map((lending) => (
            <LendingCard key={lending._id} lending={lending} />
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
  lending: LendingData['lendings'][number]
}) => {
  return (
    <Card className="px-3 py-4">
      <CardBody className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-default-600">Approved Amount</div>
            <div className="text-lg font-semibold text-secondary">
              {numeral(lending.amount).format('0,0.[00000000]')} USDC
            </div>
          </div>
          <div>
            <div className="text-xs text-default-600">Utilised Amount</div>
            <div className="text-lg font-semibold">
              {numeral(lending.amount).format('0,0.[00000000]')} USDC
            </div>
          </div>
          <div>
            <div className="text-xs text-default-600">Yield Earned</div>
            <div className="text-lg font-semibold">
              {numeral(lending.received_interest).format('0,0.[00000000]')} USDC
            </div>
          </div>
          <div>
            <div className="text-xs text-default-600">Principal Returned</div>
            <div className="text-lg font-semibold">
              {numeral(lending.total_received).format('0,0.[00000000]')} USDC
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
