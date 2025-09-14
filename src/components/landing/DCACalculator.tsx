import {
  Chip,
  cn,
  NumberInput,
  Radio,
  RadioProps,
  Tab,
  Tabs,
} from '@heroui/react'
import numeral from 'numeral'
import { useMemo, useState } from 'react'
import SlotCounter from 'react-slot-counter'

const CONTRIBUTION_AMOUNT_OPTIONS = [
  { value: 1, label: '$1' },
  { value: 5, label: '$5' },
  { value: 10, label: '$10' },
  { value: 100, label: '$100' },
]

export const DCACalculator = ({ btcPrice }: { btcPrice: number }) => {
  const [btcAmount, setBtcAmount] = useState<number>()
  const [cadence, setCadence] = useState<'daily' | 'weekly'>('daily')
  const [contributionAmount, setContributionAmount] = useState<number>()

  const daysToReachGoal = useMemo(() => {
    if (!btcAmount || !contributionAmount || !btcPrice) return 0
    // Calculate the total USD value needed to reach the BTC goal
    const totalUSDNeeded = btcAmount * btcPrice
    // Calculate how many contributions are needed
    const numberOfContributions = Math.ceil(totalUSDNeeded / contributionAmount)
    // Calculate days based on cadence
    if (cadence === 'weekly') return numberOfContributions * 7
    if (cadence === 'daily') return numberOfContributions
    return 0
  }, [btcAmount, contributionAmount, cadence, btcPrice])

  return (
    <div className="my-4 flex w-full flex-col gap-4">
      <div className="border-default-100 flex flex-col gap-2.5 rounded-xl border bg-[linear-gradient(89.57deg,_rgba(247,_147,_26,_0.01)_17.87%,_rgba(255,_255,_255,_0.02)_52.56%,_rgba(255,_255,_255,_0.04)_77.29%)] p-3.5">
        <label htmlFor="btc" className="text-default-d text-sm font-medium">
          Choose Your BTC Target
        </label>
        <NumberInput
          hideStepper
          isWheelDisabled
          placeholder="BTC Target (in BTC)"
          name="btc"
          id="btc"
          endContent={<span className="text-foreground/50 text-xs">BTC</span>}
          fullWidth
          size="sm"
          minValue={0}
          value={btcAmount}
          formatOptions={{ maximumFractionDigits: 8 }}
          onChange={(value) => {
            if (typeof value === 'number') setBtcAmount(value)
            else if (value?.target)
              setBtcAmount(
                numeral(value?.target?.value || 0).value() || undefined
              )
          }}
          classNames={{
            inputWrapper: 'bg-background/70 border border-default-100',
          }}
        />
      </div>

      <div className="border-default-100 flex flex-col gap-2.5 rounded-xl border bg-[linear-gradient(89.57deg,_rgba(247,_147,_26,_0.01)_17.87%,_rgba(255,_255,_255,_0.02)_52.56%,_rgba(255,_255,_255,_0.04)_77.29%)] p-3.5">
        <label
          htmlFor="loan-duration"
          className="text-default-d text-sm font-medium"
        >
          How Often Do You Want to Invest?
        </label>
        <Tabs
          selectedKey={cadence}
          onSelectionChange={(key) => setCadence(key as 'daily' | 'weekly')}
          variant="solid"
          color="primary"
          classNames={{
            tabList: 'w-full bg-background/50',
            tabContent:
              'text-sm text-foreground group-data-[selected=true]:text-primary',
            cursor: 'bg-primary/20',
          }}
        >
          <Tab key="daily" title="Daily" />
          <Tab key="weekly" title="Weekly" />
        </Tabs>
      </div>

      <div className="border-default-100 flex flex-col gap-2.5 rounded-xl border bg-[linear-gradient(89.57deg,_rgba(247,_147,_26,_0.01)_17.87%,_rgba(255,_255,_255,_0.02)_52.56%,_rgba(255,_255,_255,_0.04)_77.29%)] p-3.5">
        <label
          htmlFor="contribution"
          className="text-default-d text-sm font-medium"
        >
          Set Your Contribution Amount
        </label>
        <NumberInput
          hideStepper
          isWheelDisabled
          placeholder="Contribution Amount (in USDC)"
          name="contribution"
          id="contribution"
          endContent={<span className="text-foreground/50 text-xs">$</span>}
          fullWidth
          size="sm"
          minValue={0}
          value={contributionAmount}
          formatOptions={{ maximumFractionDigits: 8 }}
          onChange={(value) => {
            if (typeof value === 'number') setContributionAmount(value)
            else if (value?.target)
              setContributionAmount(
                numeral(value?.target?.value || 0).value() || undefined
              )
          }}
          classNames={{
            inputWrapper: 'bg-background/70 border border-default-100',
          }}
        />

        <div className="flex flex-wrap gap-2">
          {CONTRIBUTION_AMOUNT_OPTIONS?.map((option) => (
            <Chip
              key={option.value}
              className={cn(
                'text-foreground cursor-pointer text-xs',
                contributionAmount === option.value && 'bg-primary/20'
              )}
              variant="bordered"
              color={
                contributionAmount === option.value ? 'primary' : 'default'
              }
              onClick={() => setContributionAmount(option.value)}
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-foreground/50 flex items-center justify-center gap-1 text-center text-sm">
          It will take{' '}
          <Counter value={numeral(daysToReachGoal).format('0,0') || '0'} />
          to reach your goal
        </div>
      </div>
    </div>
  )
}

const Counter = ({ value }: { value: string }) => {
  return (
    <div className="flex items-center gap-1">
      <SlotCounter
        useMonospaceWidth
        value={value}
        charClassName="text-sm text-primary"
        separatorClassName="text-sm text-primary"
      />
      <span className="text-primary text-sm">days</span>
    </div>
  )
}

export const CustomRadio = (
  props: RadioProps & { labelClassName?: string }
) => {
  const { children, className, labelClassName, ...otherProps } = props

  return (
    <Radio
      {...otherProps}
      className={cn('group', className)}
      classNames={{
        base: 'm-0 rounded-lg bg-[linear-gradient(86.84deg,_rgba(247,_147,_26,_0.01)_17.87%,_rgba(255,_255,_255,_0.02)_52.56%,_rgba(255,_255,_255,_0.04)_77.29%)] border border-default-100 transition-colors hover:bg-primary/10 data-[selected=true]:bg-primary/20  data-[selected=true]:border-primary',
        wrapper: 'hidden',
        labelWrapper: cn(
          'ml-0 ms-0 px-6 [&>span]:group-data-[selected=true]:text-primary [&>span]:text-default-a [&>span]:font-medium [&>span]:group-data-[selected=true]:font-semibold max-lg:px-5',
          labelClassName
        ),
      }}
    >
      {children}
    </Radio>
  )
}
