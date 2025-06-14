import { XMTPProvider } from '@/Providers/XMTPContext'
import { ChatPopup } from './ChatPopup'

export const ChatPopupWithProvider = ({
  isOpen,
  setIsOpen,
  loanId,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  loanId: string | null
}) => {
  return (
    <XMTPProvider>
      <ChatPopup isOpen={isOpen} setIsOpen={setIsOpen} loanId={loanId} />
    </XMTPProvider>
  )
}
