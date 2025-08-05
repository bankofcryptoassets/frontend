'use client'

import {
  Button,
  ButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from '@heroui/react'
import Image from 'next/image'
import { ReactNode } from 'react'
import { useConfettiFireworks } from '../hooks/useConfettiFireworks'

type StyledModalProps = {
  iconSrc: string
  title: string
  description: ReactNode
  primaryButtonText: string
  primaryButtonProps?: ButtonProps
  secondaryButtonText?: string
  secondaryButtonProps?: ButtonProps
  showConfetti?: boolean
  continueConfettiIndefinitely?: boolean
}

export const StyledModal = ({
  iconSrc,
  title,
  description,
  primaryButtonText,
  primaryButtonProps,
  secondaryButtonText,
  secondaryButtonProps,
  showConfetti,
  continueConfettiIndefinitely,
  ...props
}: Partial<ModalProps> & StyledModalProps) => {
  useConfettiFireworks(
    !!(showConfetti && props?.isOpen),
    continueConfettiIndefinitely
  )

  return (
    <Modal
      {...props}
      backdrop="blur"
      classNames={{
        backdrop: 'bg-black/50 backdrop-blur-sm',
        base: 'border border-foreground/10',
        closeButton:
          'bg-foreground/10 p-1 top-5 right-5! hover:bg-foreground/15 transition-colors',
      }}
      size="sm"
    >
      <ModalContent>
        <ModalHeader className="border-default-200/40 mt-1 justify-center border-b">
          <h2>{title}</h2>
        </ModalHeader>

        <ModalBody>
          <div className="flex flex-col items-center justify-center gap-5 py-10">
            <Image src={iconSrc} alt={title} width={60} height={60} />

            <div className="text-default-d text-center text-pretty">
              {description}
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex-col pt-0 pb-6">
          <Button
            className="w-full font-bold text-white"
            {...primaryButtonProps}
          >
            {primaryButtonText}
          </Button>

          {secondaryButtonText && (
            <Button
              className="text-default-a w-full font-bold"
              variant="light"
              {...secondaryButtonProps}
            >
              {secondaryButtonText}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
