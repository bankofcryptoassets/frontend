'use client'
import { FaSeedling } from 'react-icons/fa6'
import { BitcoinHouse } from './BitcoinHouse'
import InlineSVG from 'react-inlinesvg'
import { FaGem } from 'react-icons/fa'
import { Glow } from './Glow'

export const JustLikeMortgage = () => {
  return (
    <section className="container my-50" id="just-like-mortgage">
      <div className="flex flex-col items-center justify-center gap-20">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-foreground text-center text-5xl leading-[1.15] font-medium">
            Just Like Owning a Mortgage
          </h1>
          <p className="text-foreground/70 max-w-[606px] text-center text-base leading-tight font-normal">
            Let your sats work for you just like owning property. You build up
            ownership over time, protect your downside, and grow your wealth.
          </p>
        </div>

        <div className="relative z-1">
          <Glow className="absolute top-1/2 left-1/2 z-0 h-[369px] w-[168px] -translate-x-1/2 -translate-y-1/2 rotate-22 blur-[230px]" />

          <BitcoinHouse />
        </div>

        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
          {JUST_LIKE_MORTGAGE.map((item) => (
            <div
              key={item.title}
              className="border-default-100 flex max-w-80 items-start gap-4 rounded-lg border bg-[linear-gradient(86.84deg,_rgba(247,_147,_26,_0.01)_17.87%,_rgba(255,_255,_255,_0.02)_52.56%,_rgba(255,_255,_255,_0.04)_77.29%)] p-4 shadow-[0px_0px_4px_0px_#FFFFFF1F,0px_1px_0px_0px_#FFFFFF1F]"
            >
              <div className="size-8 flex-shrink-0">{item.icon}</div>
              <div className="flex flex-col gap-4">
                <div className="text-foreground/90 text-xl leading-[1] font-medium">
                  {item.title}
                </div>
                <div className="text-foreground/70 text-sm leading-[1.15] font-normal">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const JUST_LIKE_MORTGAGE = [
  {
    icon: <FaSeedling size={32} className="text-success" />,
    title: 'Start Small, Grow Big',
    description:
      'Just like a mortgage, your investment compounds as you make monthly payments.',
  },
  {
    icon: <FaGem size={32} className="text-primary" />,
    title: 'Increase in Value',
    description:
      'BTC historically gains value, just like a home. You get the benefits as you own more.',
  },
  {
    icon: (
      <InlineSVG src="/icons/compass.svg" className="text-secondary size-8" />
    ),
    title: 'Stay on the Smart Path',
    description:
      'Each payment gets you closer to being a full‑coin holder — with proof on‑chain.',
  },
]
