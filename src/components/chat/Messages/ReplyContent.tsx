import type { DecodedMessage } from '@xmtp/browser-sdk'
import { type Reply } from '@xmtp/content-type-reply'
import { useCallback, useEffect, useState } from 'react'
import type { MessageContentAlign } from './MessageContentWrapper'
import { TextContent } from './TextContent'
import { useConversations } from '@/hooks/useConversations'
import { cn, Tooltip } from '@heroui/react'

export type ReplyContentProps = {
  align: MessageContentAlign
  message: DecodedMessage<Reply>
  scrollToMessage: (id: string) => void
}

export const ReplyContent: React.FC<ReplyContentProps> = ({
  align,
  message,
  scrollToMessage,
}) => {
  const { getMessageById } = useConversations()
  const [originalMessage, setOriginalMessage] = useState<
    DecodedMessage<string> | undefined
  >(undefined)

  useEffect(() => {
    void getMessageById(message.content!.reference).then((originalMessage) => {
      setOriginalMessage(originalMessage as DecodedMessage<string>)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message.content?.reference])

  const handleClick = useCallback(() => {
    if (originalMessage) {
      scrollToMessage(originalMessage.id)
    }
  }, [originalMessage, scrollToMessage])

  if (
    message.content?.contentType.typeId === 'text' &&
    typeof message.content.content === 'string'
  ) {
    return (
      <div className={cn(align === 'left' ? 'flex-start' : 'flex-end')}>
        <div className={cn(align === 'left' ? 'flex-start' : 'flex-end')}>
          <p className="text-xs">Replied to</p>
          <Tooltip content="Click to scroll to the original message">
            <div className="p-xs rounded-md border" onClick={handleClick}>
              <p className="font-inherit whitespace-pre-wrap break-words">
                {originalMessage?.content}
              </p>
            </div>
          </Tooltip>
        </div>
        <TextContent text={message.content.content} align={align} />
      </div>
    )
  }

  return <p>{message.fallback}</p>
}
