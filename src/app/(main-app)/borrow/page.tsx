'use client'
import { Card, Link, Tooltip } from '@heroui/react'
import Image from 'next/image'
import NextLink from 'next/link'
import { LuInfo } from 'react-icons/lu'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPagination,
} from '@/components/Carousel'
import Autoplay from 'embla-carousel-autoplay'
import { useState } from 'react'
import { StyledModal } from '@/components/StyledModal'
import { BTCGoal } from '@/components/borrow/BTCGoal'
import { LoanConditions } from '@/components/borrow/LoanConditions'

export default function BorrowPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [step, setStep] = useState(0)

  return (
    <div
      className="container mt-10 grid h-full min-h-[calc(100vh-7rem)] w-full grid-cols-[280px_1fr] gap-5 pb-[60px] max-lg:grid-cols-1"
      id="borrow-page"
    >
      <StyledModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />

      <div className="flex h-full w-full flex-col gap-4">
        <Card className="min-h-fit w-full space-y-6 rounded-2xl border border-default-200/40 bg-default-100/80 p-7 pb-[30px]">
          <div>
            <div className="text-xs text-default-a">Your BTC Balance</div>
            <div className="mt-0.5 text-[28px] font-bold leading-tight text-primary">
              1.243 <span className="text-xl">BTC</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-default-a">
              BTC Borrowers on Bitmor
            </div>
            <div className="mt-0.5 text-[28px] font-bold leading-tight text-default-d">
              2,342
            </div>
          </div>

          <div>
            <div className="text-xs text-default-a">BTC Borrowed on Bitmor</div>
            <div className="mt-0.5 text-[28px] font-bold leading-tight text-default-d">
              100.24 <span className="text-xl">BTC</span>
            </div>
          </div>
        </Card>

        <Card className="min-h-fit w-full rounded-2xl border border-default-200/40 bg-default-100/80 p-4 pb-6">
          <div className="mb-5 flex items-center justify-between border-b border-default-200 pb-3.5 pl-1 text-base font-medium text-default-d">
            <span>Fear and Greed Index</span>
            <Tooltip content="Fear and Greed Index">
              <LuInfo size={14} className="cursor-pointer text-default-600" />
            </Tooltip>
          </div>

          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-[32px] font-bold leading-tight text-default-d">
                75
              </span>
              <span className="text-sm font-medium leading-tight text-default-a">
                Fear
              </span>
            </div>

            <div className="h-12 w-px bg-default-300" />

            <div>
              <Image
                src="/extras/fear-and-greed.png"
                alt="Fear and Greed Index"
                width={120}
                height={62}
              />
            </div>
          </div>
        </Card>

        <Card className="h-full w-full rounded-2xl border border-default-200/40 bg-default-100/80 p-4">
          <div className="mb-[18px] border-b border-default-200 pb-3.5 pl-1 text-base font-medium text-default-d">
            Bitmor Way
          </div>

          <Carousel
            opts={{ loop: true }}
            plugins={[Autoplay({ delay: 4000 })]}
            className="mb-4"
          >
            <CarouselContent>
              <CarouselItem>
                <div className="flex items-center gap-3 max-lg:justify-center">
                  <div className="rounded-full bg-success-50 p-[5px]">
                    <Image
                      src="/icons/shield-money.png"
                      alt="Shield Money Icon"
                      width={18}
                      height={18}
                      className="size-[18px] min-w-[18px]"
                    />
                  </div>
                  <div className="text-sm text-default-d">
                    Transparent monthly
                    <br />
                    payments, no hidden fees
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="flex items-center gap-3 max-lg:justify-center">
                  <div className="rounded-full bg-[#2C1542]/10 p-[5px] dark:bg-[#2C1542]">
                    <Image
                      src="/icons/up-down.png"
                      alt="Up Down Icon"
                      width={18}
                      height={18}
                      className="size-[18px] min-w-[18px]"
                    />
                  </div>
                  <div className="text-sm text-default-d">
                    Failed to Pay a month?
                    <br />
                    Micro Liquidation.
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="flex items-center gap-3 max-lg:justify-center">
                  <div className="min-w-7 rounded-full bg-primary-50 p-[5px]">
                    <Image
                      src="/icons/btc-outline.svg"
                      alt="Bitcoin"
                      width={18}
                      height={18}
                      className="size-[18px] min-w-[18px]"
                    />
                  </div>
                  <div className="text-sm text-default-d">
                    Yield on 100% BTC from
                    <br />
                    Day 1
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="flex items-center gap-3 max-lg:justify-center">
                  <div className="rounded-full bg-secondary-50 p-[5px]">
                    <Image
                      src="/icons/clock.png"
                      alt="Clock Icon"
                      width={18}
                      height={18}
                      className="size-[18px] min-w-[18px]"
                    />
                  </div>
                  <div className="text-sm text-default-d">
                    No complex paperwork.
                    <br />
                    Own Bitcoin in minutes
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPagination />
          </Carousel>

          <div className="!mt-auto flex w-full border-t border-default-200 pb-0.5 pt-4">
            <Link
              as={NextLink}
              href="/"
              color="primary"
              className="mx-auto text-sm font-medium"
            >
              Talk to a Representative
            </Link>
          </div>
        </Card>
      </div>

      {step === 0 && <BTCGoal setStep={setStep} />}
      {step === 1 && (
        <LoanConditions setStep={setStep} setIsModalOpen={setIsModalOpen} />
      )}
    </div>
  )
}
