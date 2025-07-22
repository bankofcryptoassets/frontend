/**
 * Browser-compatible version of BTC loan vs DCA analysis
 */

import { parse } from 'csv-parse/browser/esm/sync'
import {
  parseISO,
  addMonths,
  addDays,
  format,
  isAfter,
  differenceInDays,
  startOfDay,
} from 'date-fns'

// ────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────
interface CsvRecord {
  openTime: string
  close: string
}

interface LedgerRow {
  Date: string
  Payment_USD: number
  BTC_Price: number
  BTC_Added_DCA: number
  Cum_BTC_DCA: number
}

interface SimulationResult {
  profitLoan: number
  profitDca: number
  ledger: LedgerRow[]
  evalDate: Date
  valDate: Date
  btcLoan: number
  btcDca: number
  dollarsIn: number
  valPx: number
}

interface AnalysisResult {
  date: string
  win: 'loan' | 'dca'
  btcPrice: number
  profitLoan: number
  profitDca: number
  profitDifference: number
  btcLoan: number
  btcDca: number
  evalDate: string
  valDate: string
}

interface CommandOptions {
  start?: string
  debug?: string
  flashCrash?: number
  futureScenario?: boolean
}

// ────────────────────────────────────────────────────────────────
// Parameters – adjust at will
// ────────────────────────────────────────────────────────────────
const CASH_UPFRONT = 20_000 // USD paid immediately
const LOAN_PRINCIPAL = 80_000 // USD financed
const TERM_MONTHS = 60 // five years
const ANNUAL_RATE = 0.1
const MONTHLY_RATE = ANNUAL_RATE / 12

const MONTHLY_PAYMENT =
  (LOAN_PRINCIPAL * MONTHLY_RATE * Math.pow(1 + MONTHLY_RATE, TERM_MONTHS)) /
  (Math.pow(1 + MONTHLY_RATE, TERM_MONTHS) - 1)

// ────────────────────────────────────────────────────────────────
// Load price data from CSV string
// ────────────────────────────────────────────────────────────────
function loadPriceDataFromCsv(csvContent: string): Map<string, number> {
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as CsvRecord[]

  // Group by date and get the last price of each day
  const dailyPrices = new Map<string, number>()

  for (const record of records) {
    const timestamp = parseISO(record.openTime)
    const dateKey = format(startOfDay(timestamp), 'yyyy-MM-dd')
    const price = parseFloat(record.close)

    // This will naturally keep the last price of each day as we iterate
    dailyPrices.set(dateKey, price)
  }

  return dailyPrices
}

// ────────────────────────────────────────────────────────────────
// Price lookup with fallback to most recent prior day
// ────────────────────────────────────────────────────────────────
function priceOn(date: Date, priceSeries: Map<string, number>): number {
  let currentDate = new Date(date)

  while (true) {
    const dateKey = format(currentDate, 'yyyy-MM-dd')
    if (priceSeries.has(dateKey)) {
      return priceSeries.get(dateKey)!
    }

    // Go back one day
    currentDate = addDays(currentDate, -1)

    // Safety check to avoid infinite loop
    if (differenceInDays(date, currentDate) > 365) {
      throw new Error(
        `No price data found within 365 days of ${format(date, 'yyyy-MM-dd')}`
      )
    }
  }
}

// ────────────────────────────────────────────────────────────────
// Optional synthetic future path
// ────────────────────────────────────────────────────────────────
function appendFutureScenario(
  priceSeries: Map<string, number>
): Map<string, number> {
  const newSeries = new Map(priceSeries)

  // Get the last date and price
  const sortedDates = Array.from(priceSeries.keys()).sort()
  const lastDateStr = sortedDates[sortedDates.length - 1]
  const lastDate = parseISO(lastDateStr)
  const lastPrice = priceSeries.get(lastDateStr)!

  // Helper to build one leg of the path
  function buildLeg(
    startDate: Date,
    endDate: Date,
    p0: number,
    p1: number
  ): void {
    const days = differenceInDays(endDate, startDate) + 1
    for (let i = 1; i < days; i++) {
      const currentDate = addDays(startDate, i)
      const progress = i / (days - 1)
      const price = p0 + (p1 - p0) * progress
      newSeries.set(format(currentDate, 'yyyy-MM-dd'), price)
    }
  }

  // Bull run: +6 months to 170k
  const endBull = addMonths(lastDate, 6)
  buildLeg(lastDate, endBull, lastPrice, 170_000)

  // Crash: +4 months down to 65k
  const endCrash = addMonths(endBull, 4)
  buildLeg(endBull, endCrash, 170_000, 65_000)

  // Flat: +8 months at 65k
  const endFlat = addMonths(endCrash, 8)
  let currentDate = addDays(endCrash, 1)
  while (!isAfter(currentDate, endFlat)) {
    newSeries.set(format(currentDate, 'yyyy-MM-dd'), 65_000)
    currentDate = addDays(currentDate, 1)
  }

  return newSeries
}

