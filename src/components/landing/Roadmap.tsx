export const Roadmap = () => {
  return (
    <section
      className="relative container mb-45 max-w-[1360px] max-lg:mb-30 min-[87.5rem]:px-0!"
      id="roadmap"
    >
      <div className="absolute top-32 right-0 left-0 h-2.5 w-full bg-[linear-gradient(90deg,_rgba(247,_147,_26,_0)_0%,_#F7931A_20%,_#F7931A_80%,_rgba(247,_147,_26,_0)_100%)] max-lg:hidden"></div>

      <div className="z-1 w-full gap-4 px-20 max-lg:px-4">
        <div className="grid grid-cols-1 gap-10 max-lg:place-items-center lg:grid-cols-3">
          {ROADMAP_ITEMS.map((item) => (
            <div key={item.title}>
              <div className="text-5xl font-medium">{item.title}</div>
              <div className="text-foreground/90 mt-3 text-xl font-medium">
                {item.subtitle}
              </div>

              <ul className="relative mt-14 ml-8.5 max-w-[310px] space-y-3 lg:mt-20">
                <div className="absolute -top-6.5 -left-10 z-0 h-2.5 w-[calc(100%+4rem)] bg-[linear-gradient(90deg,_rgba(247,_147,_26,_0)_0%,_#F7931A_20%,_#F7931A_80%,_rgba(247,_147,_26,_0)_100%)] lg:hidden"></div>

                <div>
                  <div className="bg-primary absolute -top-10 -left-3 z-1 grid size-10 -translate-x-1/2 place-items-center rounded-full lg:-top-14">
                    <div className="bg-primary border-default-200 size-7 rounded-full border-4"></div>
                  </div>

                  <div className="absolute -top-1 -left-3.25 z-0 h-[calc(100%+1.5rem)] w-0.5 bg-[linear-gradient(180deg,_#F7931A_0%,_rgba(247,_147,_26,_0)_100%)] lg:-top-4"></div>
                </div>

                {item.items.map((item) => (
                  <li
                    key={item}
                    className="text-foreground/70 flex items-start gap-3 text-sm"
                  >
                    <span className="bg-foreground/70 mt-2.5 h-px w-2 flex-shrink-0 leading-tight"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div></div>

          <div></div>
        </div>
        {/* <div className="flex items-center justify-between gap-30 max-lg:flex-col max-lg:gap-16">
          <div className="flex max-w-[456px] flex-1 flex-col gap-2">
            <h1 className="text-foreground text-5xl leading-[1.15] font-medium max-lg:text-center max-lg:text-[32px]">
              Start Your Bitcoin Journey Today
            </h1>
            <p className="text-foreground/70 text-base leading-tight font-normal max-lg:text-center">
              Own BTC without the big upfront buy.
            </p>
          </div>
        </div> */}
      </div>
    </section>
  )
}

const ROADMAP_ITEMS = [
  {
    title: 'Live',
    subtitle: 'Bitmor DCA',
    items: [
      'A simple app to let users dollar cost average into bitcoin on chain.',
      'Launch mini-app on Farcaster and Base App',
      'Convert wallet dust to Bitcoin',
      "Milestone - 1 BTC a month DCA'd through us.",
    ],
  },
  {
    title: 'Q4 25',
    subtitle: 'Bitmor Loan',
    items: [
      'Own upto 1 BTC with just 30% down payment and get a loan to fund the rest.',
      'No Liquidations. Built-in protections handle downside risk.',
      'Lenders receive a Stablecoin Yield better than AAVE.',
      'Milestone - 1 BTC a month loaned through us.',
    ],
  },
  {
    title: 'Q1 26',
    subtitle: 'Bitmor Auto',
    items: [
      'Automated strategies, including user-generated ones for BTC accumulation.',
      'DCA during bull markets & Loans during bear markets.',
      'BTC Holder Clubs - Satoshi Millionaire, Full Coiner',
    ],
  },
]
