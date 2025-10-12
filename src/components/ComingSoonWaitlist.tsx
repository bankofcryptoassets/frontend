'use client'
import { Card } from '@heroui/react'
import { JoinWishlist } from './landing/JoinWishlist'
import { NoData } from './NoData'

export const ComingSoonWaitlist = ({
  title,
  id,
}: {
  title: string
  id: string
}) => {
  return (
    <div
      className="container mt-10 flex h-full w-full flex-col gap-4 pb-10"
      id={id}
    >
      <div className="mb-8 flex items-center justify-between gap-4 max-lg:flex-col max-lg:text-center">
        <div>
          <h1 className="text-primary inline text-3xl font-bold tracking-tight lg:text-4xl">
            {title}
          </h1>
        </div>
      </div>

      <Card className="border-default-200/40 bg-default-100/80 min-h-fit w-full space-y-6 rounded-2xl border p-7 pb-[30px]">
        <div className="space-y-2 text-center">
          <NoData
            message={
              <>
                Coming soon
                <br />
                Join the waitlist to get notified when we launch.
              </>
            }
          />
        </div>

        <div className="flex items-center justify-center">
          <JoinWishlist />
        </div>
      </Card>
    </div>
  )
}
