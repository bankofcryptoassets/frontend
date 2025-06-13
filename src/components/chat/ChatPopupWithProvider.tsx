import { XMTPProvider } from '@/Providers/XMTPContext'
import { ChatPopup } from './ChatPopup'

export const ChatPopupWithProvider = () => {
  return (
    <XMTPProvider>
      <ChatPopup />
    </XMTPProvider>
  )
}
