import {
  ContentTypeTransactionReference,
  type TransactionReference,
} from '@xmtp/content-type-transaction-reference'
import type { WalletSendCallsParams } from '@xmtp/content-type-wallet-send-calls'
import { useCallback } from 'react'
import { useChainId, useSendTransaction, useSwitchChain } from 'wagmi'
import { useXMTP } from '@/Providers/XMTPContext'
import { Button } from '@heroui/react'

export type WalletSendCallsContentProps = {
  content: WalletSendCallsParams
  conversationId: string
}

export const WalletSendCallsContent: React.FC<WalletSendCallsContentProps> = ({
  content,
  conversationId,
}) => {
  const { client } = useXMTP()
  const { sendTransactionAsync } = useSendTransaction()
  const { switchChainAsync } = useSwitchChain()
  const wagmiChainId = useChainId()

  const handleSubmit = useCallback(async () => {
    const chainId = parseInt(content.chainId, 16)
    if (chainId !== wagmiChainId) {
      await switchChainAsync({ chainId })
      await new Promise((r) => setTimeout(r, 300)) // Metamask requires some delay
    }
    for (const call of content.calls) {
      const wagmiTxData = {
        ...call,
        value: BigInt(parseInt(call.value || '0x0', 16)),
        chainId,
        gas: call.gas ? BigInt(parseInt(call.gas, 16)) : undefined,
      }
      const txHash = await sendTransactionAsync(wagmiTxData, {
        onError(error) {
          console.error(error)
        },
      })
      const transactionReference: TransactionReference = {
        networkId: content.chainId,
        reference: txHash,
      }
      const conversation =
        await client?.conversations.getConversationById(conversationId)
      if (!conversation) {
        console.error("Couldn't find conversation by Id")
        return
      }
      await conversation.send(
        transactionReference,
        ContentTypeTransactionReference
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, sendTransactionAsync, client, conversationId])

  return (
    <div className="flex flex-col">
      <p className="text-sm">Review the following transactions:</p>
      <ul className="list-inside list-disc">
        {content.calls.map((call) => (
          <li key={call.metadata?.description}>{call.metadata?.description}</li>
        ))}
      </ul>
      <div className="h-md" />
      <Button
        fullWidth
        onClick={(event) => {
          event.stopPropagation()
          void handleSubmit()
        }}
      >
        Submit
      </Button>
    </div>
  )
}
