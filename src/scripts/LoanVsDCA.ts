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
  loanReturns: number
  dcaReturns: number
  ledger: LedgerRow[]
  evalDate: Date
  valDate: Date
  btcLoan: number
  btcDca: number
  dollarsIn: number
  valPx: number
  monthlyPayment: number
}

interface AnalysisResult {
  date: string
  win: 'loan' | 'dca'
  btcWin: 'loan' | 'dca'
  btcPrice: number
  profitLoan: number
  profitDca: number
  profitDifference: number
  loanReturns: number
  dcaReturns: number
  btcLoan: number
  btcDca: number
  dollarsIn: number
  evalDate: string
  valDate: string
}

interface CommandOptions {
  start?: string
  debug?: string
  flashCrash?: number
  futureScenario?: boolean
  loanAmount?: number
  timePeriod?: number
  downPayment?: number
  loanAPR?: number
  liquidationInsuranceCost?: number
  dcaWithoutDownPayment?: boolean
  btcYield?: number
  dcaCadence?: 'daily' | 'weekly' | 'monthly'
}

// ────────────────────────────────────────────────────────────────
// Parameters – adjust at will
// ────────────────────────────────────────────────────────────────
// Note: APR is now passed as a parameter to functions

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
  crashPx?: number,
  loanAmount: number = 100_000,
  timePeriod: number = 60,
  downPayment: number = 0.2,
  loanAPR: number = 10,
  liquidationInsuranceCost: number = 0,
  dcaWithoutDownPayment: boolean = false,
  btcYield: number = 0,
  dcaCadence: 'daily' | 'weekly' | 'monthly' = 'daily'
): SimulationResult {
  const cashUpfront = loanAmount * downPayment // Dynamic down payment
  const loanPrincipal = loanAmount * (1 - downPayment) // Dynamic loan principal
  const annualRate = loanAPR / 100 // Convert percentage to decimal
  const monthlyRate = annualRate / 12
  const monthlyPayment =
    (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, timePeriod)) /
    (Math.pow(1 + monthlyRate, timePeriod) - 1)

  // Calculate DCA payment amount based on cadence
  const getDcaPaymentAmount = (cadence: 'daily' | 'weekly' | 'monthly') => {
    switch (cadence) {
      case 'daily':
        return monthlyPayment / 30 // Approximate daily payment
      case 'weekly':
        return monthlyPayment / 4 // Approximate weekly payment
      case 'monthly':
        return monthlyPayment
      default:
        return monthlyPayment
    }
  }

  const dcaPaymentAmount = getDcaPaymentAmount(dcaCadence)

  const px0 = priceOn(startDate, priceSeries)
  const fullBtc = loanAmount / px0

  // BTC Yield calculation
  const BTC_YIELD_COMPOUNDING = false // Hardcoded flag to enable/disable compounding
  const btcYieldRate = btcYield / 100 // Convert percentage to decimal
  const yearsInPeriod = timePeriod / 12 // Convert months to years

  let btcYieldAmount = 0
  if (BTC_YIELD_COMPOUNDING) {
    // Compound yield (yearly compounding)
    btcYieldAmount = fullBtc * (Math.pow(1 + btcYieldRate, yearsInPeriod) - 1)
  } else {
    // Simple yield (no compounding)
    btcYieldAmount = fullBtc * btcYieldRate * yearsInPeriod
  }

  // Get last available price date
  const sortedDates = Array.from(priceSeries.keys()).sort()
  const lastPriceDate = parseISO(sortedDates[sortedDates.length - 1])

  // Evaluation date = min(start + 60m, last available price)
  const potentialEvalDate = addMonths(startDate, timePeriod)
  const evalDate = isAfter(potentialEvalDate, lastPriceDate)
    ? lastPriceDate
    : potentialEvalDate

  // Build ledger
  const dcaUpfront = dcaWithoutDownPayment ? 0 : cashUpfront
  let btcDca = dcaUpfront / px0
  const rows: LedgerRow[] = [
    {
      Date: format(startDate, 'yyyy-MM-dd'),
      Payment_USD: dcaUpfront,
      BTC_Price: px0,
      BTC_Added_DCA: dcaUpfront / px0,
      Cum_BTC_DCA: btcDca,
    },
  ]

  // let paymentCount = 0
  let payDate = new Date(startDate)
  let totalDcaPayments = 0

  // Helper function to get next payment date based on cadence
  const getNextPaymentDate = (
    currentDate: Date,
    cadence: 'daily' | 'weekly' | 'monthly'
  ) => {
    switch (cadence) {
      case 'daily':
        return addDays(currentDate, 1)
      case 'weekly':
        return addDays(currentDate, 7)
      case 'monthly':
        return addMonths(currentDate, 1)
      default:
        return addDays(currentDate, 1)
    }
  }

  while (true) {
    payDate = getNextPaymentDate(payDate, dcaCadence)
    if (isAfter(payDate, evalDate)) {
      break
    }

    const btcPrice = priceOn(payDate, priceSeries)
    const btcAdded = dcaPaymentAmount / btcPrice
    btcDca += btcAdded
    totalDcaPayments += dcaPaymentAmount
    // paymentCount += 1

    rows.push({
      Date: format(payDate, 'yyyy-MM-dd'),
      Payment_USD: dcaPaymentAmount,
      BTC_Price: btcPrice,
      BTC_Added_DCA: btcAdded,
      Cum_BTC_DCA: btcDca,
    })
  }

  // Profit / Loss
  const evalPx = priceOn(evalDate, priceSeries)
  const valuationPx = crashPx !== undefined ? crashPx : evalPx
  const valDate = crashPx !== undefined ? addDays(evalDate, 1) : evalDate
  const dollarsIn = dcaUpfront + totalDcaPayments

  // Calculate total loan cost including liquidation insurance
  const totalLoanCost = loanAmount + liquidationInsuranceCost

  // Calculate loan profit including BTC yield
  const totalBtcLoan = fullBtc + btcYieldAmount // BTC amount + yield
  const profitLoan = totalBtcLoan * valuationPx - totalLoanCost
  const profitDca = btcDca * valuationPx - dollarsIn

  // Calculate returns (total value of holdings)
  const loanReturns = totalBtcLoan * valuationPx
  const dcaReturns = btcDca * valuationPx

  return {
    profitLoan,
    profitDca,
    loanReturns,
    dcaReturns,
    ledger: rows,
    evalDate,
    valDate,
    btcLoan: totalBtcLoan, // Updated to include yield
    btcDca,
    dollarsIn,
    valPx: valuationPx,
    monthlyPayment,
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
    } = { date: dateStr, price }

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
// async function fullAnalysisBrowser(
//   csvContent: string,
//   options: CommandOptions = {}
// ): Promise<AnalysisResult[]> {
//   // Load price data from CSV string
//   let priceSeries = loadPriceDataFromCsv(csvContent)

