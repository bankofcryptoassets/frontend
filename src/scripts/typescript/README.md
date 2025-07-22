# BTC Loan vs. DCA Analysis - TypeScript Version

This is a TypeScript migration of the Python BTC loan vs DCA analysis script. It
analyzes two strategies for deploying $100,000 into Bitcoin:

1. **Loan Strategy**: Buy BTC immediately with $20,000 cash + $80,000 loan (5
   years @ 10% APR)
2. **DCA Strategy**: Dollar-cost average the same cash flows over 5 years

## Features

- Full historical backtesting across all available dates
- Single date detailed analysis with payment ledger
- Flash crash scenarios
- Future price path simulations
- Export data in JSON format for charting libraries

## Installation

The required dependencies are already included in the main project:

- `date-fns` - Date manipulation
- `csv-parse` - CSV parsing
- `tsx` - TypeScript execution

## Usage

### As a CLI Tool

```bash
# Full analysis (all dates)
npx tsx src/scripts/typescript/btc_loan_vs_dca.ts

# Analysis starting from a specific date
npx tsx src/scripts/typescript/btc_loan_vs_dca.ts --start 2024-01-01

# Debug mode - detailed analysis for a single date
npx tsx src/scripts/typescript/btc_loan_vs_dca.ts --debug 2021-11-10

# Flash crash scenario
npx tsx src/scripts/typescript/btc_loan_vs_dca.ts --flash-crash 25000

# Future scenario (adds 18-month synthetic path)
npx tsx src/scripts/typescript/btc_loan_vs_dca.ts --future-scenario
```

### As a Module

```typescript
import { fullAnalysis, debugSingleDate } from './btc_loan_vs_dca.js'

// Run full analysis
const results = await fullAnalysis({
  start: '2024-01-01',
  flashCrash: 25000,
})

// Debug single date
const { result, ledger, summary } = await debugSingleDate('2024-01-01')
```

## Output Format

The analysis returns an array of objects with the following structure:

```typescript
{
  date: string // "2024-01-01"
  win: 'loan' | 'dca' // Winner strategy
  btcPrice: number // BTC price on start date
  profitLoan: number // Loan strategy profit in USD
  profitDca: number // DCA strategy profit in USD
  profitDifference: number // Profit difference (loan - dca)
  btcLoan: number // Total BTC acquired via loan
  btcDca: number // Total BTC acquired via DCA
  evalDate: string // Evaluation date
  valDate: string // Valuation date
}
```

## Example

See `btc_loan_vs_dca_example.ts` for usage examples including:

- Running full analysis
- Debugging specific dates
- Flash crash scenarios
- Formatting data for charts

Run the example:

```bash
npx tsx src/scripts/typescript/btc_loan_vs_dca_example.ts
```

## Differences from Python Version

- Returns structured data instead of plotting charts
- Uses TypeScript/JavaScript date libraries instead of pandas
- Exports functions for programmatic use
- More suitable for integration with web applications

## Parameters

You can adjust the loan parameters by modifying the constants in the main
script:

- `CASH_UPFRONT`: Initial cash payment ($20,000)
- `LOAN_PRINCIPAL`: Loan amount ($80,000)
- `TERM_MONTHS`: Loan term (60 months)
- `ANNUAL_RATE`: Annual interest rate (10%)
