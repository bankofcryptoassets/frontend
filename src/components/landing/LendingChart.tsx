import { Card } from '@heroui/react'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../Chart'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

const chartData = [
  { month: 'January', bitmor: 4.3, aave: 2.5 },
  { month: 'February', bitmor: 7, aave: 5 },
  { month: 'March', bitmor: 6.5, aave: 3 },
  { month: 'April', bitmor: 6.2, aave: 4.1 },
  { month: 'May', bitmor: 6.5, aave: 3 },
  { month: 'June', bitmor: 7.5, aave: 4.5 },
]

const chartConfig = {
  bitmor: { label: 'Bitmor', color: 'hsl(var(--heroui-primary))' },
  aave: { label: 'Aave', color: 'hsl(var(--heroui-secondary))' },
} satisfies ChartConfig

export const LendingChart = () => {
  return (
    <Card className="bg-default-50/90 border-default-100 w-full max-w-md rounded-2xl border shadow-[0px_1px_0px_0px_#FEFEFE1A,0px_0px_4px_0px_#FFFFFF1F]">
      <div className="p-3">
        <div className="border-default-100 rounded-xl border bg-[linear-gradient(86.84deg,_rgba(247,_147,_26,_0.01)_17.87%,_rgba(255,_255,_255,_0.02)_52.56%,_rgba(255,_255,_255,_0.04)_77.29%)] px-5 py-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="text-default-d text-base font-semibold">
              USDC Yield
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="bg-primary size-2 rounded-full"></span>
                <span className="text-xs font-medium">Bitmor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-secondary size-2 rounded-full"></span>
                <span className="text-xs font-medium">Aave</span>
              </div>
            </div>
          </div>

          <ChartContainer config={chartConfig} className="max-h-48 w-full">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ left: -24 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#979797"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
                tick={{ fill: '#979797' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}%`}
                ticks={[0, 2, 4, 6, 8]}
                tickCount={5}
                tick={{ fill: '#979797' }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillBitmor" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-bitmor)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-bitmor)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillAave" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-aave)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-aave)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="bitmor"
                type="bump"
                fill="url(#fillBitmor)"
                fillOpacity={0.4}
                stroke="var(--color-bitmor)"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="aave"
                type="bump"
                fill="url(#fillAave)"
                fillOpacity={0.4}
                stroke="var(--color-aave)"
                strokeWidth={2}
                stackId="b"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>
    </Card>
  )
}
