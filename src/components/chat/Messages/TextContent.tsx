import { cn } from '@heroui/react'

export type TextContentProps = {
  text: string
  align: 'left' | 'right'
}

export const TextContent: React.FC<TextContentProps> = ({ text, align }) => {
  return (
    <div
      onClick={(event) => {
        event.stopPropagation()
      }}
      className={cn(
        'p-xs max-w-[80%] rounded-lg p-3',
        align === 'left'
          ? 'bg-content2 text-foreground'
          : 'bg-primary text-primary-foreground'
      )}
    >
      <p className="whitespace-pre-wrap break-words">{text}</p>
    </div>
  )
}
