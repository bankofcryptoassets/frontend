export const API_BASE_URL = 'https://backend.xefi.ai/api'
// export const API_BASE_URL = 'http://localhost:5001/api'

export const COOKIE_KEYS = { JWT: 'auth:jwt' }

export const DASH = '—'

export const CONTRACT_ADDRESSES = {
  USDC: '0xe270578586FA80B627a0B84a3D86169B4B515730',
  MAIN: '0x80822a4BC3Ad8659686e2F44a24c70B47Cd5905b',
  BTC: '0xB4BF7595a438a41Dd9f691bfE7AF16A82123dF8d',
} as const

export const TIME_PERIOD = [
  { value: '36', label: '3 Years', y: 3, interestForLandingPage: 8 },
  { value: '60', label: '5 Years', y: 5, interestForLandingPage: 9 },
  { value: '84', label: '7 Years', y: 7, interestForLandingPage: 10 },
]
export const INTEREST_RATE = ['8']

// export const TELEGRAM_BOT_ID = '7818630903' // @bitmore_test_bot
export const TELEGRAM_BOT_ID = '7910535529' // @BitMor_Notifier_bot

export const TIME_PERIOD_AND_INTEREST_RATES = [
  { timePeriod: '6', interestRate: '7' },
  { timePeriod: '12', interestRate: '10' },
  { timePeriod: '18', interestRate: '15' },
] as const

export const DEFAULT_LOAN_AMOUNT = 100_000
export const MIN_DATE = '2017-08-17'
export const MAX_DATE = '2025-05-08'

export const OWNERSHIP_CALC_TIME_PERIOD = [
  { value: '6', label: '6 Months', y: 0.5 },
  { value: '12', label: '1 Year', y: 1 },
]

export const OWNERSHIP_CALC_INTEREST_RATE = ['10']
