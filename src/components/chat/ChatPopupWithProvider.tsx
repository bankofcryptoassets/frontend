import { XMTPProvider } from '@/Providers/XMTPContext'
import { ChatPopup } from './ChatPopup'

export const ChatPopupWithProvider = ({
  isOpen,
  setIsOpen,
  loanHash,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  loanHash: string | null
}) => {
  return (
    <XMTPProvider>
      <ChatPopup isOpen={isOpen} setIsOpen={setIsOpen} loanHash={loanHash} />
    </XMTPProvider>
  )
}
