import { useTheme } from 'next-themes'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const RADIAN = Math.PI / 180
const data = [
  { name: 'A', value: 25, color: '#ff4d18' },
  { name: 'B', value: 20, color: '#fd8a17' },
  { name: 'C', value: 10, color: '#fdb639' },
  { name: 'C', value: 20, color: '#b0b32f' },
  { name: 'C', value: 25, color: '#54b138' },
]
const cx = 56
const cy = 50
const iR = 42
const oR = 55

export const FearGreedIndexChart = ({
  needleValue = 50,
}: {
  needleValue?: number
}) => {
  const { resolvedTheme } = useTheme()
  const needleColor = resolvedTheme === 'dark' ? '#FFFFFF' : '#000000'

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={120} height={62}>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={data}
          cx="50%"
          cy="100%"
          innerRadius={iR}
          outerRadius={oR}
          fill="#8884d8"
          stroke="none"
          paddingAngle={5}
          cornerRadius={3}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        {needle(needleValue, data, cx, cy, iR / 2, oR / 2, needleColor)}
      </PieChart>
    </ResponsiveContainer>
  )
}

const needle = (
  value: number,
  data: any,
  cx: number,
  cy: number,
  iR: number,
  oR: number,
  color: string
) => {
  let total = 0
  data.forEach((v: any) => {
    total += v.value
  })
  const ang = 180.0 * (1 - value / total)
  const length = (iR + 2 * oR) / 3
  const sin = Math.sin(-RADIAN * ang)
  const cos = Math.cos(-RADIAN * ang)
  const r = 4
  const x0 = cx + 4
  const y0 = cy + 4
  const xba = x0 + r * sin
  const yba = y0 - r * cos
  const xbb = x0 - r * sin
  const ybb = y0 + r * cos
  const xp = x0 + length * cos
  const yp = y0 + length * sin

  return [
    <path
      d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
      stroke="#none"
      fill={color}
      key={`path-${color}`}
    />,
    <circle
      cx={x0}
      cy={y0}
      r={r}
      fill="#e74f30"
      stroke="none"
      key={`circle-${color}`}
    />,
  ]
}
