import { CONTRACT_ADDRESSES } from '@/utils/constants'
import { parseAbi, parseUnits } from 'viem'
import { useWriteContract } from 'wagmi'

export const useContractApproval = () => {
  const approvalQuery = useWriteContract()

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
