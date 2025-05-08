'use client'
import SlotCounter from 'react-slot-counter'
import numeral from 'numeral'
import {
  LuCircleCheckBig,
  LuCircleDollarSign,
  LuTrendingUp,
} from 'react-icons/lu'

export const Stats = () => {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 place-items-center gap-4 lg:grid-cols-3">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div className="rounded-full bg-primary-50 p-2">
            <LuCircleCheckBig className="text-primary" size={20} />
          </div>

          <SlotCounter
            useMonospaceWidth
            value={numeral(1069).format('0,0')}
            animateOnVisible={{ triggerOnce: true }}
            charClassName="text-foreground text-3xl font-bold font-mono"
            separatorClassName="text-foreground text-3xl font-bold font-mono"
          />

          <div className="font-medium text-foreground">
            Full BTC Owners Created
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div className="rounded-full bg-success-50 p-2">
            <LuCircleDollarSign className="text-success" size={20} />
          </div>

          <SlotCounter
            useMonospaceWidth
            value={numeral(1032300).format('$0,0')}
            animateOnVisible={{ triggerOnce: true }}
            charClassName="text-foreground text-3xl font-bold font-mono"
            separatorClassName="text-foreground text-3xl font-bold font-mono"
          />

          <div className="font-medium text-foreground">Paid Out to Lenders</div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div className="rounded-full bg-secondary-50 p-2">
            <LuTrendingUp className="text-secondary" size={20} />
          </div>

          <SlotCounter
            useMonospaceWidth
            value={numeral(0.87).format('0%')}
            animateOnVisible={{ triggerOnce: true }}
            charClassName="text-foreground text-3xl font-bold font-mono"
            separatorClassName="text-foreground text-3xl font-bold font-mono"
          />

          <div className="font-medium text-foreground">
            of Loans Repaid Profitably
          </div>
        </div>
      </div>
    </div>
  )
}
