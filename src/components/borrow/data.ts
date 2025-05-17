export const MY_BORROWINGS = [
  {
    _id: 'loan_id',
    loan_id: 'abc123',
    user_id: {
      _id: 'user_id',
      user_address: '0x123...',
    },
    loan_amount: 1000,
    up_front_payment: 200,
    total_amount_payable: 1080,
    remaining_amount: 900,
    collateral: 250,
    asset: 'BTC',
    asset_borrowed: 0.02,
    asset_remaining: 0.015,
    asset_price: 48000,
    asset_released_per_month: 0.001,
    chain_id: 1,
    interest_rate: 8.0,
    loan_duration: 12,
    number_of_monthly_installments: 12,
    interest: 80,
    monthly_payable_amount: 90,
    interest_payable_month: 6.67,
    principal_payable_month: 83.33,
    liquidation_factor: 0.7,
    lends: ['lend_id_1', 'lend_id_2'],
    receivable_amount_By_lenders: [500, 500],
    receivable_interest_by_lenders: 80,
    payments: ['payment_id_1'],
    openedOn: '2024-01-01T00:00:00.000Z',
    lenders_capital_invested: [
      {
        lend_id: 'lend_id_1',
        user_id: 'lender_1',
        user_address: '0xabc...',
        amount: 500,
        amount_received: 250,
        received_interest: 20,
        total_received: 270,
        remaining_amount: 230,
      },
    ],
    receivable_amount_monthly_by_lenders: [
      {
        lend_id: 'lend_id_1',
        user_id: 'lender_1',
        amount: 500,
        interest: 20,
        total_amount: 520,
        remaining_amount: 270,
      },
    ],
    withdrawable_by_user: [
      {
        user_id: 'lender_1',
        amount: 100,
      },
    ],
    last_payment_date: '2024-04-01T00:00:00.000Z',
    next_payment_date: '2024-05-01T00:00:00.000Z',
    months_not_paid: 0,
    bounce: false,
    loan_end: '2025-01-01T00:00:00.000Z',
    amortization_schedule: [
      {
        duePrincipal: 83.33,
        dueInterest: 6.67,
        paid: false,
      },
    ],
    liquidation_price: 34000,
    is_active: true,
    is_liquidated: false,
    is_repaid: false,
    is_defaulted: false,
  },
]

export const SORTINGS = [
  { key: 'newest', label: 'Newest Loans First' },
  { key: 'oldest', label: 'Oldest Loans First' },
  { key: 'amount-high', label: 'Highest Loan Amount' },
  { key: 'amount-low', label: 'Lowest Loan Amount' },
  { key: 'health-high', label: 'Healthiest Loans First' },
  { key: 'health-low', label: 'At-Risk Loans First' },
  { key: 'outstanding-high', label: 'Highest Outstanding Balance' },
  { key: 'outstanding-low', label: 'Lowest Outstanding Balance' },
  { key: 'received-high', label: 'Most BTC Received' },
  { key: 'received-low', label: 'Least BTC Received' },
  { key: 'paid-high', label: 'Most Principal Paid' },
  { key: 'paid-low', label: 'Least Principal Paid' },
] as const

export const STATUSES = [
  { key: 'active', label: 'Active' },
  { key: 'closed', label: 'Closed' },
  { key: 'defaulted', label: 'Defaulted' },
  { key: 'liquidated', label: 'Liquidated' },
] as const

export const TIME_PERIOD_AND_INTEREST_RATES = [
  {
    timePeriod: '6',
    interestRate: '7',
  },
  {
    timePeriod: '12',
    interestRate: '10',
  },
  {
    timePeriod: '18',
    interestRate: '15',
  },
] as const

export const MY_LENDINGS = [
  {
    _id: '1',
    user_id: '1',
    loan_id: '1',
    amount: 1000,
    received_interest: 1000,
    total_received: 1000,
  },
]
