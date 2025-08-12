import { UserIcon } from 'lucide-react'
import { Glow } from './Glow'

export const Testimonials = () => {
  return (
    <section
      className="relative container mb-50 max-lg:mb-30"
      id="borrower-lender"
    >
      <>
        <Glow className="absolute top-0 right-1/2 h-[158px] w-[72px] -translate-x-full -rotate-37 blur-[120px]" />
        <Glow className="absolute bottom-0 left-1/2 h-[158px] w-[72px] translate-x-[200%] rotate-24 blur-[140px]" />
      </>

      <div className="flex flex-col items-center justify-center gap-20 max-lg:gap-10">
        <h1 className="text-foreground text-center text-5xl leading-[1.15] font-medium max-lg:text-[32px]">
          Testimonials
        </h1>

        <div className="grid grid-cols-3 gap-10 max-lg:grid-cols-1">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="border-default-100 flex max-w-80 flex-col items-start gap-10 rounded-lg border bg-[linear-gradient(86.84deg,_rgba(247,_147,_26,_0.01)_17.87%,_rgba(255,_255,_255,_0.02)_52.56%,_rgba(255,_255,_255,_0.04)_77.29%)] p-8 max-lg:max-w-full"
            >
              <div className="leading-tight">
                &quot;{item.testimonial}&quot;
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-content1 grid size-12 place-items-center rounded-full">
                  <UserIcon className="text-primary size-7" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-foreground/90 text-xl leading-[1] font-medium">
                    {item.name}
                  </div>
                  <div className="text-foreground/70 text-base leading-tight font-normal">
                    {item.handle}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Dareon',
    handle: '@crypto_gee',
    testimonial:
      "Since using Bitmor, I started building my Bitcoin portfolio. With the monthly ownership tracker, I knew exactly how much I was unlocking. It's simple, transparent, and it finally made owning BTC feel realistic.",
  },
  {
    id: 2,
    name: 'Judith',
    handle: '@btcqueen',
    testimonial:
      "Paying monthly towards my BTC goal became rewarding, especially with the visual progress bar. I started looking forward to paying each month. It's more than an app — it's a journey toward ownership.",
  },
  {
    id: 3,
    name: 'Marcus',
    handle: '@btc_enthusiates',
    testimonial:
      "I've been DCA'ing into BTC for years, but Bitmor gave me a smarter option — owning more, faster, without risking it all upfront. It's like combining strategy with stability. It feels like leveling up.",
  },
]
