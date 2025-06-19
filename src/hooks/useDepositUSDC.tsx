import { CONTRACT_ADDRESSES } from '@/utils/constants'
import { toast } from 'sonner'
import { parseAbi, parseUnits } from 'viem'
import { useWriteContract } from 'wagmi'

export const useDepositUSDC = () => {
  const depositQuery = useWriteContract({
    mutation: {
      onError: () => {
        toast.error('Failed to approve USDC')
      },
      // onSuccess: () => {
      //   toast.success('Successfully approved USDC')
      // },
    },
  })

  const depositUSDC = async (
    usdcAmount: string,
    isReinvest: boolean,
    options?: any
  ) =>
    depositQuery.writeContractAsync(
      {
        abi: parseAbi([
          'function depositToPool(uint256 amount, bool reinvest)',
        ]),
        address: CONTRACT_ADDRESSES.USDC,
        functionName: 'depositToPool',
        args: [parseUnits(usdcAmount, 6), isReinvest],
      },
      options
    )

  return { depositQuery, depositUSDC }
}
