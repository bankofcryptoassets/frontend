'use client'
import { LuPlus } from 'react-icons/lu'
import { subtitle, title } from '@/components/primitives'
import Link from 'next/link'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Tooltip,
} from '@heroui/react'
import numeral from 'numeral'
import { NoData } from '@/components/NoData'
import { useAuth } from '@/auth/useAuth'
import { useAccount } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import axios from '@/utils/axios'
import { LoanRequestPayload } from '@/types'

type BorrowingData = {
  loans: LoanRequestPayload[]
}

// import { MY_BORROWINGS } from '@/components/borrow/data'
// const data = {
//   loans: MY_BORROWINGS,
// }

export default function BorrowPage() {
  const { isAuth } = useAuth()
  const { address } = useAccount()

  const { data } = useQuery({
    queryKey: ['loan', address, isAuth],
    queryFn: async ({ signal }) => {
      const response = await axios.get<BorrowingData>('/loan', { signal })
      return response.data
    },
    enabled: !!address && !!isAuth,
  })

  return (
    <div className="container mt-10 flex h-full w-full flex-col gap-4 pb-10">
      <div className="mb-8 flex items-center justify-between gap-4 max-lg:flex-col max-lg:text-center">
        <div>
          <h1 className={title({ size: 'sm', className: 'text-primary' })}>
            My Borrowings
          </h1>
          <h2 className={subtitle({ className: '!text-lg' })}>
            View and manage your Bitcoin loan portfolio
          </h2>
        </div>

        <Button
          startContent={<LuPlus />}
          color="primary"
          variant="shadow"
          size="lg"
          as={Link}
          href="/borrow/apply"
          className="font-medium"
        >
          Apply New Loan
        </Button>
      </div>

      {data?.loans?.length ? (
        <div className="grid h-full w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data?.loans?.map((loan) => <LoanCard key={loan._id} loan={loan} />)}
        </div>
      ) : (
        <div className="space-y-2 text-center">
          <NoData message="You have no bitcoin loan portfolio" />

          <Button
            startContent={<LuPlus />}
            color="primary"
            variant="shadow"
            size="lg"
            as={Link}
            href="/borrow/apply"
            className="font-medium"
          >
            Start Getting Your Bitcoin
          </Button>
        </div>
      )}
    </div>
  )
}

const LoanCard = ({ loan }: { loan: LoanRequestPayload }) => {
  return (
    <Card className="px-3 py-4">
      <CardBody className="space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-xs text-default-600">Loan ID</div>
            <div className="text-lg font-semibold">#{loan.loan_id}</div>
          </div>

          <Chip
            color={
              loan.is_liquidated || loan.is_defaulted
                ? 'danger'
                : loan.is_repaid
                  ? 'success'
                  : loan.is_active
                    ? 'success'
                    : 'danger'
            }
            size="sm"
            classNames={{ content: 'font-medium' }}
          >
            Loan Status:{' '}
            {loan.is_liquidated
              ? 'Liquidated'
              : loan.is_defaulted
                ? 'Defaulted'
                : loan.is_repaid
                  ? 'Closed'
                  : loan.is_active
                    ? 'Active'
                    : 'Unknown'}
          </Chip>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-default-600">BTC Loaned</div>
            <div className="text-lg font-semibold text-primary">
              {numeral(loan.asset_borrowed).format('0,0.[00000000]')} BTC
            </div>
          </div>
          <div>
            <div className="text-xs text-default-600">Outstanding</div>
            <div className="font-semibold">
              {numeral(loan.remaining_amount).format('0,0.[00000000]')} USDC
            </div>
          </div>
          <div>
            <div className="text-xs text-default-600">BTC Recieved</div>
            <div className="font-semibold">
              {numeral(loan.asset_borrowed - loan.asset_remaining).format(
                '0,0.[00000000]'
              )}{' '}
              BTC
            </div>
          </div>
          <div>
            <div className="text-xs text-default-600">Principal Paid</div>
            <div className="font-semibold">
              {numeral(
                loan.total_amount_payable - loan.remaining_amount
              ).format('0,0.[00000000]')}{' '}
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
