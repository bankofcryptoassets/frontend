'use client'
import { Button, cn, Input } from '@heroui/react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from '@/utils/axios'
import { trackEvent } from '@/utils/trackEvent'
import { IoIosArrowRoundForward } from 'react-icons/io'

interface WaitlistResponse {
  success: boolean
  message?: string
}

const joinWaitlist = async (email: string): Promise<WaitlistResponse> => {
  const response = await axios.post<WaitlistResponse>('/auth/waitlist', {
    email,
  })
  return response.data
}

export const JoinWaitlist = ({
  isInHero = false,
  isLenderThemed = false,
  inSmallContainer = false,
}: {
  isInHero?: boolean
  isLenderThemed?: boolean
  inSmallContainer?: boolean
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!isInHero) return

    const googleWaitlistSuccess = searchParams.get('waitlist_success')

    if (googleWaitlistSuccess === 'true') {
      toast.success(
        'You are now part of the Alpha Community who will be distributed 1 BTC. Go tell your friends.',
        { duration: 10000 }
      )
      router.replace('/')
    }
    if (googleWaitlistSuccess === 'false') {
      toast.error('Failed to join waitlist!!', {
        duration: 10000,
        description: 'Please try again. or contact us if this error persists.',
      })
      router.replace('/')
    }
  }, [searchParams, router, isInHero])

  const [email, setEmail] = useState('')

  const joinWaitlistMutation = useMutation({
    mutationFn: joinWaitlist,
    onSuccess: () => {
      setEmail('')
      toast.success(
        'You are now part of the Alpha Community who will be distributed 1 BTC. Go tell your friends.',
        { duration: 10000 }
      )
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to join waitlist!!',
        {
          duration: 10000,
          description:
            'Please try again. or contact us if this error persists.',
        }
      )
    },
  })

  const handleJoinWaitlist = () => {
    if (!email || !email.includes('@')) {
      joinWaitlistMutation.reset()
      toast.error('Please enter a valid email address')
      return
    }

    trackEvent('Join Waitlist via Email', { email })
    joinWaitlistMutation.mutate(email)
  }

  const isLoading = joinWaitlistMutation.isPending
  const isSuccess = joinWaitlistMutation.isSuccess

  return (
    <div className="flex w-full max-w-[520px] items-center gap-2">
      <Input
        placeholder="Enter your email for launch alerts + bonus sats"
        className={cn(
          'w-full rounded-xl max-sm:h-full',
          inSmallContainer && 'h-full'
        )}
        classNames={{
          mainWrapper: 'w-full',
          inputWrapper: cn(
            'rounded-xl w-full pl-5 pr-2 bg-background/75! max-sm:p-3 border border-default-100 shadow-[0px_0px_4px_0px] shadow-default-800/10 bg-foreground/3 max-sm:h-full max-sm:pb-0',
            isInHero && 'bg-foreground/5',
            inSmallContainer && 'p-3 h-full pb-0'
          ),
          input: 'text-sm',
          innerWrapper: cn(
            'w-full max-sm:flex-col',
            inSmallContainer && 'flex-col'
          ),
        }}
        size="lg"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        endContent={
          <Button
            className="text-primary gap-1 bg-transparent text-sm font-bold"
            color={isLenderThemed ? 'secondary' : 'primary'}
            isLoading={isLoading}
            onPress={handleJoinWaitlist}
            endContent={
              <IoIosArrowRoundForward className="size-5 flex-shrink-0 stroke-3" />
            }
          >
            {isSuccess ? 'Joined!' : 'Join Waitlist'}
          </Button>
        }
      />

      <div className="flex items-center gap-2">
        <Button
          className="bg-foreground/10 size-10 rounded-xl"
          variant="shadow"
          isIconOnly
          onPress={() => {
            trackEvent('Join Waitlist via Google')
            router.push('https://backend.xefi.ai/api/auth/google')
          }}
        >
          <Image
            src="/icons/google.png"
            alt="google"
            width={20}
            height={20}
            className="size-4 min-w-4"
          />
        </Button>
      </div>
    </div>
  )
}
