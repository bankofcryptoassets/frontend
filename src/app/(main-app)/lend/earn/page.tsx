'use client'
import { EarnInterest } from '@/components/lend/EarnInterest'
import { subtitle, title } from '@/components/primitives'
import { Button } from '@heroui/react'
import Link from 'next/link'
import { PiSquaresFour } from 'react-icons/pi'

export default function EarnInterestPage() {
  return (
    <div className="container mt-10 flex h-full w-full flex-col gap-4 pb-10">
      <div className="mb-8 flex items-center justify-between gap-4 max-lg:flex-col max-lg:text-center">
        <div>
          <h1 className={title({ size: 'sm', className: 'text-secondary' })}>
            Earn Interest on Your USDC
          </h1>
          <h2 className={subtitle({ className: '!text-lg' })}>
            Lend your funds to Bitcoin borrowers and earn interest
          </h2>
        </div>

        <Button
          startContent={<PiSquaresFour />}
          color="secondary"
          variant="shadow"
          size="lg"
          as={Link}
          href="/lend"
          className="font-medium"
        >
          My Lendings
        </Button>
      </div>

      <EarnInterest />
    </div>
  )
}
