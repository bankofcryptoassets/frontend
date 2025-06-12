'use client'

import { useState, useEffect, useRef } from 'react'
import { useXmtp } from '@/hooks/useXmtp'
import { useAccount } from 'wagmi'
import { Button, Input } from '@heroui/react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'other'
  timestamp: Date
  status?: 'sending' | 'sent' | 'failed'
}

const SUPPORT_ADDRESS = '0xe4a783ef079427dda18dbb0290502aa0d52a1500'

export function ChatPopup() {
  const { address } = useAccount()
  const { client, isLoading, error, sendMessage, getMessages } = useXmtp({
    address,
  })
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isClient, setIsClient] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (client && isOpen && isClient) {
      loadMessages()
    }
  }, [client, isOpen, isClient])

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const loadMessages = async () => {
    try {
      const xmtpMessages = await getMessages(SUPPORT_ADDRESS)
      const formattedMessages = xmtpMessages.map((msg) => ({
        id: msg.id,
        content: msg.content as string,
        sender:
          (msg as any).senderAddress?.toLowerCase() === address?.toLowerCase()
            ? ('user' as const)
            : ('other' as const),
        timestamp: new Date(Number(msg.sentAtNs)),
        status: 'sent' as const,
      }))
      setMessages(formattedMessages)
    } catch (err) {
      console.error('Error loading messages:', err)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !client) return

    const tempId = Date.now().toString()
    const optimisticMessage: Message = {
      id: tempId,
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
    }

    // Optimistically add message to UI
    setMessages((prev) => [...prev, optimisticMessage])
    setNewMessage('')

    try {
      await sendMessage(SUPPORT_ADDRESS, newMessage)
      // Update message status to sent
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: 'sent' } : msg
        )
      )
    } catch (err) {
      console.error('Error sending message:', err)
      // Update message status to failed
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: 'failed' } : msg
        )
      )
    }
  }

  if (!isClient) {
    return null
  }

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          isIconOnly
          color="danger"
          variant="shadow"
          size="lg"
          onClick={() => setIsOpen(true)}
          title={error}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          isIconOnly
          color="primary"
          variant="shadow"
          size="lg"
          onClick={() => setIsOpen(true)}
          isDisabled={isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </Button>
      ) : (
        <div className="flex h-[500px] w-96 flex-col rounded-lg border border-default-200 bg-content1 text-foreground shadow-lg">
          <div className="flex items-center justify-between border-b border-default-200 p-4">
            <h3 className="font-semibold">Chat Support</h3>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </Button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((message) => {
              const isUser = message.sender === 'user'
              const isSending = message.status === 'sending'
              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-content2 text-foreground'
                    } ${isSending ? 'opacity-60' : ''}`}
                  >
                    <span>{message.content}</span>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
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
                isDisabled={isLoading}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
