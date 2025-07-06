import { LuShieldCheck } from 'react-icons/lu'
import Image from 'next/image'
import { CiCalendar } from 'react-icons/ci'
import { BsLightning } from 'react-icons/bs'

export const Stats = () => {
  return (
    <section className="container pb-16 pt-12 max-lg:pb-12" id="stats">
      <div className="grid grid-cols-1 place-items-center gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="size-9 min-w-9 rounded-full bg-primary-50 p-[7px]">
            <BsLightning size={22} className="text-primary" />
          </div>
          <div className="mt-2.5 text-[22px] font-bold leading-tight text-default-e">
            Instant Approval
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <div className="size-9 min-w-9 rounded-full bg-success-50 p-[7px]">
            <Image
              src="/icons/dollar-return.png"
              alt="Dollar Return"
              width={22}
              height={22}
              className="size-[22px] min-w-[22px]"
            />
          </div>
          <div className="mt-2.5 text-[22px] font-bold leading-tight text-default-e">
            Upto 80% Financing
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <div className="size-9 min-w-9 rounded-full bg-[#2C1542]/10 p-[7px] dark:bg-[#2C1542]">
            <CiCalendar size={22} className="text-[#9C12F2]" strokeWidth={1} />
          </div>
          <div className="mt-2.5 text-[22px] font-bold leading-tight text-default-e">
            Upto 7-Year Terms
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <div className="size-9 min-w-9 rounded-full bg-secondary-50 p-[7px]">
            <LuShieldCheck size={22} className="text-secondary" />
          </div>
          <div className="mt-2.5 text-[22px] font-bold leading-tight text-default-e">
            No Liquidations
          </div>
        </div>
      </div>
    </section>
  )
}
