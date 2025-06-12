'use client'

import { useState, useEffect } from 'react'
import { Client, DecodedMessage, Dm } from '@xmtp/browser-sdk'
import { ethers } from 'ethers'

interface UseXmtpProps {
  address?: string
}

interface UseXmtpReturn {
  client: Client | null
  isLoading: boolean
  error: string | null
  sendMessage: (to: string, content: string) => Promise<void>
  getMessages: (from: string) => Promise<DecodedMessage[]>
}

export function useXmtp({ address }: UseXmtpProps): UseXmtpReturn {
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const initXmtp = async () => {
      if (!address) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Check if the client is already initialized
        if (client) {
          setIsLoading(false)
          return
        }

        // Check if the browser has a wallet provider
        if (!window.ethereum) {
          throw new Error('No Ethereum provider found')
        }

        // Create a provider and signer
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        // Create a proper signer object that implements the XMTP Signer interface
        const xmtpSigner = {
          type: 'EOA' as const,
          getIdentifier: async () => {
            const address = await signer.getAddress()
            return {
              type: 'ethereum',
              value: address,
              identifier: address,
              identifierKind: 'Ethereum',
            } as any
          },
          signMessage: async (message: string) => {
            const signature = await signer.signMessage(message)
            return ethers.utils.arrayify(signature)
          },
        }

        // Initialize the XMTP client with the signer
        const xmtp = await Client.create(xmtpSigner, {
          env: 'dev',
        })

        if (mounted) {
          setClient(xmtp)
          setIsLoading(false)
        }
      } catch (err) {
        console.error('Error initializing XMTP:', err)
        if (mounted) {
          setError(
            err instanceof Error ? err.message : 'Failed to initialize XMTP'
          )
          setIsLoading(false)
        }
      }
    }

    initXmtp()

    return () => {
      mounted = false
    }
  }, [address, client])

  const sendMessage = async (to: string, content: string) => {
    if (!client) {
      throw new Error('XMTP client not initialized')
    }

    try {
      const conversations = await client.conversations.list()
      const existingConversation = await Promise.all(
        conversations.map(async (c) => {
          if (c instanceof Dm) {
            const peerId = await c.peerInboxId()
            return peerId === to ? c : null
          }
          return null
        })
      ).then((results) => results.find((c) => c !== null))

      const conversationToUse =
        existingConversation || (await client.conversations.newDm(to))
      await conversationToUse.send(content)
    } catch (err) {
      console.error('Error sending message:', err)
      throw err
    }
  }

  const getMessages = async (from: string) => {
    if (!client) {
      throw new Error('XMTP client not initialized')
    }

    try {
      const conversations = await client.conversations.list()
      const existingConversation = await Promise.all(
        conversations.map(async (c) => {
          if (c instanceof Dm) {
            const peerId = await c.peerInboxId()
            return peerId === from ? c : null
          }
          return null
        })
      ).then((results) => results.find((c) => c !== null))

      const conversationToUse =
        existingConversation || (await client.conversations.newDm(from))
      return await conversationToUse.messages()
    } catch (err) {
      console.error('Error getting messages:', err)
      throw err
    }
  }

  return {
    client,
    isLoading,
    error,
    sendMessage,
    getMessages,
  }
}
