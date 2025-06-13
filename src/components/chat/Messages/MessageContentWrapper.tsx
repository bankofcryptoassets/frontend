import { cn } from '@heroui/react'

export type MessageContentAlign = 'left' | 'right'

export type MessageContentWrapperProps = React.PropsWithChildren<{
  align: MessageContentAlign
  senderInboxId: string
  sentAtNs: bigint
  stopClickPropagation?: boolean
}>

export const MessageContentWrapper: React.FC<MessageContentWrapperProps> = ({
  align,
  children,
  stopClickPropagation = true,
}) => {
  return (
    <div
      className={cn(align === 'left' ? 'justify-start' : 'justify-end', 'flex')}
      onClick={(event) => {
        if (stopClickPropagation) {
          event.stopPropagation()
        }
      }}
    >
      {children}
    </div>
  )
}
