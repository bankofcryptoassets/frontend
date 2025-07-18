import { Button, Divider, Input } from '@heroui/react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from '@/utils/axios'

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

    joinWaitlistMutation.mutate(email)
  }

  const isLoading = joinWaitlistMutation.isPending
  const isSuccess = joinWaitlistMutation.isSuccess

  return (
    <div className="w-full max-w-[720px]">
      <Input
        placeholder="Early access = earn bonus sats"
        className="h-[60px] w-full rounded-xl"
        classNames={{
          mainWrapper: 'w-full',
          inputWrapper: 'h-[60px] rounded-xl w-full pl-5 pr-2 !bg-[#F5F5F5] ',
          innerWrapper: 'w-full',
          input: '!text-black placeholder:text-[#666666]',
        }}
        size="lg"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        endContent={
          <div className="flex items-center gap-4">
            <Button
              className="size-11 rounded-lg bg-white text-sm font-bold shadow-[1px_2px_8px_0px_#0000000A] hover:bg-white/90"
              size="sm"
              isIconOnly
              onPress={() => {
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

            <Divider orientation="vertical" className="h-8 w-px bg-default-d" />

            <Button
              className="h-11 w-[160px] rounded-lg text-sm font-bold"
              color="primary"
              variant="shadow"
              isLoading={isLoading}
              onPress={handleJoinWaitlist}
            >
              {isSuccess ? 'Joined!' : 'Join Waitlist'}
            </Button>
          </div>
        }
      />
    </div>
  )
}
