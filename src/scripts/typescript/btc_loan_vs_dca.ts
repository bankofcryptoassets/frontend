#!/usr/bin/env node
/**
 * 100k USD BTC deployment – Loan vs. DCA (profit-based)
 * TypeScript migration of the Python script
 */

import * as fs from 'fs/promises'
import { parse } from 'csv-parse/sync'
import {
  parseISO,
  addMonths,
  addDays,
  format,
  isAfter,
  differenceInDays,
  startOfDay,
} from 'date-fns'
import * as path from 'path'
import { fileURLToPath } from 'url'

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
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const CSV_FILE = path.join(__dirname, '../../data/BTCUSDT_1h.csv')

const CASH_UPFRONT = 20_000 // USD paid immediately
const LOAN_PRINCIPAL = 80_000 // USD financed
const TERM_MONTHS = 60 // five years
const ANNUAL_RATE = 0.1
const MONTHLY_RATE = ANNUAL_RATE / 12

const MONTHLY_PAYMENT =
  (LOAN_PRINCIPAL * MONTHLY_RATE * Math.pow(1 + MONTHLY_RATE, TERM_MONTHS)) /
  (Math.pow(1 + MONTHLY_RATE, TERM_MONTHS) - 1)

// ────────────────────────────────────────────────────────────────
// Load Binance 1-hour CSV → UTC-daily closes
// ────────────────────────────────────────────────────────────────
async function loadPriceData(): Promise<Map<string, number>> {
  const csvContent = await fs.readFile(CSV_FILE, 'utf-8')
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
// Main analysis functions
// ────────────────────────────────────────────────────────────────
async function fullAnalysis(
  options: CommandOptions = {}
): Promise<AnalysisResult[]> {
  // Load price data
  let priceSeries = await loadPriceData()

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

async function debugSingleDate(
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
  // Load price data
  let priceSeries = await loadPriceData()

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
// Export functions for use in other modules
// ────────────────────────────────────────────────────────────────
export {
  fullAnalysis,
  debugSingleDate,
  CASH_UPFRONT,
  LOAN_PRINCIPAL,
  TERM_MONTHS,
  ANNUAL_RATE,
  MONTHLY_PAYMENT,
}

export type { AnalysisResult, LedgerRow, CommandOptions }

// ────────────────────────────────────────────────────────────────
// CLI interface (optional - can be run as a script)
// ────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2)
  const options: CommandOptions = {}

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--start':
        options.start = args[++i]
        break
      case '--debug':
        options.debug = args[++i]
        break
      case '--flash-crash':
        options.flashCrash = parseFloat(args[++i])
        break
      case '--future-scenario':
        options.futureScenario = true
        break
    }
  }

  try {
    if (options.debug) {
      // Debug mode - single date analysis
      const { result, ledger, summary } = await debugSingleDate(
        options.debug,
        options
      )

      console.log('\nLedger:')
      console.table(ledger)

      console.log('\nSummary:')
      console.log(
        `  Loan strategy profit: $${summary.loanProfitUSD.toFixed(2)}`
      )
      console.log(`  DCA strategy profit: $${summary.dcaProfitUSD.toFixed(2)}`)
      console.log(`  Winner: ${summary.winner.toUpperCase()}`)
      console.log(`  Difference: $${summary.winnerProfitDiff.toFixed(2)}`)

      console.log('\nResult data:')
      console.log(JSON.stringify(result, null, 2))
    } else {
      // Full analysis mode
      const results = await fullAnalysis(options)

      // Calculate win statistics
      const loanWins = results.filter((r) => r.win === 'loan').length
      const totalDays = results.length
      const winPercentage = ((loanWins / totalDays) * 100).toFixed(1)

      console.log(
        `\nLoan strategy beat DCA on ${loanWins} of ${totalDays} start-days (${winPercentage}%)`
      )

      // Output the results as JSON
      console.log('\nFull results (JSON):')
      console.log(JSON.stringify(results, null, 2))
    }
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}
