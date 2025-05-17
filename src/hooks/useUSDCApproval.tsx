import { CONTRACT_ADDRESSES } from '@/utils/constants'
import { toast } from 'sonner'
import { parseAbi, parseUnits } from 'viem'
import { useWriteContract } from 'wagmi'

export const useUSDCApproval = () => {
  const approvalQuery = useWriteContract({
    mutation: {
      onError: (error) => {
        console.log('error', error)
        toast.error('Failed to approve USDC')
      },
      onSuccess: (data) => {
        console.log('success', data)
        toast.success('Successfully approved USDC')
      },
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
        args: [CONTRACT_ADDRESSES.ZEISTAL, parseUnits(usdcAmount, 6)],
      },
      options
    )

  return { approvalQuery, approveUSDC }
}
