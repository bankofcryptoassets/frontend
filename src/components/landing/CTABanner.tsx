'use client'
import { JoinWaitlist } from './JoinWaitlist'
import { Button, Tabs } from '@heroui/react'
import { Tab } from '@heroui/react'
import { DCA_MINI_APP_URL } from '@/utils/constants'
import { trackEvent } from '@/utils/trackEvent'
import NextLink from 'next/link'
import Image from 'next/image'
import { useCTATabs } from '@/hooks/useCTATabs'

export const CTABanner = () => {
  const { selected, setSelected } = useCTATabs()

  return (
    <section
      className="relative container mb-50 max-w-[1360px] max-lg:mb-30 min-[87.5rem]:px-0!"
      id="cta"
    >
      {/* <>
        <Glow className="absolute -top-20 left-full h-[158px] w-[72px] rotate-22 blur-[100px]" />
      </> */}

      <div className="rounded-lg bg-transparent bg-[linear-gradient(360deg,_#F7931A_1.8%,_rgba(247,_147,_26,_0.192157)_89.98%)] p-px">
        <div className="bg-background relative isolate z-1 w-full gap-4 rounded-lg px-20 py-10 max-lg:px-4">
          <Image
            src="/extras/cta-bg-glow.svg"
            alt="CTA Banner"
            width={1360}
            height={100}
            className="pointer-events-none absolute right-0 bottom-0 left-0 -z-1 select-none"
          />

          <Tabs
            selectedKey={selected}
            onSelectionChange={(key) => setSelected(key as 'dca' | 'loan')}
            variant="light"
            classNames={{
              panel: 'p-0',
              cursor: 'bg-primary!',
              tabList: 'mx-auto mb-10 bg-white/10!',
              base: 'w-full',
              tabContent:
                'text-foreground/50 transition-colors group-data-[selected=true]:text-[#452B0B] font-medium',
            }}
          >
            <Tab key="dca" title="Bitmor DCA">
              <div className="flex flex-col items-center justify-center gap-10">
                <div className="flex flex-col items-center justify-center gap-4">
                  <h1 className="text-foreground text-5xl leading-[1.15] font-medium max-lg:text-center max-lg:text-4xl">
                    Start A Bitcoin DCA
                  </h1>
                  <p className="text-foreground/70 text-base leading-tight font-normal max-lg:text-center">
                    Don&apos;t just watch future, be a part of it.
                  </p>
                </div>

                <Button
                  variant="shadow"
                  color="primary"
                  as={NextLink}
                  href={DCA_MINI_APP_URL}
                  target="_blank"
                  className="h-13 rounded-xl border-2 border-[#F6921A] bg-gradient-to-r from-[#F7931A] to-[#C46200] px-8 py-3.5 text-base font-bold"
                  onPress={() => {
                    trackEvent('clicked "Buy Bitcoin Everyday"')
                  }}
                >
                  Buy Bitcoin Everyday
                </Button>
              </div>
            </Tab>

            <Tab key="loan" title="Bitmor Loans">
              <div className="flex flex-col items-center justify-center gap-10">
                <div className="flex flex-col items-center justify-center gap-4">
                  <h1 className="text-foreground text-5xl leading-[1.15] font-medium max-lg:text-center max-lg:text-4xl">
                    Start A Bitcoin Loan
                  </h1>
                  <p className="text-foreground/70 text-base leading-tight font-normal max-lg:text-center">
                    Don&apos;t just watch future, be a part of it.
                  </p>
                </div>

                <JoinWaitlist />
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
