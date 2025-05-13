import { SVGProps } from 'react'

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number
}

export type LoanAvailabilityType = {
  status?: string
  data?: {
    availableLoanAmountInBTC?: number
  }
}

export type LoanSummaryResponse = {
  status: string
  data: {
    loanSummary: LoanSummary
  }
}

export type LoanSummary = {
  loanAmount: number
  downPayment: string
  openingFee: string
  upfrontPayment: string
  principal: string
  monthlyPayment: string
  totalInterest: string
  totalPayment: string
  apr: string
  interestRate: number
  term: number
  amortizationSchedule: AmortizationSchedule[]
  firstTransaction: FirstTransaction
}

export type AmortizationSchedule = {
  month: number
  interestPayment: string
  principalPayment: string
  remainingBalance: string
}

export type FirstTransaction = {
  amountSent: string
  breakdown: Breakdown
}

export type Breakdown = {
  downPayment: string
  loanOpeningFee: string
}
