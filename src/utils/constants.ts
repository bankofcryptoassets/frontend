export const API_BASE_URL = 'https://backend.xefi.ai/api'
// export const API_BASE_URL = 'http://localhost:5001/api'

export const COOKIE_KEYS = {
  JWT: 'auth:jwt',
}

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
