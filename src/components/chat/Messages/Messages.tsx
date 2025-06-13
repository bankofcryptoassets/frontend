import type { DecodedMessage } from '@xmtp/browser-sdk'
import { MessageList } from './MessageList'
import { Spinner } from '@heroui/react'

export type ConversationProps = {
  messages: DecodedMessage[]
  isLoading: boolean
}

export const Messages: React.FC<ConversationProps> = ({
  messages,
  isLoading,
}) => {
  return messages.length === 0 ? (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-4">
      <p>No messages</p>
      {isLoading && <Spinner size="lg" />}
    </div>
  ) : (
    <div className="h-full">
      <MessageList messages={messages} />
    </div>
  )
}
