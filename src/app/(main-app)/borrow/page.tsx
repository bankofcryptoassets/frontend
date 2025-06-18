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
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
} from '@heroui/react'
import numeral from 'numeral'
import { NoData } from '@/components/NoData'
import { useAuth } from '@/auth/useAuth'
import { useAccount } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import axios from '@/utils/axios'
import { LoanRequestPayload } from '@/types'
import { ChatPopupWithProvider } from '@/components/chat/ChatPopupWithProvider'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type BorrowingData = {
  loans: LoanRequestPayload[]
}

export default function BorrowPage({
  searchParams,
}: {
  searchParams: Promise<{ insuranceLoanId: string }>
}) {
  const { insuranceLoanId } = use(searchParams)
  const router = useRouter()
  const { isAuth } = useAuth()
  const { address } = useAccount()
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false)
  const [showInsuranceChat, setShowInsuranceChat] = useState(false)
  const [isInsuranceChatOpen, setIsInsuranceChatOpen] = useState(false)
  const [loanId, setLoanId] = useState<string | null>(null)

  const handleShowInsuranceModal = (loanId: string) => {
    setLoanId(loanId)
    setIsInsuranceModalOpen(true)
  }

  const handleCloseInsuranceModal = () => {
    setIsInsuranceModalOpen(false)
  }

  const handleOpenInsuranceChat = () => {
    handleCloseInsuranceModal()
    setShowInsuranceChat(true)
    setTimeout(() => {
      setIsInsuranceChatOpen(true)
    }, 1)
  }

  const handleCloseInsuranceChat = () => {
    handleCloseInsuranceModal()
    setShowInsuranceChat(false)
    setIsInsuranceChatOpen(false)
    setLoanId(null)
  }

  useEffect(() => {
    if (insuranceLoanId) {
      handleShowInsuranceModal(insuranceLoanId)
      router.replace('/borrow')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insuranceLoanId])

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
          {data?.loans?.map((loan) => (
            <LoanCard
              key={loan._id}
              loan={loan}
              handleShowInsuranceModal={handleShowInsuranceModal}
            />
          ))}
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

      {!!address && !!isAuth && showInsuranceChat && (
        <ChatPopupWithProvider
          isOpen={isInsuranceChatOpen}
          setIsOpen={handleCloseInsuranceChat}
          loanId={loanId}
        />
      )}

      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isInsuranceModalOpen}
        onOpenChange={handleCloseInsuranceModal}
        backdrop="blur"
        classNames={{
          backdrop: 'bg-black/50',
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Congratulations! You are eligible for an insurance policy on your
            loan.
          </ModalHeader>
          <ModalBody>
            <p>
              You can now chat with our insurance agent to get more details
              about the policy and get a quote for the policy.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={handleCloseInsuranceModal}
            >
              Nope
            </Button>
            <Button
              color="primary"
              onPress={handleOpenInsuranceChat}
              className="font-medium"
            >
              Sure, Chat With Agent
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

const truncateLoanId = (loanId: string) => {
  if (!loanId) return ''
  if (loanId.length <= 14) return loanId
  const first6 = loanId.substring(0, 6)
  const last6 = loanId.substring(loanId.length - 6)
  return `${first6}...${last6}`
}

const LoanCard = ({
  loan,
  handleShowInsuranceModal,
}: {
  loan: LoanRequestPayload
  handleShowInsuranceModal: (loanId: string) => void
}) => {
  return (
    <Card className="px-3 py-4">
      <CardBody className="space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-xs text-default-600">Loan ID</div>
            <div className="text-lg font-semibold">
              #{truncateLoanId(loan.loan_id)}
            </div>
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
        <Button
          variant="ghost"
          color="primary"
          fullWidth
          size="sm"
          className="pointer-events-auto font-bold data-[disabled=true]:cursor-not-allowed"
          onPress={() => handleShowInsuranceModal(loan._id)}
        >
          Get an Insurance
        </Button>

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
