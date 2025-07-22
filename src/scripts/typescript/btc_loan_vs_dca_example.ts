/**
 * Example usage of the BTC Loan vs DCA analysis functions
 */

import { fullAnalysis, debugSingleDate } from './btc_loan_vs_dca.js'

async function runExamples() {
  console.log('BTC Loan vs DCA Analysis Examples\n')

  // Example 1: Run full analysis for recent dates
  console.log('Example 1: Full analysis starting from 2024-01-01')
  console.log('-'.repeat(50))

  const results = await fullAnalysis({
    start: '2024-01-01',
  })

  // Show summary statistics
  const loanWins = results.filter((r) => r.win === 'loan').length
  const totalDays = results.length
  const winPercentage = ((loanWins / totalDays) * 100).toFixed(1)

  console.log(`Total days analyzed: ${totalDays}`)
  console.log(`Loan wins: ${loanWins} (${winPercentage}%)`)
  console.log(
    `DCA wins: ${totalDays - loanWins} (${(((totalDays - loanWins) / totalDays) * 100).toFixed(1)}%)`
  )

  // Show first 5 results
  console.log('\nFirst 5 results:')
  results.slice(0, 5).forEach((result, i) => {
    console.log(
      `${i + 1}. ${result.date}: ${result.win.toUpperCase()} wins by $${Math.abs(result.profitDifference).toFixed(2)}`
    )
  })

  console.log('\n' + '='.repeat(50) + '\n')

  // Example 2: Debug a specific date
  console.log('Example 2: Detailed analysis for 2021-11-10 (Bitcoin ATH)')
  console.log('-'.repeat(50))

  const { result, summary } = await debugSingleDate('2021-11-10')

  console.log('Summary:')
  console.log(`  BTC Price on start date: $${result.btcPrice.toFixed(2)}`)
  console.log(`  Loan profit: $${summary.loanProfitUSD.toFixed(2)}`)
  console.log(`  DCA profit: $${summary.dcaProfitUSD.toFixed(2)}`)
  console.log(`  Winner: ${summary.winner.toUpperCase()}`)
  console.log(`  Difference: $${summary.winnerProfitDiff.toFixed(2)}`)
  console.log(`  Total BTC (Loan): ${summary.btcLoan.toFixed(8)}`)
  console.log(`  Total BTC (DCA): ${summary.btcDca.toFixed(8)}`)

  console.log('\n' + '='.repeat(50) + '\n')

  // Example 3: Flash crash scenario
  console.log('Example 3: Flash crash scenario - BTC drops to $25,000')
  console.log('-'.repeat(50))

  const crashResults = await fullAnalysis({
    start: '2024-01-01',
    flashCrash: 25000,
  })

  const crashLoanWins = crashResults.filter((r) => r.win === 'loan').length
  const crashWinPercentage = (
    (crashLoanWins / crashResults.length) *
    100
  ).toFixed(1)

  console.log(`With flash crash to $25,000:`)
  console.log(
    `  Loan wins: ${crashLoanWins} of ${crashResults.length} days (${crashWinPercentage}%)`
  )
  console.log(
    `  DCA wins: ${crashResults.length - crashLoanWins} of ${crashResults.length} days`
  )

  console.log('\n' + '='.repeat(50) + '\n')

  // Example 4: Get data in format ready for charting
  console.log('Example 4: Data formatted for charting libraries')
  console.log('-'.repeat(50))

  const chartData = results.slice(0, 10).map((r) => ({
    date: r.date,
    winner: r.win,
    btcPrice: r.btcPrice,
    loanProfit: r.profitLoan,
    dcaProfit: r.profitDca,
    profitDifference: r.profitDifference,
  }))

  console.log('Chart-ready data (first 10 entries):')
  console.log(JSON.stringify(chartData, null, 2))
}

// Run the examples
runExamples().catch(console.error)
