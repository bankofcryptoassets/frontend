import axios from '@/utils/axios'
import { Button } from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import { FaXTwitter } from 'react-icons/fa6'
import { SiFarcaster } from 'react-icons/si'

export const ShareButtons = ({
  amount,
  type,
}: {
  amount?: number | string
  type: 'loan' | 'deposit'
}) => {
  const { mutateAsync: shareSocial, isPending: isSharingSocial } = useMutation({
    mutationFn: ({
      btcAmount,
      platform,
      type,
    }: {
      btcAmount: number | string
      platform: 'twitter' | 'farcaster'
      type: 'loan' | 'deposit'
    }) => {
      return axios.post(
        `/socials/share/?type=${type}&amount=${btcAmount}&platform=${platform}`
      )
    },
  })

  return (
    <>
      <Button
        className="w-full bg-[#000000] font-medium"
        startContent={<FaXTwitter size={20} />}
        isLoading={isSharingSocial}
        onPress={() => {
          if (!amount) return

          shareSocial({ btcAmount: amount, platform: 'twitter', type }).then(
            (data) => {
              console.log(data)
            }
          )
        }}
      >
        Share on X (Twitter)
      </Button>

      <Button
        className="w-full bg-[#7c65c1] font-medium"
        startContent={<SiFarcaster size={20} />}
        isLoading={isSharingSocial}
        onPress={() => {
          if (!amount) return

          shareSocial({ btcAmount: amount, platform: 'farcaster', type }).then(
            (data) => {
              console.log(data)
            }
          )
        }}
      >
        Share on Farcaster
      </Button>
    </>
  )
}
