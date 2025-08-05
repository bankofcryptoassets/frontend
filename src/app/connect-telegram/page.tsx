'use client'
import { ConnectTelegramButton } from '@/components/ConnectTelegramButton'
import { title } from '@/components/primitives'

export default function ConnectTelegram() {
  return (
    <div
      className="container flex aspect-square h-full max-w-md flex-col items-center justify-center gap-8 text-center"
      id="connect-telegram"
    >
      <div className="select-none">
        <span className={title({ className: 'text-primary text-2xl!' })}>
          Bit
        </span>
        <span
          className={title({
            className: 'text-secondary dark:text-foreground text-2xl!',
          })}
        >
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
