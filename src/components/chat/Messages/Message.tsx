import type { DecodedMessage } from '@xmtp/browser-sdk'
import { MessageContent } from './MessageContent'
import { useXMTP } from '@/Providers/XMTPContext'

export type MessageProps = {
  message: DecodedMessage
  scrollToMessage: (id: string) => void
}

export const Message: React.FC<MessageProps> = ({
  message,
  scrollToMessage,
}) => {
  const { client } = useXMTP()
  const isSender = client?.inboxId === message.senderInboxId
  const align = isSender ? 'right' : 'left'

  return (
    <MessageContent
      message={message}
      align={align}
      senderInboxId={message.senderInboxId}
      scrollToMessage={scrollToMessage}
    />
  )
}