// ────────────────────────────────────────────────────────────────
// Simulator for a single start-day
// ────────────────────────────────────────────────────────────────
function simulateStart(
  startDate: Date,
  priceSeries: Map<string, number>,
  crashPx?: number
): SimulationResult {
  const px0 = priceOn(startDate, priceSeries)
  const fullBtc = (CASH_UPFRONT + LOAN_PRINCIPAL) / px0

  // Get last available price date
  const sortedDates = Array.from(priceSeries.keys()).sort()
  const lastPriceDate = parseISO(sortedDates[sortedDates.length - 1])

  // Evaluation date = min(start + 60m, last available price)
  const potentialEvalDate = addMonths(startDate, TERM_MONTHS)
  const evalDate = isAfter(potentialEvalDate, lastPriceDate)
    ? lastPriceDate
    : potentialEvalDate

  // Build ledger
  let btcDca = CASH_UPFRONT / px0
  const rows: LedgerRow[] = [
    {
      Date: format(startDate, 'yyyy-MM-dd'),
      Payment_USD: CASH_UPFRONT,
      BTC_Price: px0,
      BTC_Added_DCA: CASH_UPFRONT / px0,
      Cum_BTC_DCA: btcDca,
    },
  ]

  let paidMonths = 0
  let payDate = new Date(startDate)

  while (true) {
    payDate = addMonths(payDate, 1)
    if (isAfter(payDate, evalDate) || paidMonths >= TERM_MONTHS) {
      break
    }

    const btcPrice = priceOn(payDate, priceSeries)
    const btcAdded = MONTHLY_PAYMENT / btcPrice
    btcDca += btcAdded
    paidMonths += 1

    rows.push({
      Date: format(payDate, 'yyyy-MM-dd'),
      Payment_USD: MONTHLY_PAYMENT,
      BTC_Price: btcPrice,
      BTC_Added_DCA: btcAdded,
      Cum_BTC_DCA: btcDca,
    })
  }

  // Profit / Loss
  const evalPx = priceOn(evalDate, priceSeries)
  const valuationPx = crashPx !== undefined ? crashPx : evalPx
  const valDate = crashPx !== undefined ? addDays(evalDate, 1) : evalDate
  const dollarsIn = CASH_UPFRONT + MONTHLY_PAYMENT * paidMonths

  const profitLoan = fullBtc * valuationPx - (CASH_UPFRONT + LOAN_PRINCIPAL)
  const profitDca = btcDca * valuationPx - dollarsIn

  return {
    profitLoan,
    profitDca,
    ledger: rows,
    evalDate,
    valDate,
    btcLoan: fullBtc,
    btcDca,
    dollarsIn,
    valPx: valuationPx,
  }
}

// ────────────────────────────────────────────────────────────────
// Calculate moving averages
// ────────────────────────────────────────────────────────────────
function calculateMovingAverages(
  priceSeries: Map<string, number>,
  periods: number[]
): Map<
  string,
  { date: string; price: number; [key: string]: number | string | null }
