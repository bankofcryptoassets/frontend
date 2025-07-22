/**
 * Test script for browser-compatible BTC loan vs DCA analysis
 */

import {
  fullAnalysisBrowser,
  debugSingleDateBrowser,
} from './btc_loan_vs_dca_browser'

// Sample CSV data for testing (just a few rows)
const sampleCsvData = `openTime,close
2024-01-01 00:00:00+00:00,43111.1
2024-01-01 01:00:00+00:00,43150.5
2024-01-01 02:00:00+00:00,43200.2
2024-01-02 00:00:00+00:00,45154.69
2024-01-02 01:00:00+00:00,45200.0
2024-01-03 00:00:00+00:00,42255.72
2024-02-01 00:00:00+00:00,42847.06
2024-03-01 00:00:00+00:00,62333.52
2024-04-01 00:00:00+00:00,68927.1
2024-05-01 00:00:00+00:00,58913.99
2024-06-01 00:00:00+00:00,67750.71
2024-07-01 00:00:00+00:00,63649.99
2024-08-01 00:00:00+00:00,62954
2024-09-01 00:00:00+00:00,58541.1
2024-10-01 00:00:00+00:00,61987.99
2024-11-01 00:00:00+00:00,69151.66
2024-12-01 00:00:00+00:00,97118.69
2025-01-01 00:00:00+00:00,94340.06
2025-02-01 00:00:00+00:00,102003.7
2025-03-01 00:00:00+00:00,85327.57
2025-04-01 00:00:00+00:00,85126.68
2025-05-01 00:00:00+00:00,96869.55`

async function runTests() {
  console.log('Testing browser-compatible BTC loan vs DCA analysis...\n')

  try {
    // Test 1: Full analysis
    console.log('Test 1: Running full analysis')
    const results = await fullAnalysisBrowser(sampleCsvData, {
      start: '2024-01-01',
    })

    console.log(`✓ Full analysis completed: ${results.length} results`)
    console.log('  First result:', results[0])

    // Test 2: Debug single date
    console.log('\nTest 2: Debug analysis for 2024-01-01')
    const debugResult = await debugSingleDateBrowser(
      sampleCsvData,
      '2024-01-01'
    )

    console.log('✓ Debug analysis completed')
    console.log('  Summary:', debugResult.summary)
    console.log('  Ledger entries:', debugResult.ledger.length)

    // Test 3: Flash crash scenario
    console.log('\nTest 3: Flash crash scenario')
    const crashResults = await fullAnalysisBrowser(sampleCsvData, {
      start: '2024-01-01',
      flashCrash: 25000,
    })

    console.log(
      `✓ Flash crash analysis completed: ${crashResults.length} results`
    )
    console.log('  First result with crash:', crashResults[0])

    console.log('\n✅ All tests passed!')
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests()
}
