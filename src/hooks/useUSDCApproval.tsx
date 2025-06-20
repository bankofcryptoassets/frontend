import { CONTRACT_ADDRESSES } from '@/utils/constants'
import { toast } from 'sonner'
import { parseAbi, parseUnits } from 'viem'
import { useWriteContract } from 'wagmi'

export const useUSDCApproval = () => {
  const approvalQuery = useWriteContract({
    mutation: {
      onError: () => {
        toast.error('Failed to approve USDC')
      },
      // onSuccess: () => {
      //   toast.success('Successfully approved USDC')
      // },
    },
  })

  const approveUSDC = async (usdcAmount: string, options?: any) =>
    approvalQuery.writeContractAsync(
      {
        abi: parseAbi([
          'function approve(address spender, uint256 amount) returns (bool)',
        ]),
        address: CONTRACT_ADDRESSES.USDC,
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.MAIN, parseUnits(usdcAmount, 6)],
      },
      options
    )

  return { approvalQuery, approveUSDC }
}