> {
  const sortedDates = Array.from(priceSeries.keys()).sort()
  const resultMap = new Map<
    string,
    { date: string; price: number; [key: string]: number | string | null }
  >()

  sortedDates.forEach((dateStr, index) => {
    const price = priceSeries.get(dateStr)!
    const result: {
      date: string
      price: number
      [key: string]: number | string | null
    } = {
      date: dateStr,
      price,
    }

    // Calculate each moving average
    periods.forEach((period) => {
      const maKey = `ma${period}`

      if (index >= period - 1) {
        // Calculate average of last 'period' prices
        let sum = 0
        for (let i = index - period + 1; i <= index; i++) {
          sum += priceSeries.get(sortedDates[i])!
        }
        result[maKey] = sum / period
      } else {
        // Not enough data points yet
        result[maKey] = null // Set to null for early days
      }
    })

    resultMap.set(dateStr, result)
  })

  return resultMap
}

// ────────────────────────────────────────────────────────────────
// Main analysis functions - browser version
// ────────────────────────────────────────────────────────────────
async function fullAnalysisBrowser(
  csvContent: string,
  options: CommandOptions = {}
): Promise<AnalysisResult[]> {
  // Load price data from CSV string
  let priceSeries = loadPriceDataFromCsv(csvContent)

  // Apply future scenario if requested
  if (options.futureScenario) {
    priceSeries = appendFutureScenario(priceSeries)
  }

  // Get all dates
  let startDates = Array.from(priceSeries.keys()).sort()

  // Apply start filter if provided
  if (options.start) {
    const startFilter = parseISO(options.start)
    startDates = startDates.filter((dateStr) => {
      const date = parseISO(dateStr)
      return !isAfter(startFilter, date)
    })
  }

  // Run simulations for all start dates
  const results: AnalysisResult[] = []

  for (const dateStr of startDates) {
    const startDate = parseISO(dateStr)
    const simulation = simulateStart(startDate, priceSeries, options.flashCrash)

    const winner = simulation.profitLoan > simulation.profitDca ? 'loan' : 'dca'

    results.push({
      date: dateStr,
      win: winner,
      btcPrice: priceOn(startDate, priceSeries),
      profitLoan: simulation.profitLoan,
      profitDca: simulation.profitDca,
      profitDifference: simulation.profitLoan - simulation.profitDca,
      btcLoan: simulation.btcLoan,
      btcDca: simulation.btcDca,
      evalDate: format(simulation.evalDate, 'yyyy-MM-dd'),
      valDate: format(simulation.valDate, 'yyyy-MM-dd'),
    })
  }

  return results
}

// ────────────────────────────────────────────────────────────────
// Enhanced main analysis functions with MA data
// ────────────────────────────────────────────────────────────────
async function fullAnalysisBrowserEnhanced(
  csvContent: string,
  options: CommandOptions = {}
): Promise<{
  results: AnalysisResult[]
  chartData: any[]
  averageMetrics: {
    avgMonthlyPaymentLoan: number
    avgMonthlyPaymentDCA: number
    avgBTCAccumulatedLoan: number
    avgBTCAccumulatedDCA: number
  }
}> {
  // Load price data from CSV string
  let priceSeries = loadPriceDataFromCsv(csvContent)

  // Apply future scenario if requested
  if (options.futureScenario) {
    priceSeries = appendFutureScenario(priceSeries)
  }

  // Calculate moving averages
  const maData = calculateMovingAverages(priceSeries, [200, 500])

  // Get all dates
  let startDates = Array.from(priceSeries.keys()).sort()

  // Apply start filter if provided
  if (options.start) {
    const startFilter = parseISO(options.start)
    startDates = startDates.filter((dateStr) => {
      const date = parseISO(dateStr)
      return !isAfter(startFilter, date)
    })
  }

  // Run simulations for all start dates
  const results: AnalysisResult[] = []
  let totalMonthlyPaymentLoan = 0
  let totalMonthlyPaymentDCA = 0
  let totalBTCLoan = 0
  let totalBTCDCA = 0
  let validResultsCount = 0

  for (const dateStr of startDates) {
    const startDate = parseISO(dateStr)
    const simulation = simulateStart(startDate, priceSeries, options.flashCrash)

    const winner = simulation.profitLoan > simulation.profitDca ? 'loan' : 'dca'

    results.push({
      date: dateStr,
      win: winner,
      btcPrice: priceOn(startDate, priceSeries),
      profitLoan: simulation.profitLoan,
      profitDca: simulation.profitDca,
      profitDifference: simulation.profitLoan - simulation.profitDca,
      btcLoan: simulation.btcLoan,
      btcDca: simulation.btcDca,
      evalDate: format(simulation.evalDate, 'yyyy-MM-dd'),
      valDate: format(simulation.valDate, 'yyyy-MM-dd'),
    })

    // Accumulate for averages
    totalMonthlyPaymentLoan += MONTHLY_PAYMENT
    totalMonthlyPaymentDCA += MONTHLY_PAYMENT
    totalBTCLoan += simulation.btcLoan
    totalBTCDCA += simulation.btcDca
    validResultsCount++
  }

  // Prepare chart data with MA values
  const chartData = results.map((result) => {
    const maInfo = maData.get(result.date)
    return {
      date: result.date,
      price: result.btcPrice,
      win: result.win,
      ma200: maInfo?.ma200,
      ma500: maInfo?.ma500,
      profitLoan: result.profitLoan,
      profitDca: result.profitDca,
      btcLoan: result.btcLoan,
      btcDca: result.btcDca,
    }
  })

  // Calculate averages
  const averageMetrics = {
    avgMonthlyPaymentLoan:
      validResultsCount > 0 ? totalMonthlyPaymentLoan / validResultsCount : 0,
    avgMonthlyPaymentDCA:
      validResultsCount > 0 ? totalMonthlyPaymentDCA / validResultsCount : 0,
    avgBTCAccumulatedLoan:
      validResultsCount > 0 ? totalBTCLoan / validResultsCount : 0,
    avgBTCAccumulatedDCA:
      validResultsCount > 0 ? totalBTCDCA / validResultsCount : 0,
  }

  return {
    results,
    chartData,
    averageMetrics,
  }
}

