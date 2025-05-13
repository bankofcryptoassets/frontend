'use client'
import { MY_BORROWINGS } from '@/components/borrow/data'
import { BorrowList } from '@/components/borrow/BorrowList'
import { Chip, Tab, Tabs } from '@heroui/react'
import { LuPlus } from 'react-icons/lu'
import { ApplyLoan } from '@/components/borrow/ApplyLoan'

export default function BorrowPage() {
  return (
    <div className="container mt-4 flex h-full w-full flex-col gap-4">
      <Tabs
        aria-label="Options"
        classNames={{
          tabList:
            'gap-6 w-full relative rounded-none p-0 border-b border-divider',
          cursor: 'w-full',
          tab: 'max-w-fit px-0 h-12',
        }}
        color="primary"
        variant="underlined"
        size="lg"
      >
        <Tab
          key="photos"
          title={
            <div className="flex items-center space-x-2 font-bold">
              <span>My Borrwings</span>
              {!!MY_BORROWINGS?.length && (
                <Chip size="sm" variant="faded" color="primary">
                  {MY_BORROWINGS?.length}
                </Chip>
              )}
            </div>
          }
        >
          <BorrowList />
        </Tab>

        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              <span>Apply New Loan</span>
              <Chip size="sm" variant="faded" color="primary">
                <LuPlus />
              </Chip>
            </div>
          }
        >
          <ApplyLoan />
        </Tab>
      </Tabs>
    </div>
  )
}
