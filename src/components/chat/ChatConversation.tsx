import { Group, Dm } from '@xmtp/browser-sdk'
import { ContentTypes } from '@/Providers/XMTPContext'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Input } from '@heroui/react'
import { useConversation } from '@/hooks/useConversation'
import { ConversationProvider } from '@/Providers/ConversationContext'
import { Messages } from './Messages/Messages'

type ChatConversationProps = {
  conversation: Group<ContentTypes> | Dm<ContentTypes>
  isOpen: boolean
}

export const ChatConversation = ({
  conversation,
  // isOpen,
}: ChatConversationProps) => {
  const {
    messages,
    getMessages,
    send,
    sending,
    loading,
    syncing,
    streamMessages,
  } = useConversation(conversation)
  const [newMessage, setNewMessage] = useState('')
  const stopStreamRef = useRef<(() => void) | null>(null)

  const startStream = useCallback(async () => {
    stopStreamRef.current = await streamMessages()
  }, [streamMessages])

  const stopStream = useCallback(() => {
    stopStreamRef.current?.()
    stopStreamRef.current = null
  }, [])

  useEffect(() => {
    const loadMessages = async () => {
      stopStream()
      await getMessages(undefined, true)
      await startStream()
    }
    void loadMessages()
    return () => {
      stopStream()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation.id])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return
    await send(newMessage)
    setNewMessage('')
  }

  const isLoading = loading || syncing || sending

  return (
    <>
      <div className="h-full flex-1">
        <ConversationProvider conversation={conversation}>
          <Messages messages={messages} isLoading={loading || syncing} />
        </ConversationProvider>
      </div>

      <div className="border-t border-default-200 p-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            isDisabled={isLoading}
            classNames={{
              inputWrapper: 'bg-content1',
            }}
            variant="bordered"
          />
          <Button
            color="primary"
            variant="shadow"
            onClick={handleSendMessage}
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            Send
          </Button>
        </div>
      </div>
    </>
  )
}