async function debugSingleDateBrowser(
  csvContent: string,
  debugDate: string,
  options: CommandOptions = {}
): Promise<{
  result: AnalysisResult
  ledger: LedgerRow[]
  summary: {
    loanProfitUSD: number
    dcaProfitUSD: number
    winner: 'loan' | 'dca'
    winnerProfitDiff: number
    btcLoan: number
    btcDca: number
    dollarsInvested: number
    valuationPrice: number
  }
}> {
  // Load price data from CSV string
  let priceSeries = loadPriceDataFromCsv(csvContent)

  // Apply future scenario if requested
  if (options.futureScenario) {
    priceSeries = appendFutureScenario(priceSeries)
  }

  const startDate = parseISO(debugDate)
  const simulation = simulateStart(startDate, priceSeries, options.flashCrash)

  const winner = simulation.profitLoan > simulation.profitDca ? 'loan' : 'dca'

  const result: AnalysisResult = {
    date: debugDate,
    win: winner,
    btcPrice: priceOn(startDate, priceSeries),
    profitLoan: simulation.profitLoan,
    profitDca: simulation.profitDca,
    profitDifference: simulation.profitLoan - simulation.profitDca,
    btcLoan: simulation.btcLoan,
    btcDca: simulation.btcDca,
    evalDate: format(simulation.evalDate, 'yyyy-MM-dd'),
    valDate: format(simulation.valDate, 'yyyy-MM-dd'),
  }

  return {
    result,
    ledger: simulation.ledger,
    summary: {
      loanProfitUSD: simulation.profitLoan,
      dcaProfitUSD: simulation.profitDca,
      winner,
      winnerProfitDiff: Math.abs(simulation.profitLoan - simulation.profitDca),
      btcLoan: simulation.btcLoan,
      btcDca: simulation.btcDca,
      dollarsInvested: simulation.dollarsIn,
      valuationPrice: simulation.valPx,
    },
  }
}

// ────────────────────────────────────────────────────────────────
// Export enhanced functions
// ────────────────────────────────────────────────────────────────
export {
  fullAnalysisBrowser,
  fullAnalysisBrowserEnhanced,
  debugSingleDateBrowser,
  CASH_UPFRONT,
  LOAN_PRINCIPAL,
  TERM_MONTHS,
  ANNUAL_RATE,
  MONTHLY_PAYMENT,
}

export type { AnalysisResult, LedgerRow, CommandOptions }
