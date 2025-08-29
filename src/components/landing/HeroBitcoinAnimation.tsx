import InlineSVG from 'react-inlinesvg'
import Wave from 'react-wavify'
import { useMediaQuery } from 'usehooks-ts'

export const HeroBitcoinAnimation = () => {
  const isMobile = useMediaQuery('(max-width: 1024px)')
  return (
    <div className="relative">
      <>
        <div className="bg-secondary/20 text-foreground/80 absolute top-0 -left-16 z-2 inline-flex items-center gap-2 rounded-[10px] p-2.5 text-base leading-tight font-medium whitespace-nowrap backdrop-blur-sm max-lg:py-2 max-lg:text-sm sm:-left-24">
          <span className="size-5 max-lg:size-4">
            <InlineSVG src="/icons/hand-dollar.svg" className="size-full" />
          </span>
          Onchain BTC Loans
        </div>
        <div className="bg-success/20 text-foreground/80 absolute top-12 -right-20 z-2 inline-flex items-center gap-2 rounded-[10px] p-2.5 text-base leading-tight font-medium whitespace-nowrap backdrop-blur-sm max-lg:py-2 max-lg:text-sm max-sm:-right-16">
          <span className="size-5 max-lg:size-4">
            <InlineSVG src="/icons/dollar-return.svg" className="size-full" />
          </span>{' '}
          DCA Into BTC
        </div>
        <div className="bg-primary/20 text-foreground/80 absolute -bottom-12.5 left-1/2 z-2 inline-flex -translate-x-1/2 items-center gap-2 rounded-[10px] p-2.5 text-base leading-tight font-medium whitespace-nowrap backdrop-blur-sm max-lg:py-2 max-lg:text-sm">
          <span className="size-5 max-lg:size-4">
            <InlineSVG src="/icons/coin-stacks.svg" className="size-full" />
          </span>{' '}
          Stack Sats Everyday
        </div>
      </>

      <>
        <InlineSVG
          src="/icons/btc.svg"
          className="bitcoin-falling one absolute top-0 left-1/2 z-0 size-5 opacity-0"
        />
        <InlineSVG
          src="/icons/btc.svg"
          className="bitcoin-falling two absolute top-0 left-1/2 z-0 size-5 opacity-0"
        />
        <InlineSVG
          src="/icons/btc.svg"
          className="bitcoin-falling three absolute top-0 left-1/2 z-0 size-5 opacity-0"
        />
        <InlineSVG
          src="/icons/btc.svg"
          className="bitcoin-falling four absolute top-0 left-1/2 z-0 size-5 opacity-0"
        />
      </>

      <div className="border-primary relative size-[270px] overflow-hidden rounded-full border-2 max-lg:size-[200px]">
        {/* Background layer - Bitcoin outline */}
        <InlineSVG
          src="/extras/bitcoin-outline.svg"
          className="absolute top-1/2 left-1/2 z-1 size-[170px] -translate-x-1/2 -translate-y-1/2 max-lg:size-[126px]"
        />

        {/* Middle layer - Wave fills the bottom half */}
        <Wave
          fill="hsl(var(--heroui-primary))"
          paused={false}
          style={{ display: 'flex', width: '100%', height: '100%' }}
          options={{
            height: isMobile ? 81 : 110,
            amplitude: 20,
            speed: 0.2,
            points: 2,
          }}
        />

        {/* Top layer - White bitcoin, but clipped to only show below the wave */}
        <InlineSVG
          src="/extras/bitcoin-white.svg"
          className="stroke-primary absolute top-1/2 left-1/2 z-0 size-[170px] -translate-x-1/2 -translate-y-1/2 stroke-1 max-lg:size-[126px]"
          id="bitcoin-white"
        />
      </div>
    </div>
  )
}
