import { createAuthenticationAdapter } from '@rainbow-me/rainbowkit'
import { createSiweMessage } from 'viem/siwe'
import { signInAction, signOutAction } from './actions'
import axios from '@/utils/axios'
import {
  getTempAuthToken,
  getWalletAddress,
  setTempAuthToken,
  setWalletAddress,
} from './authStore'
import { toast } from 'sonner'
import { trackEvent } from '@/utils/trackEvent'

type NounceResponse = {
  status: string
  message: number
  nonce: number
  token: string
}

type VerifyResponse = {
  status: string
  token: string
  user: unknown
  walletIsVirgin?: boolean
}

export const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    // Get the wallet address from the store if available
    const address = getWalletAddress()

    if (!address) throw new Error('No wallet address found')

    const response = await axios.get<NounceResponse>(
      `/auth/nonce?address=${address}`
    )

    const data = response?.data
    setTempAuthToken(data.token)
    return new Promise((resolve) => resolve(data.nonce as unknown as string))
  },
  createMessage: ({ nonce, address, chainId }) => {
    // Store the address for future use in getNonce
    setWalletAddress(address)

    return createSiweMessage({
      domain: window.location.host,
      uri: window.location.origin,
      address,
      statement: 'Sign in with Base to authenticate with our service.',
      version: '1',
      chainId,
      nonce,
    })
  },
  verify: async ({ signature, message }) => {
    try {
      // Get the temp token from the store
      const tempToken = getTempAuthToken()

      if (!tempToken || !signature) throw new Error('Invalid signature')

      const response = await axios.post<VerifyResponse>(
        `/auth/verify`,
        { message, signature },
        { headers: { authorization: `Bearer ${tempToken}` } }
      )

      const data = response.data
      if (!data.token) throw new Error('Failed to verify signature')

      await signInAction({ jwt: data.token })
      if (data?.walletIsVirgin)
        toast.success(`GO CRAZY!!`, {
          description: `We've funded your wallet with test usdc from our faucet for you to test out the platform.`,
        })

      trackEvent('connected_wallet', {
        wallet_address: getWalletAddress(),
      })

      return true
    } catch {
      // We're not using the error details here, but we could log it if needed
      throw new Error('Failed to verify signature')
    }
  },
  signOut: async () => {
    await signOutAction()
  },
})
