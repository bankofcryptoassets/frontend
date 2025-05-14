'use client'
import { MY_LENDINGS } from '@/components/borrow/data'
import { EarnInterest } from '@/components/lend/EarnInterest'
import { LendList } from '@/components/lend/LendList'
import { Chip, Tab, Tabs } from '@heroui/react'
import { LuPlus } from 'react-icons/lu'

export default function LendPage() {
  return (
    <div className="container mt-4 flex h-full w-full flex-col gap-4">
      <Tabs
        aria-label="Options"
        classNames={{
          tabList:
            'gap-6 w-full relative rounded-none p-0 border-b border-divider',
          cursor: 'w-full',
          tab: 'max-w-fit px-0 h-12',
          tabContent: 'group-data-[selected=true]:text-secondary-600',
        }}
        color="secondary"
        variant="underlined"
        size="lg"
      >
        <Tab
          key="photos"
          title={
            <div className="flex items-center space-x-2 font-bold">
              <span>My Lendings</span>
              {!!MY_LENDINGS?.length && (
                <Chip
                  size="sm"
                  variant="faded"
                  color="secondary"
                  className="text-secondary-600"
                >
                  {MY_LENDINGS?.length}
                </Chip>
              )}
            </div>
          }
        >
          <LendList />
        </Tab>

        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              <span>Earn Interest</span>
              <Chip
                size="sm"
                variant="faded"
                color="secondary"
                className="text-secondary-600"
              >
                <LuPlus />
              </Chip>
            </div>
          }
        >
          <EarnInterest />
        </Tab>
      </Tabs>
    </div>
  )
}
