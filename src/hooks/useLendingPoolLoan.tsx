import { CONTRACT_ADDRESSES } from '@/utils/constants'
import { toast } from 'sonner'
import { parseAbi, parseUnits } from 'viem'
import { useWriteContract } from 'wagmi'

// Lending pool address - this should be defined in constants in a real app

/**
 * Hook for interacting with the lending pool loan function
 *
 * This hook provides functionality to call the loan method on the lending pool contract.
 * It handles the conversion of amounts to the correct units and manages the contract interaction.
 *
 * @returns Functions and state for calling the loan function
 */
export const useLendingPoolLoan = () => {
  const loanQuery = useWriteContract({
    mutation: {
      onError: () => {
        toast.error('Failed to apply loan')
      },
      onSuccess: () => {
        toast.success('Successfully applied loan')
      },
    },
  })

  /**
   * Function to call the loan method on the lending pool contract
   *
   * @param totalAmount - Total loan amount including borrower deposit (in USDC)
   * @param durationMonths - Loan duration in months
   * @param annualInterestRate - Annual interest rate (in percentage points, e.g., 5 for 5%)
   * @param lenderAddresses - Array of lender addresses who are contributing to this loan
   * @param lenderAmounts - Array of amounts corresponding to each lender's contribution (in USDC)
   *
   * @example
   * // Take a loan of 1000 USDC for 12 months at 5% interest
   * takeLoan(
   *   '1000',  // 1000 USDC total loan amount
   *   12,      // 12 months duration
   *   5,       // 5% annual interest rate
   *   ['0x123...', '0x456...'],  // Lender addresses
   *   ['500', '500']             // Each lender contributes 500 USDC
   * )
   */
  const takeLoan = (
    totalAmount: bigint,
    durationMonths: number,
    annualInterestRate: number,
    lenderAddresses: `0x${string}`[],
    lenderAmounts: (number | string)[]
  ) => {
    if (lenderAddresses.length !== lenderAmounts.length) {
      throw new Error(
        'Lender addresses and amounts arrays must have the same length'
      )
    }

    const parsedLenderAmounts = lenderAmounts.map((amount) => {
      // Convert to string without scientific notation
      const amountStr =
        typeof amount === 'string'
          ? amount
          : amount.toFixed(6).replace(/\.?0+$/, '') // Remove trailing zeros

      return parseUnits(amountStr, 6)
    })

    return loanQuery.writeContractAsync({
      abi: parseAbi([
        'function loan(uint256 totalAmount, uint256 durationMonths, uint256 annualInterestRate, address[] calldata lenderAddresses, uint256[] calldata lenderAmounts) returns (uint256)',
      ]),
      address: CONTRACT_ADDRESSES.LENDING_POOL,
      functionName: 'loan',
      args: [
        totalAmount,
        BigInt(durationMonths),
        BigInt(annualInterestRate),
        lenderAddresses,
        parsedLenderAmounts,
      ],
    })
  }

  return { loanQuery, takeLoan }
}
