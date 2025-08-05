import { LuShieldCheck } from 'react-icons/lu'
import Image from 'next/image'
import { CiCalendar } from 'react-icons/ci'
import { BsLightning } from 'react-icons/bs'

export const Stats = () => {
  return (
    <section className="container py-12 pb-14 max-lg:pb-12" id="stats">
      <div className="grid grid-cols-1 place-items-center gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-primary-50 size-9 min-w-9 rounded-full p-[7px]">
            <BsLightning size={22} className="text-primary" />
          </div>
          <div className="text-default-e mt-2.5 text-[22px] leading-tight font-bold">
            Instant Approval
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-success-50 size-9 min-w-9 rounded-full p-[7px]">
            <Image
              src="/icons/dollar-return.png"
              alt="Dollar Return"
              width={22}
              height={22}
              className="size-[22px] min-w-[22px]"
            />
          </div>
          <div className="text-default-e mt-2.5 text-[22px] leading-tight font-bold">
            Upto 80% Financing
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <div className="size-9 min-w-9 rounded-full bg-[#2C1542]/10 p-[7px] dark:bg-[#2C1542]">
            <CiCalendar size={22} className="text-[#9C12F2]" strokeWidth={1} />
          </div>
          <div className="text-default-e mt-2.5 text-[22px] leading-tight font-bold">
            Upto 7-Year Terms
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-secondary-50 size-9 min-w-9 rounded-full p-[7px]">
            <LuShieldCheck size={22} className="text-secondary" />
          </div>
          <div className="text-default-e mt-2.5 text-[22px] leading-tight font-bold">
            No Liquidations
          </div>
        </div>
      </div>
    </section>
  )
}
