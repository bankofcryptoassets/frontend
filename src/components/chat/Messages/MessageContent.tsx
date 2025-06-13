import type { DecodedMessage } from '@xmtp/browser-sdk'
import { ContentTypeGroupUpdated } from '@xmtp/content-type-group-updated'
import { ContentTypeReply, type Reply } from '@xmtp/content-type-reply'
import {
  ContentTypeTransactionReference,
  type TransactionReference,
} from '@xmtp/content-type-transaction-reference'
import {
  ContentTypeWalletSendCalls,
  type WalletSendCallsParams,
} from '@xmtp/content-type-wallet-send-calls'
import {
  MessageContentWrapper,
  type MessageContentAlign,
} from './MessageContentWrapper'
import { ReplyContent } from './ReplyContent'
import { TextContent } from './TextContent'
import { TransactionReferenceContent } from './TransactionReferenceContent'
import { WalletSendCallsContent } from './WalletSendCallsContent'

export type MessageContentProps = {
  align: MessageContentAlign
  senderInboxId: string
  message: DecodedMessage
  scrollToMessage: (id: string) => void
}

export const MessageContent: React.FC<MessageContentProps> = ({
  message,
  align,
  senderInboxId,
  scrollToMessage,
}) => {
  if (message.contentType.sameAs(ContentTypeTransactionReference)) {
    return (
      <MessageContentWrapper
        align={align}
        senderInboxId={senderInboxId}
        sentAtNs={message.sentAtNs}
      >
        <TransactionReferenceContent
          content={message.content as TransactionReference}
        />
      </MessageContentWrapper>
    )
  }

  if (message.contentType.sameAs(ContentTypeWalletSendCalls)) {
    return (
      <MessageContentWrapper
        align={align}
        senderInboxId={senderInboxId}
        sentAtNs={message.sentAtNs}
      >
        <WalletSendCallsContent
          content={message.content as WalletSendCallsParams}
          conversationId={message.conversationId}
        />
      </MessageContentWrapper>
    )
  }

  if (message.contentType.sameAs(ContentTypeGroupUpdated)) {
    return <div className="h-px"></div>
  }

  if (message.contentType.sameAs(ContentTypeReply)) {
    return (
      <MessageContentWrapper
        align={align}
        senderInboxId={senderInboxId}
        sentAtNs={message.sentAtNs}
      >
        <ReplyContent
          align={align}
          message={message as DecodedMessage<Reply>}
          scrollToMessage={scrollToMessage}
        />
      </MessageContentWrapper>
    )
  }

  if (typeof message.content === 'string') {
    return (
      <MessageContentWrapper
        align={align}
        senderInboxId={senderInboxId}
        sentAtNs={message.sentAtNs}
      >
        <TextContent text={message.content} align={align} />
      </MessageContentWrapper>
    )
  }

  if (typeof message.fallback === 'string') {
    return (
      <MessageContentWrapper
        align={align}
        senderInboxId={senderInboxId}
        sentAtNs={message.sentAtNs}
      >
        <TextContent text={message.fallback} align={align} />
      </MessageContentWrapper>
    )
  }

  return (
    <MessageContentWrapper
      align={align}
      senderInboxId={senderInboxId}
      sentAtNs={message.sentAtNs}
    >
      <pre className="w-full whitespace-pre-wrap break-all">
        {JSON.stringify(message.content ?? message.fallback, null, 2)}
      </pre>
    </MessageContentWrapper>
  )
}
