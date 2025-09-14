import { cn } from '@heroui/react'

export const Glow = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'bg-primary transition-background h-[260px] w-[143px] blur-[200px] duration-500',
        className
      )}
    ></div>
  )
}
