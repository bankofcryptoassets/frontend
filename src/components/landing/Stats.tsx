import { LuShieldCheck } from 'react-icons/lu'
import Image from 'next/image'
import { FaRegClock } from 'react-icons/fa6'

export const Stats = () => {
  return (
    <section className="container pb-16 pt-12 max-lg:pb-12" id="stats">
      <div className="grid grid-cols-1 place-items-center gap-4 lg:grid-cols-3">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="min-w-9 rounded-full bg-primary-50 p-1.5">
            <Image
              src="/icons/btc-outline.svg"
              alt="Bitcoin"
              width={24}
              height={24}
              className="size-[24px] min-w-[24px]"
            />
          </div>
          <div className="mt-2.5 text-[28px] font-bold leading-tight text-default-e">
            Early Ownership
          </div>
          <div className="mt-0.5 font-medium text-default-a">
            Own BTC upfront with just 20% deposit
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <div className="min-w-9 rounded-full bg-[#2C1542]/10 p-[7px] dark:bg-[#2C1542]">
            <FaRegClock size={22} className="text-[#9C12F2]" />
          </div>
          <div className="mt-2.5 text-[28px] font-bold leading-tight text-default-e">
            Flexible Terms
          </div>
          <div className="mt-0.5 font-medium text-default-a">
            Pay monthly. Prepay anytime
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <div className="min-w-9 rounded-full bg-success-50 p-[7px]">
            <LuShieldCheck size={22} className="text-success" />
          </div>
          <div className="mt-2.5 text-[28px] font-bold leading-tight text-default-e">
            Volatility Proof
          </div>
          <div className="mt-0.5 font-medium text-default-a">
            No liquidations, even when markets swing
          </div>
        </div>
      </div>
    </section>
  )
}
