'use client'
import { LendList } from '@/components/lend/LendList'
import { subtitle, title } from '@/components/primitives'
import { Button } from '@heroui/react'
import Link from 'next/link'
import { LuPlus } from 'react-icons/lu'

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

      <LendList />
    </div>
  )
}
