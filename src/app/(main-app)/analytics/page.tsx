'use client'
import { fullAnalysisBrowserEnhanced } from '@/scripts/typescript/btc_loan_vs_dca_browser'
import { Card, CardBody, Spinner, Tab, Tabs, Tooltip } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import { LoanVsDCAChart } from '@/components/analytics/LoanVsDCAChart'
import { LoanVsDCASidebar } from '@/components/analytics/LoanVsDCASidebar'
import { EMIStats, StrategyStats } from '@/components/analytics/LoanVsDCAStats'
import { FearGreedIndexChart } from '@/components/FearGreedIndexChart'
import { LuInfo } from 'react-icons/lu'
import { LoanAvailabilityType } from '@/types'
import axios from '@/utils/axios'

const DEFAULT_LOAN_AMOUNT = 100000

export default function AnalyticsPage() {
  const [mode, setMode] = useState<'btc' | 'usd'>('btc')
  const [loanAmount, setLoanAmount] = useState<number | undefined>(undefined)
  const [timePeriod, setTimePeriod] = useState<number>(60)
  const [downPayment, setDownPayment] = useState(0)
  const [loanAPR, setLoanAPR] = useState(10)
  const [startDate, setStartDate] = useState('2017-08-17')
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedPoint, setSelectedPoint] = useState<any>(null)
  const [liquidationInsuranceCost, setLiquidationInsuranceCost] = useState(0)
  const [dcaCadence, setDcaCadence] = useState<'daily' | 'weekly' | 'monthly'>(
    'daily'
  )
  const [btcYield, setBtcYield] = useState(1)
  const [dcaWithoutDownPayment, setDcaWithoutDownPayment] = useState(true)

  const { data: borrowStats } = useQuery({
    queryKey: ['/initialisation/loanavailability'],
    queryFn: () =>
      axios.get<LoanAvailabilityType>(`/initialisation/loanavailability`),
    staleTime: Infinity,
  })
  const fgi = borrowStats?.data?.data?.fgi

  const {
    data: analysisData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['btc-loan-vs-dca-enhanced', loanAmount, timePeriod, startDate],
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

      // Run enhanced analysis
      const result = await fullAnalysisBrowserEnhanced(csvContent, {
        start: startDate,
        loanAmount: loanAmount || DEFAULT_LOAN_AMOUNT,
        timePeriod,
      })

      // Store full results in window for debugging
      // ;(window as any).btcLoanVsDcaResults = result.results
      // ;(window as any).btcLoanVsDcaChartData = result.chartData

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
  const statsData = useMemo(() => {
    if (!analysisData) return null

    const point = selectedPoint || analysisData.chartData[0]
    if (!point) return null

    const finalLoanAmount = loanAmount || DEFAULT_LOAN_AMOUNT
    const loanReturns =
      point.loanReturns || point.profitLoan + point.btcLoan * point.price
    const dcaReturns =
      point.dcaReturns || point.profitDca + point.btcDca * point.price
    const loanCostPerBTC = finalLoanAmount / point.btcLoan
    const dcaCostPerBTC = point.dollarsIn / point.btcDca

    return {
      loanBTC: point.btcLoan,
      dcaBTC: point.btcDca,
      loanReturns,
      dcaReturns,
      loanCostPerBTC,
      dcaCostPerBTC,
    }
  }, [analysisData, selectedPoint, loanAmount])

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-background">
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
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
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
          <Card className="h-full border border-default-200 lg:max-h-[640px]">
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
                    <span className="absolute -right-8 top-1/2 -translate-y-1/2">
                      <LuInfo
                        size={20}
                        className="cursor-pointer text-default"
                      />
                    </span>
                  </Tooltip>
                </div>

                {/* Fear and Greed Index */}
                <div className="md:ml-auto">
                  <Tooltip
                    classNames={{
                      content: 'shadow-large border-default-200 border',
                    }}
                    content={
                      <div className="min-h-[164px] w-[280px] p-4">
                        <div className="mb-5 flex items-center justify-between border-b border-default-200 pb-3.5 pl-1 text-base font-medium text-default-d">
                          Fear and Greed Index
                        </div>

                        <div className="flex items-center justify-center gap-6">
                          <div className="flex flex-col items-center">
                            <span className="text-[32px] font-bold leading-tight text-default-d">
                              {fgi?.value || 50}
                            </span>
                            <span className="text-center text-sm font-medium leading-tight text-default-a">
                              {fgi?.valueText || 'Neutral'}
                            </span>
                          </div>

                          <div className="h-12 w-px bg-default-300" />

                          <div className="h-[62px] w-full max-w-[120px] [&>*]:pointer-events-none">
                            <FearGreedIndexChart
                              needleValue={fgi?.value || 50}
                            />
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <div className="relative flex cursor-pointer items-center gap-2 rounded-[10px] bg-default-50 px-4 py-2 text-base font-bold text-default-d">
                      <div className="absolute -left-9 top-1/2 h-[62px] w-full max-w-[120px] -translate-y-1/2 scale-[0.2] select-none [&>*]:pointer-events-none">
                        <FearGreedIndexChart needleValue={fgi?.value || 50} />
                      </div>
                      <span className="ml-7">
                        {fgi?.valueText || 'Neutral'} {fgi?.value || 50}
                      </span>
                    </div>
                  </Tooltip>
                </div>
              </div>

              {/* Chart */}
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Spinner size="lg" color="primary" />
                </div>
              ) : error ? (
                <div className="flex h-full items-center justify-center text-danger">
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
