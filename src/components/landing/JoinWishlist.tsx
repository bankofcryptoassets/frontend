import { Button, Input } from '@heroui/react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from '@/utils/axios'
import { trackEvent } from '@/utils/trackEvent'

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

export const JoinWishlist = ({ isInHero = false }: { isInHero?: boolean }) => {
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
    <div className="flex w-full max-w-[720px] items-center gap-2 max-lg:flex-col">
      <Input
        placeholder="Early access = earn bonus sats"
        className="h-13 w-full rounded-xl max-sm:h-full"
        classNames={{
          mainWrapper: 'w-full',
          inputWrapper:
            'h-[60px] rounded-xl w-full pl-5 pr-2 bg-[linear-gradient(86.84deg,_rgba(247,_147,_26,_0.01)_17.87%,_rgba(255,_255,_255,_0.02)_52.56%,_rgba(255,_255,_255,_0.04)_77.29%)]! max-sm:h-full max-sm:p-3 border border-default-100 shadow-[0px_0px_4px_0px] shadow-default-800/10 bg-transparent',
          innerWrapper: 'w-full max-sm:flex-col',
        }}
        size="lg"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <Button
          className="shadow-default-800/10 bg-foreground/10 size-12 rounded-xl text-sm font-bold"
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
            width={24}
            height={24}
            className="size-6 min-w-6"
          />
        </Button>

        <Button
          className="h-12 rounded-xl text-sm font-bold"
          color="primary"
          variant="shadow"
          isLoading={isLoading}
          onPress={handleJoinWaitlist}
        >
          {isSuccess ? 'Joined!' : 'Join Waitlist'}
        </Button>
      </div>
    </div>
  )
}
