/* eslint-disable @next/next/no-img-element */
'use client'
import { Card, cn } from '@heroui/react'
import { useTheme } from 'next-themes'
import { MagicCard } from '../MagicCard'
import { FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import Link from 'next/link'
import Image from 'next/image'

const SOCIAL_ICONS = {
  github: <FaGithub size={20} />,
  linkedin: <FaLinkedin size={20} />,
  x: <FaXTwitter size={20} />,
  website: <FaGlobe size={20} />,
} as const

const SOCIAL_COLORS = {
  github: 'hover:bg-default-900 hover:text-default-50',
  linkedin:
    'hover:bg-default-50 dark:hover:bg-default-900 hover:text-[#0077B5]',
  x: 'hover:bg-default-900 hover:text-default-50',
  website: 'hover:bg-default-900 hover:text-default-50',
}

const TEAM = [
  {
    image: '/team/jose.png',
    name: 'Jose Paul',
    role: 'Product & BD',
    description:
      'Product lead and BD specialist, securing and growing Web3 ecosystems for 5+ years.',
    social: [
      { name: 'linkedin', href: 'https://www.linkedin.com/in/josepaul0/' },
      { name: 'x', href: 'https://x.com/josepaul_jp' },
      { name: 'website', href: 'https://josepaul-jp.replit.app/' },
    ],
  },
  {
    image: '/team/suryansh.png',
    name: 'Suryansh Chandak',
    role: 'DeFi Strategy',
    description:
      'Building simulations and finanical modelling for optimised yields.',
    social: [
      {
        name: 'linkedin',
        href: 'https://www.linkedin.com/in/suryansh-chandak/',
      },
      { name: 'x', href: 'https://x.com/SuryChandak' },
    ],
  },
  {
    image: '/team/shreyas.png',
    name: 'Shreyas Padmakiran',
    role: 'Tech Lead',
    description:
      'System architecture specialist focused on scalability and performance.',
    social: [
      { name: 'github', href: 'https://github.com/gitshreevatsa' },
      {
        name: 'linkedin',
        href: 'https://www.linkedin.com/in/shreyas-padmakiran/',
      },
      { name: 'x', href: 'https://x.com/sakai_thezkguy' },
    ],
  },
  {
    image: '/team/sudeep.png',
    name: 'Sudeep Kamat',
    role: 'Smart Contracts',
    description:
      'Solidity expert specializing in DeFi security and optimization.',
    social: [
      { name: 'github', href: 'https://github.com/muskbuster' },
      { name: 'linkedin', href: 'https://www.linkedin.com/in/sudeep-kamat/' },
      { name: 'x', href: 'https://x.com/sudeepskamat' },
    ],
  },
] as const

export const Team = () => {
  const { resolvedTheme: theme } = useTheme()

  return (
    <section className="container py-20 max-lg:py-16" id="team">
      <div className="flex w-full flex-col items-center justify-center gap-6">
        <div className="flex w-full flex-col items-center justify-center gap-3 text-center">
          <h2 className="text-primary inline text-2xl font-bold tracking-tight lg:text-[32px]">
            Built by Crypto Natives
          </h2>

          <p className="text-default-d text-center text-lg text-balance">
            We&apos;re builders from crypto-native backgrounds, focused on
            making BTC ownership and yield radically accessible.
          </p>
        </div>

        <div>
          <div className="mt-6 grid grid-cols-4 gap-6 max-xl:grid-cols-2 max-md:grid-cols-1">
            {TEAM?.map((item, index) => {
              return (
                <Card
                  className="bg-default/35 w-full max-w-xs rounded-2xl shadow-[2px_4px_16px_0px_hsl(var(--heroui-default-200))_inset]"
                  key={index}
                >
                  <MagicCard
                    gradientColor={theme === 'dark' ? '#333333' : '#D9D9D9aa'}
                    className="h-full p-0"
                  >
                    <div className="flex h-full flex-col space-y-3 p-4">
                      {item.image.startsWith('/') ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={252}
                          height={196}
                          className="aspect-252/196 w-full rounded-xl object-cover"
                        />
                      ) : (
                        <img
                          src={item.image}
                          alt={item.name}
                          width={252}
                          height={196}
                          className="aspect-252/196 w-full rounded-xl object-cover"
                        />
                      )}

                      <div className="mt-1 px-1">
                        <div className="text-xl font-semibold">{item.name}</div>
                        <div className="text-primary font-medium">
                          {item.role}
                        </div>
                      </div>

                      <p className="text-default-700 mb-3! px-1 text-sm">
                        {item.description}
                      </p>

                      <div className="mt-auto! flex flex-wrap items-center gap-2 px-1">
                        {item.social.map((social, index) => {
                          return (
                            <Link
                              target="_blank"
                              rel="noopener noreferrer"
                              key={index}
                              href={social.href}
                              className={cn(
                                'text-default-700 rounded-full p-2 text-sm transition-colors',
                                SOCIAL_COLORS[social.name]
                              )}
                            >
                              {SOCIAL_ICONS[social.name]}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </MagicCard>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
