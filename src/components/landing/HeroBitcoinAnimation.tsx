import InlineSVG from 'react-inlinesvg'
import Wave from 'react-wavify'

export const HeroBitcoinAnimation = () => {
  return (
    <div>
      <div className="border-primary relative size-[270px] overflow-hidden rounded-full border-2">
        {/* Background layer - Bitcoin outline */}
        <InlineSVG
          src="/extras/bitcoin-outline.svg"
          className="absolute top-1/2 left-1/2 z-0 size-[170px] -translate-x-1/2 -translate-y-1/2"
        />

        {/* Middle layer - Wave fills the bottom half */}
        <Wave
          fill="hsl(var(--heroui-primary))"
          paused={false}
          style={{ display: 'flex', width: '100%', height: '100%' }}
          options={{ height: 110, amplitude: 20, speed: 0.25, points: 2 }}
        />

        {/* Top layer - White bitcoin, but clipped to only show below the wave */}
        <InlineSVG
          src="/extras/bitcoin-white.svg"
          className="absolute top-1/2 left-1/2 size-[170px] -translate-x-1/2 -translate-y-1/2"
          id="bitcoin-white"
        />
      </div>
    </div>
  )
}
