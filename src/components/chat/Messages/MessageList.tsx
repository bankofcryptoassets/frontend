import type { DecodedMessage } from '@xmtp/browser-sdk'
import { useCallback, useMemo, useRef, type ComponentProps } from 'react'
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso'
import { Message } from './Message'

const List = (props: ComponentProps<'div'>) => {
  return <div className="flex flex-col gap-4 !p-4" {...props} />
}

export type MessageListProps = {
  messages: DecodedMessage[]
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const virtuoso = useRef<VirtuosoHandle>(null)
  const messageMap = useMemo(() => {
    const map = new Map<string, number>()
    messages.forEach((message, index) => {
      map.set(message.id, index)
    })
    return map
  }, [messages])

  const scrollToMessage = useCallback(
    (id: string) => {
      const index = messageMap.get(id)
      if (index !== undefined) {
        virtuoso.current?.scrollToIndex(index)
      }
    },
    [messageMap]
  )

  return (
    <Virtuoso
      ref={virtuoso}
      alignToBottom
      followOutput="auto"
      style={{ flexGrow: 1, height: '100%' }}
      components={{ List }}
      initialTopMostItemIndex={messages.length - 1}
      data={messages}
      overscan={300}
      itemContent={(_, message) => (
        <Message
          key={message.id}
          message={message}
          scrollToMessage={scrollToMessage}
        />
      )}
    />
  )
}
