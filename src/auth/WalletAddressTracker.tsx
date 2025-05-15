'use client'
import { useWalletAddress } from '@/auth/useWalletAddress'

/**
 * Component that tracks the wallet address and makes it available for authentication
 * This component doesn't render anything, it just uses the useWalletAddress hook
 */
export const WalletAddressTracker = () => {
  // This will store the address whenever it changes
  useWalletAddress()

  // This component doesn't render anything
  return null
}
