'use client'

import { useState, useEffect, useRef } from 'react'
import { Button, Input } from '@heroui/react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'other'
  timestamp: Date
  status?: 'sending' | 'sent' | 'failed'
}

const isLoading = false
export function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isClient, setIsClient] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isOpen && isClient) {
      loadMessages()
    }
  }, [isOpen, isClient])

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const loadMessages = async () => {
    try {
      setMessages([
        {
          id: '1',
          content: 'Hello, how can I help you today?',
          sender: 'other',
          timestamp: new Date(),
        },
      ])
    } catch (err) {
      console.error('Error loading messages:', err)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const tempId = Date.now().toString()
    const optimisticMessage: Message = {
      id: tempId,
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
    }

    // Optimistically add message to UI
    setMessages((prev) => [...prev, optimisticMessage])
    setNewMessage('')
  }

  if (!isClient) {
    return null
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