//   // Apply future scenario if requested
//   if (options.futureScenario) {
//     priceSeries = appendFutureScenario(priceSeries)
//   }

//   // Get all dates
//   let startDates = Array.from(priceSeries.keys()).sort()

//   // Apply start filter if provided
//   if (options.start) {
//     const startFilter = parseISO(options.start)
//     startDates = startDates.filter((dateStr) => {
//       const date = parseISO(dateStr)
//       return !isAfter(startFilter, date)
//     })
//   }

//   // Run simulations for all start dates
//   const results: AnalysisResult[] = []

//   for (const dateStr of startDates) {
//     const startDate = parseISO(dateStr)
//     const simulation = simulateStart(
//       startDate,
//       priceSeries,
//       options.flashCrash,
//       options.loanAmount,
//       options.timePeriod
//     )

//     const winner = simulation.profitLoan > simulation.profitDca ? 'loan' : 'dca'

//     results.push({
//       date: dateStr,
//       win: winner,
//       btcPrice: priceOn(startDate, priceSeries),
//       profitLoan: simulation.profitLoan,
//       profitDca: simulation.profitDca,
//       profitDifference: simulation.profitLoan - simulation.profitDca,
//       btcLoan: simulation.btcLoan,
//       btcDca: simulation.btcDca,
//       dollarsIn: simulation.dollarsIn,
//       evalDate: format(simulation.evalDate, 'yyyy-MM-dd'),
//       valDate: format(simulation.valDate, 'yyyy-MM-dd'),
//     })
//   }

//   return results
// }

