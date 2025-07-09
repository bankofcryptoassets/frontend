import { Button, Divider, Input } from '@heroui/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export const JoinWishlist = () => {
  const router = useRouter()
  return (
    <Input
      placeholder="Early access = better terms"
      className="h-[60px] w-full max-w-[720px] rounded-xl"
      classNames={{
        mainWrapper: 'w-full',
        inputWrapper: 'h-[60px] rounded-xl w-full pl-5 pr-2 !bg-[#F5F5F5] ',
        innerWrapper: 'w-full',
        input: '!text-black placeholder:text-[#666666]',
      }}
      size="lg"
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
          >
            Join Waitlist
          </Button>
        </div>
      }
    />
  )
}
