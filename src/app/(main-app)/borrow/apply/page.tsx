'use client'
import { useAuth } from '@/auth/useAuth'
import { ApplyLoan } from '@/components/borrow/ApplyLoan'
import { ChatPopupWithProvider } from '@/components/chat/ChatPopupWithProvider'
import { subtitle, title } from '@/components/primitives'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
} from '@heroui/react'
import Link from 'next/link'
import { useState } from 'react'
import { PiSquaresFour } from 'react-icons/pi'
import { useAccount } from 'wagmi'

export default function ApplyLoanPage() {
  const { address } = useAccount()
  const { isAuth } = useAuth()
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

  return (
    <div className="container mt-10 flex h-full w-full flex-col gap-4 pb-10">
      <div className="mb-8 flex items-center justify-between gap-4 max-lg:flex-col max-lg:text-center">
        <div>
          <h1 className={title({ size: 'sm', className: 'text-primary' })}>
            Apply for a New Loan
          </h1>
          <h2 className={subtitle({ className: '!text-lg' })}>
            Customize your loan parameters and get BTC with just 20% down
            payment
          </h2>
        </div>

        <Button
          startContent={<PiSquaresFour />}
          color="primary"
          variant="shadow"
          size="lg"
          as={Link}
          href="/borrow"
          className="font-medium"
        >
          My Borrowings
        </Button>
      </div>

      <ApplyLoan handleShowInsuranceModal={handleShowInsuranceModal} />

      {!!address && !!isAuth && showInsuranceChat && (
        <ChatPopupWithProvider
          isOpen={isInsuranceChatOpen}
          setIsOpen={setIsInsuranceChatOpen}
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
            Congratulations! You are eligible for an insurance policy.
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
