'use client'
import { Button, Card, Divider, Tab, Tabs } from '@heroui/react'
import { DCA_MINI_APP_URL, DEFAULT_BITCOIN_PRICE } from '@/utils/constants'
import { trackEvent } from '@/utils/trackEvent'
import NextLink from 'next/link'
import { useQuery } from '@tanstack/react-query'
import axios from '@/utils/axios'
import { BitcoinPriceData } from '@/types'
import { IoIosArrowRoundForward } from 'react-icons/io'
import { LoanCalculator } from './LoanCalculator'
import { DCACalculator } from './DCACalculator'
import { useCalculatorTabs } from '@/hooks/useCalculatorTabs'
import { useCTATabs } from '@/hooks/useCTATabs'

export const Calculators = () => {
  const { selected, setSelected } = useCalculatorTabs()
  const { setSelected: setCTASelected } = useCTATabs()
  const { data: bitcoinPrice } = useQuery({
    queryKey: ['/misc/btcExchangeRate'],
    queryFn: () =>
      axios.get<BitcoinPriceData>(`/misc/btcExchangeRate
`),
    staleTime: Infinity,
  })
  const btcPrice =
    bitcoinPrice?.data?.data?.convertedPrice || DEFAULT_BITCOIN_PRICE

  return (
    <Card
      className="bg-default-50/90 border-default-100 w-full max-w-md rounded-2xl border shadow-[0px_1px_0px_0px_#FEFEFE1A,0px_0px_4px_0px_#FFFFFF1F]"
      id="calculators"
    >
      <div className="p-6 max-sm:px-2.5">
        <Tabs
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key as 'dca' | 'loan')}
          variant="light"
          classNames={{
            panel: 'p-0',
            cursor: 'bg-white/10!',
            tabList: 'mx-auto pb-5',
            base: 'w-full',
            tabContent:
              'text-foreground/60 transition-colors group-data-[selected=true]:text-foreground',
          }}
        >
          <Tab key="dca" title="DCA Calculator">
            <Divider />

            <DCACalculator btcPrice={btcPrice} />

            <Button
              variant="shadow"
              color="primary"
              as={NextLink}
              href={DCA_MINI_APP_URL}
              target="_blank"
              className="h-13 w-full rounded-xl border-2 border-[#F6921A] bg-gradient-to-r from-[#F7931A] to-[#C46200] px-8 py-3.5 text-base font-bold"
              onPress={() => {
                trackEvent('clicked "Buy Bitcoin Everyday"')
              }}
              endContent={
                <IoIosArrowRoundForward size={24} className="stroke-4" />
              }
            >
              Buy Bitcoin Everyday
            </Button>
          </Tab>

          <Tab key="loan" title="Loan Calculator">
            <Divider />

            <LoanCalculator btcPrice={btcPrice} />

            <Button
              variant="shadow"
              color="primary"
              as={NextLink}
              href="/#cta"
              className="h-13 w-full rounded-xl border-2 border-[#F6921A] bg-gradient-to-r from-[#F7931A] to-[#C46200] px-8 py-3.5 text-base font-bold"
              onPress={() => {
                trackEvent('clicked "Join The Waitlist For Launch Alerts"')
                setCTASelected('loan')
              }}
              endContent={
                <IoIosArrowRoundForward size={24} className="stroke-4" />
              }
            >
              Join The Waitlist For Launch Alerts
            </Button>
          </Tab>
        </Tabs>
      </div>
    </Card>
  )
}
