'use client'
import { title } from '@/components/primitives'
import { Button } from '@heroui/react'
import Script from 'next/script'
import { useState } from 'react'
import { FaTelegramPlane } from 'react-icons/fa'

export default function ConnectTelegram() {
  const [loading, setLoading] = useState(false)
  const handleTelegramConnect = () => {
    if (typeof window.Telegram === 'undefined') {
      console.log('Telegram is not defined')
      return
    }

    setLoading(true)

    window.Telegram.Login.auth(
      {
        bot_id: '7818630903', // required
        request_access: 'true',
        lang: 'en-us',
      },
      (authData: any) => {
        console.log('authData', authData)
      }
    )

    // window.open(
    //   `https://oauth.telegram.org/auth?bot_id=7818630903&origin=${window.location.origin}&request_access=write&return_to=${window.location.origin}/connect-telegram`,
    //   'telegram-oauth',
    //   `width=500,height=500,left=${window.screen.availWidth / 2 - 250},top=${window.screen.availHeight / 2 - 250}`
    // )
  }

  return (
    <div
      className="container flex aspect-square h-full max-w-md flex-col items-center justify-center gap-8 text-center"
      id="connect-telegram"
    >
      <Script src="https://telegram.org/js/telegram-widget.js?21" />

      <div className="select-none">
        <span className={title({ className: '!text-2xl text-primary' })}>
          Bit
        </span>
        <span
          className={title({
            className: '!text-2xl text-secondary dark:text-foreground',
          })}
        >
          mor
        </span>
      </div>

      <p>
        Click <strong>Connect Telegram</strong> to continue.
      </p>

      <Button
        className="px-10 font-bold text-white"
        onPress={handleTelegramConnect}
        color="secondary"
        isLoading={loading}
      >
        <FaTelegramPlane className="h-4 w-4" />
        {loading ? 'Connecting...' : 'Connect Telegram'}
      </Button>

      <p>
        Please do not close this window until you&apos;ve completed authorizing
        with Telegram.
      </p>
    </div>
  )
}
