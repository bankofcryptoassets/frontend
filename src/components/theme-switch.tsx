'use client'
import { FC } from 'react'
import { VisuallyHidden } from '@react-aria/visually-hidden'
import { SwitchProps, useSwitch } from '@heroui/switch'
import { useTheme } from 'next-themes'
import { useIsSSR } from '@react-aria/ssr'
import { SunFilledIcon, MoonFilledIcon } from '@/components/icons'
import { cn, Tooltip } from '@heroui/react'

export interface ThemeSwitchProps {
  className?: string
  classNames?: SwitchProps['classNames']
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const { theme, setTheme } = useTheme()
  const isSSR = useIsSSR()

  const onChange = () =>
    theme === 'light' ? setTheme('dark') : setTheme('light')

  const tooltipContent = `Switch to ${theme === 'light' || isSSR ? 'dark' : 'light'} mode`

  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: theme === 'light' || isSSR,
    'aria-label': tooltipContent,
    onChange,
  })

  return (
    <Tooltip content={tooltipContent}>
      <Component
        {...getBaseProps({
          className: cn(
            'px-px transition-opacity hover:opacity-80 cursor-pointer',
            className,
            classNames?.base
          ),
        })}
      >
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <div
          {...getWrapperProps()}
          className={slots.wrapper({
            class: cn(
              [
                'h-auto w-auto',
                'bg-default',
                'rounded-xl',
                'flex items-center justify-center',
                'group-data-[selected=true]:bg-default',
                '!text-foreground',
                'p-1.5 lg:p-2.5',
              ],
              classNames?.wrapper
            ),
          })}
        >
          {!isSelected || isSSR ? (
            <SunFilledIcon size={20} />
          ) : (
            <MoonFilledIcon size={20} />
          )}
        </div>
      </Component>
    </Tooltip>
  )
}
