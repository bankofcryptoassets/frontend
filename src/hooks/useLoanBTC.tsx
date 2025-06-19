import { CONTRACT_ADDRESSES } from '@/utils/constants'
import { toast } from 'sonner'
import { parseAbi, parseUnits } from 'viem'
import { useWriteContract } from 'wagmi'

export const useLoanBTC = () => {
  const loanBTCQuery = useWriteContract({
    mutation: {
      onError: () => {
        toast.error('Failed to loan BTC')
      },
      // onSuccess: () => {
      //   toast.success('Successfully loaned BTC')
      // },
    },
  })

  const loanBTC = async (
    totalAmount: string,
    durationMonths: string,
    annualInterestRate: string,
    downPaymentPercentage: string,
    options?: any
  ) =>
    loanBTCQuery.writeContractAsync(
      {
        abi: parseAbi([
          'function loan(uint256 totalAmount, uint256 durationMonths, uint256 annualInterestRate, uint256 downPaymentPercentage)',
        ]),
        address: CONTRACT_ADDRESSES.MAIN,
        functionName: 'loan',
        args: [
          parseUnits(totalAmount, 8),
          parseUnits(durationMonths, 0),
          parseUnits(annualInterestRate, 0),
          parseUnits(downPaymentPercentage, 0),
        ],
      },
      options
    )

  return { loanBTCQuery, loanBTC }
}
