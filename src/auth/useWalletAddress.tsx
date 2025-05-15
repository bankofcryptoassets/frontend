'use client'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { setWalletAddress } from './authStore'

/**
 * Hook to access and store the wallet address
 * This ensures the address is available for the getNonce function
 */
export const useWalletAddress = () => {
  const { address } = useAccount()

  // Store the address whenever it changes
  useEffect(() => {
    if (address) {
      setWalletAddress(address)
    }
  }, [address])

  return { address }
}
