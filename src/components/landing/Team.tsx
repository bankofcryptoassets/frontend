/* eslint-disable @next/next/no-img-element */
'use client'
import { Card, Chip, cn } from '@heroui/react'
import { useTheme } from 'next-themes'
import { subtitle, title } from '../primitives'
import { MagicCard } from '../MagicCard'
import { FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import Link from 'next/link'

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
    image: 'https://placehold.co/200?text=Jose+Paul',
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
    role: 'Back End',
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
          <Chip color="primary" classNames={{ content: 'font-semibold' }}>
            MEET THE TEAM
          </Chip>

          <h2 className={title({ size: 'xs' })}>Built by Crypto Natives</h2>

          <p className={subtitle()}>
            We&apos;re builders from crypto-native backgrounds, focused on
            making BTC ownership and yield radically accessible.
          </p>
        </div>

        <div>
          <div className="mt-6 grid grid-cols-4 gap-6 max-xl:grid-cols-2 max-md:grid-cols-1">
            {TEAM?.map((item, index) => {
              return (
                <Card
                  className="w-full max-w-xs bg-default/35 shadow-[2px_4px_16px_0px_hsl(var(--heroui-default-200))_inset]"
                  radius="md"
                  key={index}
                >
                  <MagicCard
                    gradientColor={theme === 'dark' ? '#333333' : '#D9D9D9aa'}
                    className="h-full p-0"
                  >
                    <div className="space-y-3 p-6 pb-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        width={200}
                        height={200}
                        className="h-full w-full rounded object-cover"
                      />

                      <div>
                        <div className="text-xl font-semibold">{item.name}</div>
                        <div className="font-medium text-primary">
                          {item.role}
                        </div>
                      </div>

                      <p className="text-sm text-default-700">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
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
