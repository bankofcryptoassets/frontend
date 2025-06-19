/* eslint-disable @next/next/no-img-element */
'use client'
import { Card, cn } from '@heroui/react'
import { useTheme } from 'next-themes'
import { title } from '../primitives'
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
    image: '/team/jose.jpeg',
    name: 'Jose Paul',
    role: 'Product & BD',
    description:
      'Leading product strategy and business development with 5+ years in fintech.',
    social: [
      {
        name: 'linkedin',
        href: 'https://www.linkedin.com/in/josepaul0/',
      },
      {
        name: 'website',
        href: 'https://josepaul-jp.replit.app/',
      },
    ],
  },
  {
    image: '/team/sudeep.jpeg',
    name: 'Sudeep Kamat',
    role: 'Smart Contracts',
    description:
      'Solidity expert specializing in DeFi security and optimization.',
    social: [
      {
        name: 'linkedin',
        href: 'https://www.linkedin.com/in/sudeep-kamat/',
      },
    ],
  },
  {
    image: 'https://placehold.co/200?text=Suryansh+Chandak',
    name: 'Suryansh Chandak',
    role: 'DeFi Strategy',
    description:
      'Building simulations and finanical modelling for optimised yields.',
    social: [
      {
        name: 'github',
        href: 'https://github.com/suryanshchandak',
      },
      {
        name: 'linkedin',
        href: 'https://www.linkedin.com/in/suryanshchandak/',
      },
    ],
  },
  {
    image: 'https://placehold.co/200?text=Shreyas+Padmakiran',
    name: 'Shreyas Padmakiran',
    role: 'Tech Lead',
    description:
      'System architecture specialist focused on scalability and performance.',
    social: [
      {
        name: 'github',
        href: 'https://github.com/shreyaspm',
      },
      {
        name: 'linkedin',
        href: 'https://www.linkedin.com/in/shreyaspm/',
      },
    ],
  },
] as const

export const Team = () => {
  const { resolvedTheme: theme } = useTheme()

  return (
    <section className="container py-20 max-lg:py-16" id="team">
      <div className="flex w-full flex-col items-center justify-center gap-6">
        <div className="flex w-full flex-col items-center justify-center gap-3 text-center">
          <h2 className={title({ size: 'xs', className: 'text-primary' })}>
            Built by Crypto Natives
          </h2>

          <p className="text-balance text-center text-lg text-default-d">
            We&apos;re builders from crypto-native backgrounds, focused on
            making BTC ownership and yield radically accessible.
          </p>
        </div>

        <div>
          <div className="mt-6 grid grid-cols-4 gap-6 max-xl:grid-cols-2 max-md:grid-cols-1">
            {TEAM?.map((item, index) => {
              return (
                <Card
                  className="w-full max-w-xs rounded-2xl bg-default/35 shadow-[2px_4px_16px_0px_hsl(var(--heroui-default-200))_inset]"
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
                          className="aspect-[252/196] w-full rounded-xl object-cover"
                        />
                      ) : (
                        <img
                          src={item.image}
                          alt={item.name}
                          width={252}
                          height={196}
                          className="aspect-[252/196] w-full rounded-xl object-cover"
                        />
                      )}

                      <div className="mt-1 px-1">
                        <div className="text-xl font-semibold">{item.name}</div>
                        <div className="font-medium text-primary">
                          {item.role}
                        </div>
                      </div>

                      <p className="!mb-3 px-1 text-sm text-default-700">
                        {item.description}
                      </p>

                      <div className="!mt-auto flex flex-wrap items-center gap-2 px-1">
                        {item.social.map((social, index) => {
                          return (
                            <Link
                              target="_blank"
                              rel="noopener noreferrer"
                              key={index}
                              href={social.href}
                              className={cn(
                                'rounded-full p-2 text-sm text-default-700 transition-colors',
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
