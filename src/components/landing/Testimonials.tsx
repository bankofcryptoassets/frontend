import { Glow } from './Glow'
import Image from 'next/image'

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
              className="border-default-100 flex max-w-96 flex-col items-start gap-10 rounded-lg border bg-[linear-gradient(86.84deg,_rgba(247,_147,_26,_0.01)_17.87%,_rgba(255,_255,_255,_0.02)_52.56%,_rgba(255,_255,_255,_0.04)_77.29%)] p-7 max-lg:max-w-full"
            >
              <div className="leading-tight">
                &quot;{item.testimonial}&quot;
              </div>

              <div className="mt-auto flex items-center gap-4">
                <div className="bg-content1 grid size-12 flex-shrink-0 place-items-center rounded-full">
                  <Image
                    src={`/testimonials/${item.id}.jpeg`}
                    alt="user"
                    width={48}
                    height={48}
                    className="size-12 rounded-full select-none"
                  />
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
    name: 'Saumya Saxena',
    handle: 'Lead @Base India',
    testimonial:
      "I'm excited by the team that's building Bitmor. Base Batches winners and a goated team. They're going to make owning Bitcoin feel achievable. LFG.",
  },
  {
    id: 2,
    name: 'Akshat',
    handle: 'CTO @QuillAI Network',
    testimonial:
      'The DCA vs Loan Calculator is an absolute eye opener. Mind blown by what the data has to say. Here I was thinking the best way to accumulate BTC is only DCA.',
  },
  {
    id: 3,
    name: 'Sreeraj S',
    handle: 'Sr. Engineering Manager @BitGo',
    testimonial:
      "Can't wait for these guys to launch to finally stack seriously into BTC. A structured plan helps me to plan my finances around it.",
  },
]
