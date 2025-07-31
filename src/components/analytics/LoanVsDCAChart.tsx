'use client'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/Chart'
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Scatter,
  XAxis,
  YAxis,
} from 'recharts'
import { Checkbox } from '@heroui/react'
import { useState } from 'react'

interface ChartDataPoint {
  date: string
  price: number
  win: 'loan' | 'dca'
  ma200?: number | null
  ma500?: number | null
  profitLoan: number
  profitDca: number
  btcLoan: number
  btcDca: number
}

interface Props {
  data: ChartDataPoint[]
  mode: 'btc' | 'usd'
  selectedPoint?: ChartDataPoint
  onPointClick?: (point: ChartDataPoint) => void
  winPercentage?: string
}

const CustomDot = (props: any) => {
  const { cx, cy, payload, mode } = props
  const fillColor =
    mode === 'btc'
      ? payload.btcWin === 'loan'
        ? 'hsl(var(--heroui-success))'
        : 'hsl(var(--heroui-danger))'
      : payload.win === 'loan'
        ? 'hsl(var(--heroui-success))'
        : 'hsl(var(--heroui-danger))' // green for loan, red for dca

  return (
    <circle
      cx={cx}
      cy={cy}
      r={1}
      fill={fillColor}
      style={{ cursor: 'pointer' }}
    />
  )
}

export function LoanVsDCAChart({
  data,
  mode,
  onPointClick,
  winPercentage,
}: Props) {
  const [showMA, setShowMA] = useState(false)

  const chartConfig = {
    price: { label: 'BTC Price', color: 'hsl(var(--heroui-default-500))' },
    ma200: { label: '200-day MA', color: 'hsl(var(--heroui-secondary))' },
    ma500: { label: '500-day MA', color: 'hsl(var(--heroui-primary))' },
  }

  const uniqueYears = [
    ...new Set(
      data.map(
        (point) => `${new Date(point.date).getFullYear()?.toString()}-01-01`
      )
    ),
  ]

  return (
    <div className="h-full w-full">
      {/* Chart Controls */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
        {!!winPercentage && (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center rounded-lg border border-success/20 bg-success/5 px-4 py-2 text-xs font-bold text-success">
              Loan Strategy Win% = {winPercentage}%
            </div>

            <div className="flex items-center rounded-lg border border-danger/20 bg-danger/5 px-4 py-2 text-xs font-bold text-danger">
              DCA Strategy Win% = {(100 - parseFloat(winPercentage)).toFixed(1)}
              %
            </div>
          </div>
        )}

        <Checkbox
          isSelected={showMA}
          onValueChange={setShowMA}
          size="sm"
          classNames={{ label: 'text-xs text-default-a' }}
        >
          Show MA Average
        </Checkbox>
      </div>

      <ChartContainer
        config={chartConfig}
        className="relative h-full min-h-[400px] w-full min-w-[540px] overflow-hidden lg:max-h-[460px]"
      >
        <ComposedChart
          data={data}
          margin={{ left: 34, right: 12, top: 24, bottom: 22 }}
          onClick={(e) => {
            if (e && e.activePayload && e.activePayload[0]) {
              onPointClick?.(e.activePayload[0].payload)
            }
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--heroui-default-200))"
          />

          <XAxis
            dataKey="date"
            tickLine={{ stroke: 'hsl(var(--heroui-default-400))' }}
            axisLine={{ stroke: 'hsl(var(--heroui-default-400))' }}
            tickMargin={8}
            ticks={uniqueYears}
            tickFormatter={(value) => new Date(value).getFullYear().toString()}
            interval="preserveStart"
            minTickGap={50}
            style={{ fontSize: 12, fill: 'hsl(var(--heroui-default-a))' }}
            label={{
              value: 'Start date (UTC)',
              position: 'bottom',
              style: { fontSize: 12, fill: 'hsl(var(--heroui-default-a))' },
            }}
          />

          <YAxis
            tickLine={{ stroke: 'hsl(var(--heroui-default-400))' }}
            axisLine={{ stroke: 'hsl(var(--heroui-default-400))' }}
            tickMargin={8}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            ticks={[0, 20000, 40000, 60000, 80000, 100000, 120000]}
            style={{ fontSize: 12, fill: 'hsl(var(--heroui-default-a))' }}
            label={{
              value: 'BTC price on start-day (USDC)',
              position: 'center',
              angle: -90,
              dx: -56,
              style: { fontSize: 12, fill: 'hsl(var(--heroui-default-a))' },
            }}
          />

          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => {
                  if (name === 'price')
                    return `BTC Price: $${value.toLocaleString()}`
                  if (name === 'ma200')
                    return `200 days MA: $${value.toLocaleString()}`
                  if (name === 'ma500')
                    return `500 days MA: $${value.toLocaleString()}`
                  return
                }}
              />
            }
          />

          {/* Scatter plot for wins */}
          <Scatter
            dataKey="price"
            shape={<CustomDot mode={mode} />}
            isAnimationActive={false}
          />

          {/* Moving averages */}
          {showMA && (
            <>
              <Line
                type="basis"
                dataKey="ma200"
                stroke="var(--color-ma200)"
                strokeWidth={1}
                dot={false}
                activeDot={false}
              />
              <Line
                type="monotone"
                dataKey="ma500"
                stroke="var(--color-ma500)"
                strokeWidth={1}
                dot={false}
                activeDot={false}
              />
            </>
          )}

          {/* Legend for dots */}
          <Legend
            wrapperStyle={{
              position: 'unset',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            content={
              <div className="absolute left-32 top-6 flex flex-col gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="size-2 rounded-full bg-success" />
                  <span className="text-default-a">Loan Strategy Wins</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="size-2 rounded-full bg-danger" />
                  <span className="text-default-a">DCA Strategy Wins</span>
                </div>
                {showMA && (
                  <>
                    <div className="flex items-center gap-2.5">
                      <div className="h-0.5 w-2.5 rounded-full bg-secondary" />
                      <span className="text-default-a">200-day MA</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="h-0.5 w-2.5 rounded-full bg-primary" />
                      <span className="text-default-a">500-day MA</span>
                    </div>
                  </>
                )}
              </div>
            }
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  )
}
