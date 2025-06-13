import { useConversations } from '@/hooks/useConversations'
import {
  CHAT_AGENT_ADDRESS,
  CHAT_AGENT_INBOX_ID,
  ContentTypes,
  useXMTP,
} from '@/Providers/XMTPContext'
import { Dm, Group, Identifier } from '@xmtp/browser-sdk'
import { useEffect, useState } from 'react'
import { ChatConversation } from './ChatConversation'

type LoadChatConversationProps = {
  isOpen: boolean
}

export const LoadChatConversation = ({ isOpen }: LoadChatConversationProps) => {
  const { client } = useXMTP()
  const { getConversationById } = useConversations()
  const [conversation, setConversation] = useState<
    Group<ContentTypes> | Dm<ContentTypes> | undefined
  >(undefined)
  useEffect(() => {
    if (!client) return

    const initializeConversation = async () => {
      const identifier: Identifier = {
        identifier: CHAT_AGENT_ADDRESS.toLowerCase(),
        identifierKind: 'Ethereum',
      }
      // check if user can message
      const canMessageResult = await client.canMessage([identifier])
      if (!canMessageResult.get(CHAT_AGENT_ADDRESS)) return

      // get or create a new dm
      let dm = await client.conversations.getDmByInboxId(CHAT_AGENT_INBOX_ID)
      if (!dm?.id) {
        // no dm, create it
        const newDM = await client.conversations.newDmWithIdentifier(identifier)
        dm = newDM
      }
      if (!dm?.id) return

      // get conversation
      const conversation = await getConversationById(dm.id)
      if (!conversation) return
      setConversation(conversation)
    }

    initializeConversation()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client])

  if (!conversation) return null

  return <ChatConversation conversation={conversation} isOpen={isOpen} />
}
