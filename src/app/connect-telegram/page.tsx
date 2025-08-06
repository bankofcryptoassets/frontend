'use client'
import { ConnectTelegramButton } from '@/components/ConnectTelegramButton'

export default function ConnectTelegram() {
  return (
    <div
      className="container flex aspect-square h-full max-w-md flex-col items-center justify-center gap-8 text-center"
      id="connect-telegram"
    >
      <div className="select-none">
        <span className="text-primary inline text-2xl leading-9 font-bold tracking-tight">
          Bit
        </span>
        <span className="text-secondary dark:text-foreground inline text-2xl leading-9 font-bold tracking-tight">
          mor
        </span>
      </div>

      <p>
        Click <strong>Connect Telegram</strong> to continue.
      </p>

      <ConnectTelegramButton />

      <p>
        Please do not close this window until you&apos;ve completed authorizing
        with Telegram.
      </p>
    </div>
  )
}
