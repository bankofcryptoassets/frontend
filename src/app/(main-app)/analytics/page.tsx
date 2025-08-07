'use client'
import { fullAnalysisBrowserEnhanced } from '@/scripts/LoanVsDCA'
import {
  Alert,
  Card,
  CardBody,
  Spinner,
  Tab,
  Tabs,
  Tooltip,
} from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import { LoanVsDCAChart } from '@/components/analytics/LoanVsDCAChart'
import { LoanVsDCASidebar } from '@/components/analytics/LoanVsDCASidebar'
import { EMIStats, StrategyStats } from '@/components/analytics/LoanVsDCAStats'
import { LuInfo } from 'react-icons/lu'
import { DEFAULT_LOAN_AMOUNT } from '@/utils/constants'

export default function AnalyticsPage() {
  const [mode, setMode] = useState<'btc' | 'usd'>('btc')
  const [loanAmount, setLoanAmount] = useState<number | undefined>(
    DEFAULT_LOAN_AMOUNT
  )
  const [timePeriod, setTimePeriod] = useState<number>(60)
  const [downPayment, setDownPayment] = useState(
    0.2 * (loanAmount || DEFAULT_LOAN_AMOUNT)
  )
  const [loanAPR, setLoanAPR] = useState(10)
  const [selectedPoint, setSelectedPoint] = useState<any>(null)
  const [liquidationInsuranceCost, setLiquidationInsuranceCost] = useState(0)
  const [dcaCadence, setDcaCadence] = useState<'daily' | 'weekly' | 'monthly'>(
    'monthly'
  )
  const [btcYield, setBtcYield] = useState(1)
  const [dcaWithoutDownPayment, setDcaWithoutDownPayment] = useState(false)

  // const { data: borrowStats } = useQuery({
  //   queryKey: ['/initialisation/loanavailability'],
  //   queryFn: () =>
  //     axios.get<LoanAvailabilityType>(`/initialisation/loanavailability`),
  //   staleTime: Infinity,
  // })
  // const fgi = borrowStats?.data?.data?.fgi

  const {
    data: analysisData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      'btc-loan-vs-dca-enhanced',
      loanAmount,
      timePeriod,
      downPayment,
      loanAPR,
      liquidationInsuranceCost,
      dcaWithoutDownPayment,
      btcYield,
      dcaCadence,
    ],
    queryFn: async () => {
      // Fetch the CSV data
      const response = await fetch('/data/BTCUSDT_1h.csv', {
        cache: 'force-cache',
        next: { revalidate: 0 },
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.statusText}`)
      }

      const csvContent = await response.text()

      // Calculate down payment percentage
      const finalLoanAmount = loanAmount || DEFAULT_LOAN_AMOUNT
      const downPaymentPercentage = downPayment / finalLoanAmount

      // Run enhanced analysis
      const result = await fullAnalysisBrowserEnhanced(csvContent, {
        loanAmount: finalLoanAmount,
        timePeriod,
        downPayment: downPaymentPercentage,
        loanAPR,
        liquidationInsuranceCost,
        dcaWithoutDownPayment,
        btcYield,
        dcaCadence,
      })

      return result
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })

  // Calculate summary stats
  const summary = useMemo(() => {
    if (!analysisData) return null

    const loanWins = analysisData.results.filter((r) =>
      mode === 'btc' ? r.btcWin === 'loan' : r.win === 'loan'
    ).length
    const totalDays = analysisData.results.length
    const winPercentage = ((loanWins / totalDays) * 100).toFixed(1)

    return { totalDays, loanWins, dcaWins: totalDays - loanWins, winPercentage }
  }, [analysisData, mode])

  // Calculate stats for selected point or average
  const point = useMemo(
    () => selectedPoint || analysisData?.chartData?.[0],
    [selectedPoint, analysisData]
  )
  const statsData = useMemo(() => {
    if (!analysisData || !point) return null

    const finalLoanAmount = loanAmount || DEFAULT_LOAN_AMOUNT
    const totalLoanCost = finalLoanAmount + liquidationInsuranceCost
    const loanReturns =
      point.loanReturns || point.profitLoan + point.btcLoan * point.price
    const dcaReturns =
      point.dcaReturns || point.profitDca + point.btcDca * point.price
    const loanCostPerBTC = totalLoanCost / point.btcLoan
    const dcaCostPerBTC = point.dollarsIn / point.btcDca

    return {
      loanBTC: point.btcLoan,
      dcaBTC: point.btcDca,
      loanReturns,
      dcaReturns,
      loanCostPerBTC,
      dcaCostPerBTC,
    }
  }, [analysisData, point, loanAmount, liquidationInsuranceCost])

  const handleStartDateChange = (date: string) => {
    setSelectedPoint(analysisData?.chartData.find((p) => p.date === date))
  }

  return (
    <div className="bg-background min-h-[calc(100vh-4.5rem)]">
      <div className="container mx-auto flex h-full flex-col gap-5 px-4 py-6 lg:flex-row">
        {/* Sidebar */}
        <div className="flex h-full w-full flex-col gap-3 lg:w-[360px]">
          <LoanVsDCASidebar
            loanAmount={loanAmount}
            onLoanAmountChange={setLoanAmount}
            timePeriod={timePeriod}
            onTimePeriodChange={setTimePeriod}
            downPayment={downPayment}
            onDownPaymentChange={setDownPayment}
            loanAPR={loanAPR}
            onLoanAPRChange={setLoanAPR}
            startDate={point?.date}
            onStartDateChange={handleStartDateChange}
            endDate={point?.valDate}
            // onEndDateChange={setEndDate}
            liquidationInsuranceCost={liquidationInsuranceCost}
            onLiquidationInsuranceCostChange={setLiquidationInsuranceCost}
            dcaCadence={dcaCadence}
            onDcaCadenceChange={setDcaCadence}
            btcYield={btcYield}
            onBtcYieldChange={setBtcYield}
            dcaWithoutDownPayment={dcaWithoutDownPayment}
            onDcaWithoutDownPaymentChange={setDcaWithoutDownPayment}
          />

          {/* EMI Stats */}
          <EMIStats
            emiAmount={analysisData?.averageMetrics.avgMonthlyPaymentLoan || 0}
            dcaAmount={analysisData?.averageMetrics.avgMonthlyPaymentDCA || 0}
          />
        </div>

        {/* Chart and Stats */}
        <div className="flex h-full flex-1 flex-col gap-3">
          {/* Chart Card */}
          <Card className="border-default-200 h-full border lg:max-h-[640px]">
            <CardBody className="h-full p-6">
              {/* Mode Toggle */}
              <div className="mb-8 grid grid-cols-1 place-items-center justify-center gap-3 md:grid-cols-3">
                <div className="max-md:hidden"></div>

                <div className="relative flex items-center gap-3">
                  <Tabs
                    variant="bordered"
                    color="primary"
                    selectedKey={mode}
                    onSelectionChange={(key) => setMode(key as 'btc' | 'usd')}
                    classNames={{
                      tabList: 'border-default-300',
                      tab: 'font-bold px-7',
                    }}
                  >
                    <Tab key="btc" title="BTC" />
                    <Tab key="usd" title="USD" />
                  </Tabs>

                  <Tooltip content="lorem ipsum dolor sit amet">
                    <span className="absolute top-1/2 -right-8 -translate-y-1/2">
                      <LuInfo
                        size={20}
                        className="text-default cursor-pointer"
                      />
                    </span>
                  </Tooltip>
                </div>

                {/* Fear and Greed Index */}
                {/* <div className="md:ml-auto">
                  <Tooltip
                    classNames={{
                      content: 'shadow-large border-default-200 border',
                    }}
                    content={
                      <div className="min-h-[164px] w-[280px] p-4">
                        <div className="border-default-200 text-default-d mb-5 flex items-center justify-between border-b pb-3.5 pl-1 text-base font-medium">
                          Fear and Greed Index
                        </div>

                        <div className="flex items-center justify-center gap-6">
                          <div className="flex flex-col items-center">
                            <span className="text-default-d text-[32px] leading-tight font-bold">
                              {fgi?.value || 50}
                            </span>
                            <span className="text-default-a text-center text-sm leading-tight font-medium">
                              {fgi?.valueText || 'Neutral'}
                            </span>
                          </div>

                          <div className="bg-default-300 h-12 w-px" />

                          <div className="h-[62px] w-full max-w-[120px] *:pointer-events-none">
                            <FearGreedIndexChart
                              needleValue={fgi?.value || 50}
                            />
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <div className="bg-default-50 text-default-d relative flex cursor-pointer items-center gap-2 rounded-[10px] px-4 py-2 text-base font-bold">
                      <div className="absolute top-1/2 -left-9 h-[62px] w-full max-w-[120px] -translate-y-1/2 scale-[0.2] select-none *:pointer-events-none">
                        <FearGreedIndexChart needleValue={fgi?.value || 50} />
                      </div>
                      <span className="ml-7">
                        {fgi?.valueText || 'Neutral'} {fgi?.value || 50}
                      </span>
                    </div>
                  </Tooltip>
                </div> */}

                <div className="md:ml-auto">
                  <Alert
                    className="max-w-[214px] gap-0 px-3 py-1"
                    classNames={{
                      title: 'text-xs text-default-d',
                      alertIcon: 'h-4 w-4 text-default-d',
                      iconWrapper: 'h-4 w-4',
                    }}
                    title="Click anywhere on the graph to choose a starting date."
                  />
                </div>
              </div>

              {/* Chart */}
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Spinner size="lg" color="primary" />
                </div>
              ) : error ? (
                <div className="text-danger flex h-full items-center justify-center">
                  Error:{' '}
                  {error instanceof Error ? error.message : String(error)}
                </div>
              ) : analysisData ? (
                <LoanVsDCAChart
                  data={analysisData.chartData}
                  mode={mode}
                  selectedPoint={selectedPoint}
                  onPointClick={setSelectedPoint}
                  winPercentage={summary?.winPercentage}
                />
              ) : null}
            </CardBody>
          </Card>

          {/* Strategy Stats */}
          {statsData && (
            <StrategyStats
              loanBTC={statsData.loanBTC}
              dcaBTC={statsData.dcaBTC}
              loanReturns={statsData.loanReturns}
              dcaReturns={statsData.dcaReturns}
              loanCostPerBTC={statsData.loanCostPerBTC}
              dcaCostPerBTC={statsData.dcaCostPerBTC}
            />
          )}
        </div>
      </div>
    </div>
  )
}
