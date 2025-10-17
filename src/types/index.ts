import { SVGProps } from 'react'

export type IconSvgProps = SVGProps<SVGSVGElement> & { size?: number }

export type LoanAvailabilityType = {
  status?: string
  data?: {
    availableLoanAmountInBTC?: number
    fgi: { value: number; valueText: string }
    btcBorrowers: number
    totalLoanInBTC: number
    totalLoanInUSD: number
  }
}

export type LoanSummaryResponse = {
  status: string
  data: { loanSummary: LoanSummary }
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
  currentBtcPrice: string
  liquidationChart: { months: number[]; liquidationPrices: number[] }
  basisPoints: string
  initialBtcCollateral: string
  contract: {
    totalLoanAmount: string
    borrowerDeposit: string
    lenderPrincipal: string
  }
}

export type AmortizationSchedule = {
  month: number
  interestPayment: string
  principalPayment: string
  remainingBalance: string
}

export type FirstTransaction = { amountSent: string; breakdown: Breakdown }

export type Breakdown = { downPayment: string; loanOpeningFee: string }

export type LoanRequestPayload = {
  _id: string
  loan_id: string
  user_id: UserID
  loan_amount: number
  up_front_payment: number
  total_amount_payable: number
  remaining_amount: number
  collateral: number
  asset: string
  asset_borrowed: number
  asset_remaining: number
  asset_price: number
  asset_released_per_month: number
  chain_id: number
  interest_rate: number
  loan_duration: number
  number_of_monthly_installments: number
  interest: number
  monthly_payable_amount: number
  interest_payable_month: number
  principal_payable_month: number
  liquidation_factor: number
  lends: string[]
  receivable_amount_By_lenders: number[]
  receivable_interest_by_lenders: number
  payments: string[]
  openedOn: Date
  lenders_capital_invested: LendersCapitalInvested[]
  receivable_amount_monthly_by_lenders: ReceivableAmountMonthlyByLender[]
  withdrawable_by_user: WithdrawableByUser[]
  last_payment_date: Date
  next_payment_date: Date
  months_not_paid: number
  bounce: boolean
  loan_end: Date
  amortization_schedule: AmortizationSchedule[]
  liquidation_price: number
  is_active: boolean
  is_liquidated: boolean
  is_repaid: boolean
  is_defaulted: boolean
}

export type LendersCapitalInvested = {
  lend_id: string
  user_id: string
  user_address: string
  amount: number
  amount_received: number
  received_interest: number
  total_received: number
  remaining_amount: number
}

export type ReceivableAmountMonthlyByLender = {
  lend_id: string
  user_id: string
  amount: number
  interest: number
  total_amount: number
  remaining_amount: number
}

export type UserID = { _id: string; user_address: string }

export type WithdrawableByUser = { user_id: string; amount: number }

export type LendingListData = {
  lendings: {
    _id: string
    user_address: string
    lending_amount_approved: number
    available_amount: number
    openedOn: string
    duration_preference: string
    updated_at: string
  }[]
}

export type LendingStats = {
  totalUSDInvested: number
  totallenders: number
  baseAPR: number
  loanAPR: number
}

export type BitcoinPriceData = {
  status: string
  data: { convertedPrice: number }
}
