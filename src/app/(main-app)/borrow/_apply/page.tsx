'use client'
import { ApplyLoan } from '@/components/_borrow/ApplyLoan'
import { subtitle, title } from '@/components/primitives'
import { Button } from '@heroui/react'
import Link from 'next/link'
import { PiSquaresFour } from 'react-icons/pi'

export default function ApplyLoanPage() {
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

      <ApplyLoan />
    </div>
  )
}
