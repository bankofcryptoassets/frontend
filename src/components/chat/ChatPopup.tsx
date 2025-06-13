'use client'
import { useState } from 'react'
import { Button } from '@heroui/react'
import { CHAT_AGENT_ENV, useXMTP } from '@/Providers/XMTPContext'
import { useAccount, useConnect, useSignMessage } from 'wagmi'
import { createEOASigner } from '@/utils/createSigner'
import { LoadChatConversation } from './LoadChatConversation'

export const ChatPopup = () => {
  const { initializing, client, initialize } = useXMTP()
  const [isOpen, setIsOpen] = useState(false)
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { status } = useConnect()

  const initializeXMTP = async () => {
    if (!address) return

    // initialize xmtp client
    const client = await initialize({
      env: CHAT_AGENT_ENV,
      loggingLevel: 'error',
      signer: createEOASigner(address, (message: string) =>
        signMessageAsync({ message })
      ),
    })
    if (!client) return
  }

  const isLoading = status === 'pending' || initializing

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

          {!client ? (
            <div className="m-auto h-auto w-full p-4 text-center">
              <Button
                color="primary"
                variant="shadow"
                className="mb-16 py-8 font-medium"
                size="lg"
                isLoading={isLoading}
                onPress={initializeXMTP}
              >
                Connect to our decentralized <br /> chat agent to continue
              </Button>
            </div>
          ) : (
            <LoadChatConversation isOpen={isOpen} />
          )}
        </div>
      )}
    </div>
  )
}
