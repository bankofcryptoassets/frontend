// A simple store to keep track of the wallet address
// This is needed because the getNonce function in the RainbowKit authentication adapter
// doesn't receive the address as a parameter

let currentAddress: string | null = null

export const setWalletAddress = (address: string) => {
  currentAddress = address
}

export const getWalletAddress = () => {
  return currentAddress
}

// store temp auth token
let currentTempAuthToken: string | null = null

export const setTempAuthToken = (token: string) => {
  currentTempAuthToken = token
}

export const getTempAuthToken = () => {
  return currentTempAuthToken
}