// ────────────────────────────────────────────────────────────────
// Enhanced main analysis functions with MA data
// ────────────────────────────────────────────────────────────────
export async function fullAnalysisBrowserEnhanced(
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
    const simulation = simulateStart(
      startDate,
      priceSeries,
      options.flashCrash,
      options.loanAmount,
      options.timePeriod,
      options.downPayment,
      options.loanAPR,
      options.liquidationInsuranceCost,
      options.dcaWithoutDownPayment,
      options.btcYield,
      options.dcaCadence
    )

    const usdWinner =
      simulation.profitLoan > simulation.profitDca ? 'loan' : 'dca'
    const btcWinner = simulation.btcLoan > simulation.btcDca ? 'loan' : 'dca'

    results.push({
      date: dateStr,
      win: usdWinner,
      btcWin: btcWinner,
      btcPrice: priceOn(startDate, priceSeries),
      profitLoan: simulation.profitLoan,
      profitDca: simulation.profitDca,
      profitDifference: simulation.profitLoan - simulation.profitDca,
      loanReturns: simulation.loanReturns,
      dcaReturns: simulation.dcaReturns,
      btcLoan: simulation.btcLoan,
      btcDca: simulation.btcDca,
      dollarsIn: simulation.dollarsIn,
      evalDate: format(simulation.evalDate, 'yyyy-MM-dd'),
      valDate: format(simulation.valDate, 'yyyy-MM-dd'),
    })

    // Accumulate for averages
    totalMonthlyPaymentLoan += simulation.monthlyPayment
    totalMonthlyPaymentDCA += simulation.monthlyPayment
    totalBTCLoan += simulation.btcLoan
    totalBTCDCA += simulation.btcDca
    validResultsCount++
  }

  // Prepare chart data with MA values
  const chartData = results.map((result) => {
    const maInfo = maData.get(result.date)
    return {
      date: result.date,
      valDate: result.valDate,
      price: result.btcPrice,
      win: result.win,
      btcWin: result.btcWin,
      ma200: maInfo?.ma200,
      ma500: maInfo?.ma500,
      profitLoan: result.profitLoan,
      profitDca: result.profitDca,
      loanReturns: result.loanReturns,
      dcaReturns: result.dcaReturns,
      btcLoan: result.btcLoan,
      btcDca: result.btcDca,
      dollarsIn: result.dollarsIn,
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

  return { results, chartData, averageMetrics }
}

// async function debugSingleDateBrowser(
//   csvContent: string,
//   debugDate: string,
//   options: CommandOptions = {}
// ): Promise<{
//   result: AnalysisResult
//   ledger: LedgerRow[]
//   summary: {
//     loanProfitUSD: number
//     dcaProfitUSD: number
//     winner: 'loan' | 'dca'
//     winnerProfitDiff: number
//     btcLoan: number
//     btcDca: number
//     dollarsInvested: number
//     valuationPrice: number
//   }
// }> {
//   // Load price data from CSV string
//   let priceSeries = loadPriceDataFromCsv(csvContent)

//   // Apply future scenario if requested
//   if (options.futureScenario) {
//     priceSeries = appendFutureScenario(priceSeries)
//   }

//   const startDate = parseISO(debugDate)
//   const simulation = simulateStart(
//     startDate,
//     priceSeries,
//     options.flashCrash,
//     options.loanAmount,
//     options.timePeriod
//   )

//   const winner = simulation.profitLoan > simulation.profitDca ? 'loan' : 'dca'

//   const result: AnalysisResult = {
//     date: debugDate,
//     win: winner,
//     btcPrice: priceOn(startDate, priceSeries),
//     profitLoan: simulation.profitLoan,
//     profitDca: simulation.profitDca,
//     profitDifference: simulation.profitLoan - simulation.profitDca,
//     btcLoan: simulation.btcLoan,
//     btcDca: simulation.btcDca,
//     evalDate: format(simulation.evalDate, 'yyyy-MM-dd'),
//     valDate: format(simulation.valDate, 'yyyy-MM-dd'),
//   }

//   return {
//     result,
//     ledger: simulation.ledger,
//     summary: {
//       loanProfitUSD: simulation.profitLoan,
//       dcaProfitUSD: simulation.profitDca,
//       winner,
//       winnerProfitDiff: Math.abs(simulation.profitLoan - simulation.profitDca),
//       btcLoan: simulation.btcLoan,
//       btcDca: simulation.btcDca,
//       dollarsInvested: simulation.dollarsIn,
//       valuationPrice: simulation.valPx,
//     },
//   }
// }

export type { AnalysisResult, LedgerRow, CommandOptions }
