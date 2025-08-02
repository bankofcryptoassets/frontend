'use client'
import { useAuth } from '@/auth/useAuth'
import axios from '@/utils/axios'
import { Alert, Button, cn, Tooltip } from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Script from 'next/script'
import { useState } from 'react'
import { FaTelegramPlane } from 'react-icons/fa'
import { toast } from 'sonner'

type TelegramAuthData = {
  id: number
  first_name: string
  username: string
  auth_date: number
  hash: string
}

export const ConnectTelegramButton = ({
  onlyButton = false,
  className,
}: {
  onlyButton?: boolean
  className?: string
}) => {
  const [connectButtonLoading, setConnectButtonLoading] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const queryClient = useQueryClient()
  const { isAuth } = useAuth()

  const { data: telegramData, isLoading: telegramLoading } = useQuery({
    queryKey: ['user', 'telegram-id', isAuth],
    queryFn: async ({ signal }) => {
      const response = await axios.get<{ telegramId?: string | null }>(
        '/user/telegram-id',
        { signal }
      )
      return response.data
    },
    enabled: !!isAuth,
  })

  const { mutateAsync: connectTelegram, isPending: connectTelegramLoading } =
    useMutation({
      mutationFn: async (telegramId: number) => {
        const response = await axios.post('/auth/telegram', { telegramId })
        return response.data
      },
      onSuccess: (data: { success: string }) => {
        if (data?.success !== 'success')
          throw new Error('Failed to connect Telegram')

        setSuccess(true)
        if (onlyButton) toast.success('Telegram connected successfully.')
        queryClient.invalidateQueries({ queryKey: ['user', 'telegram-id'] })

        setTimeout(() => {
          setConnectButtonLoading(false)
          if (!onlyButton) window.close()
        }, 3000)
      },
    })

  const onError = () => {
    setError(true)
    setConnectButtonLoading(false)

    if (onlyButton)
      toast.error('Failed to connect Telegram, please try again later.')
  }

  const handleTelegramConnect = () => {
    if (typeof window.Telegram === 'undefined') {
      console.log('Telegram is not defined')
      return
    }

    setError(false)
    setSuccess(false)
    setConnectButtonLoading(true)

    window.Telegram.Login.auth(
      { bot_id: '7818630903', request_access: 'write' },
      (authData?: TelegramAuthData) => {
        if (authData?.id) connectTelegram(authData.id).catch(onError)
        else onError()
      }
    )
  }

  const loading =
    connectButtonLoading || telegramLoading || connectTelegramLoading

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-widget.js?22"
        onLoad={() => {
          if (typeof window.Telegram !== 'undefined')
            window.Telegram.Login.init()
        }}
      />

      <Tooltip
        content={
          !isAuth
            ? 'Please connect your wallet to continue'
            : telegramData?.telegramId
              ? 'Telegram already connected'
              : undefined
        }
        color={!isAuth ? 'danger' : 'default'}
        isDisabled={!telegramData?.telegramId && !!isAuth}
      >
        <Button
          className={cn(
            'px-10 font-bold text-white data-[disabled=true]:pointer-events-auto data-[disabled=true]:cursor-not-allowed',
            className
          )}
          onPress={handleTelegramConnect}
          color="secondary"
          isLoading={loading}
          isDisabled={!isAuth || !!telegramData?.telegramId}
        >
          <FaTelegramPlane className="h-4 w-4" />
          {loading ? 'Connecting...' : 'Connect Telegram'}
        </Button>
      </Tooltip>

      {error && !onlyButton && (
        <div>
          <Alert
            color="danger"
            title={
              <p>
                Failed to connect Telegram,
                <br />
                Please try again later.
              </p>
            }
          />
        </div>
      )}

      {success && !onlyButton && (
        <div>
          <Alert color="success" title="Telegram connected successfully." />
        </div>
      )}
    </>
  )
}
